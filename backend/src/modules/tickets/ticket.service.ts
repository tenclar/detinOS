import { CommentType, Prisma, Role, TicketStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/app-error';
import { generateTicketProtocol } from '../../utils/protocol-generator';
import { calculateTicketSla } from '../../utils/sla-calculator';
import {
  AssignTicketInput,
  CreateTicketInput,
  ListTicketsQuery,
  PauseSlaInput,
  UpdateTicketStatusInput,
} from './ticket.schema';

export class TicketService {
  async createTicket(authorId: string, input: CreateTicketInput) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new NotFoundError('Categoria selecionada não foi encontrada');
    }

    // Busca dados do usuário para preenchimento de setor/órgão padrão se não informados
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    const departmentId = input.departmentId || user?.departmentId || null;
    const partnerAgencyId = input.partnerAgencyId || user?.partnerAgencyId || null;

    // Calcula prazos de SLA e criticidade
    const { slaFirstResponseAt, slaResolutionAt, priority } = calculateTicketSla(
      category.slaFirstResponseMin,
      category.slaResolutionMin,
      input.urgency
    );

    // Gera protocolo sequencial anual
    const protocol = await generateTicketProtocol();

    // Cria o chamado e o primeiro comentário no mesmo fluxo transacional
    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.ticket.create({
        data: {
          protocol,
          title: input.title,
          description: input.description,
          status: TicketStatus.NOVO,
          priority,
          urgency: input.urgency,
          location: input.location,
          contact: input.contact,
          authorId,
          categoryId: input.categoryId,
          departmentId,
          partnerAgencyId,
          slaFirstResponseAt,
          slaResolutionAt,
        },
        include: {
          author: { select: { id: true, name: true, email: true, username: true } },
          category: { select: { id: true, name: true, slaFirstResponseMin: true, slaResolutionMin: true } },
          department: { select: { id: true, name: true, acronym: true } },
          partnerAgency: { select: { id: true, name: true, acronym: true } },
        },
      });

      // Cria a mensagem inicial do solicitante no histórico
      await tx.comment.create({
        data: {
          ticketId: createdTicket.id,
          authorId,
          type: CommentType.USER,
          content: input.description,
          isInternal: false,
        },
      });

      // Registra o evento de sistema
      await tx.comment.create({
        data: {
          ticketId: createdTicket.id,
          type: CommentType.SYSTEM,
          content: `Chamado aberto com sucesso (Protocolo #${protocol}). Prioridade: ${priority}.`,
          isInternal: false,
        },
      });

      return createdTicket;
    });

    return ticket;
  }

  async listTickets(currentUser: { id: string; role: Role }, query: ListTicketsQuery) {
    const where: Prisma.TicketWhereInput = {};

    // Usuário comum só pode ver chamados criados por ele
    if (currentUser.role === Role.USUARIO_COMUM) {
      where.authorId = currentUser.id;
    } else {
      // Filtros específicos para técnicos e gestores
      if (query.onlyMine) {
        where.assigneeId = currentUser.id;
      } else if (query.assigneeId) {
        where.assigneeId = query.assigneeId;
      }

      if (query.authorId) {
        where.authorId = query.authorId;
      }
    }

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.partnerAgencyId) where.partnerAgencyId = query.partnerAgencyId;

    if (query.overdueOnly) {
      where.status = { in: [TicketStatus.NOVO, TicketStatus.EM_ANDAMENTO, TicketStatus.AGUARDANDO_USUARIO] };
      where.slaResolutionAt = { lt: new Date() };
    }

    if (query.search) {
      where.OR = [
        { protocol: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { author: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true, username: true, contact: true } },
          assignee: { select: { id: true, name: true, email: true, username: true } },
          category: { select: { id: true, name: true } },
          department: { select: { id: true, name: true, acronym: true } },
          partnerAgency: { select: { id: true, name: true, acronym: true } },
          _count: { select: { comments: true, attachments: true } },
        },
        orderBy: [
          { priority: 'desc' }, // CRITICA first
          { createdAt: 'desc' },
        ],
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getTicketByIdOrProtocol(identifier: string, currentUser: { id: string; role: Role }) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const ticket = await prisma.ticket.findUnique({
      where: isUuid ? { id: identifier } : { protocol: identifier },
      include: {
        author: { select: { id: true, name: true, email: true, username: true, contact: true } },
        assignee: { select: { id: true, name: true, email: true, username: true } },
        category: true,
        department: true,
        partnerAgency: true,
        attachments: {
          include: {
            uploadedBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        comments: {
          where: currentUser.role === Role.USUARIO_COMUM ? { isInternal: false } : {},
          include: {
            author: { select: { id: true, name: true, email: true, username: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    // Checagem de permissão: usuário comum só pode ver seus próprios chamados
    if (currentUser.role === Role.USUARIO_COMUM && ticket.authorId !== currentUser.id) {
      throw new ForbiddenError('Você não tem permissão para visualizar este chamado');
    }

    return ticket;
  }

  async assignTicket(
    ticketId: string,
    currentUser: { id: string; name: string; role: Role },
    input: AssignTicketInput
  ) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    const targetAssigneeId = input.assigneeId !== undefined ? input.assigneeId : currentUser.id;

    let assigneeName = 'Nenhum';
    if (targetAssigneeId) {
      const assigneeUser = await prisma.user.findUnique({ where: { id: targetAssigneeId } });
      if (!assigneeUser) {
        throw new NotFoundError('Técnico não encontrado');
      }
      assigneeName = assigneeUser.name;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const newStatus = ticket.status === TicketStatus.NOVO ? TicketStatus.EM_ANDAMENTO : ticket.status;
      const firstRespondedAt = !ticket.firstRespondedAt ? new Date() : ticket.firstRespondedAt;

      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          assigneeId: targetAssigneeId,
          status: newStatus,
          firstRespondedAt,
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      });

      await tx.comment.create({
        data: {
          ticketId,
          authorId: currentUser.id,
          type: CommentType.SYSTEM,
          content: targetAssigneeId
            ? `${currentUser.name} atribuiu o chamado para ${assigneeName}.`
            : `${currentUser.name} removeu a atribuição do chamado.`,
          isInternal: false,
        },
      });

      return updatedTicket;
    });

    return updated;
  }

  async updateTicketStatus(
    ticketId: string,
    currentUser: { id: string; name: string; role: Role },
    input: UpdateTicketStatusInput
  ) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    const dataToUpdate: Prisma.TicketUpdateInput = {
      status: input.status,
    };

    if (input.status === TicketStatus.CONCLUIDO) {
      dataToUpdate.resolvedAt = new Date();
      dataToUpdate.closedAt = new Date();
    } else if (input.status === TicketStatus.CANCELADO) {
      dataToUpdate.closedAt = new Date();
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.ticket.update({
        where: { id: ticketId },
        data: dataToUpdate,
      });

      const justificationMsg = input.justification ? ` Justificativa: ${input.justification}` : '';
      await tx.comment.create({
        data: {
          ticketId,
          authorId: currentUser.id,
          type: CommentType.SYSTEM,
          content: `Status do chamado alterado para "${input.status}" por ${currentUser.name}.${justificationMsg}`,
          isInternal: false,
        },
      });

      return res;
    });

    return updated;
  }

  async pauseSla(ticketId: string, currentUser: { id: string; name: string }, input: PauseSlaInput) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    const now = new Date();
    let totalPausedMinutes = ticket.totalPausedMinutes;

    if (!input.paused && ticket.isSlaPaused && ticket.pausedAt) {
      const diffMs = now.getTime() - ticket.pausedAt.getTime();
      totalPausedMinutes += Math.round(diffMs / (60 * 1000));
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          isSlaPaused: input.paused,
          pausedAt: input.paused ? now : null,
          totalPausedMinutes,
        },
      });

      await tx.comment.create({
        data: {
          ticketId,
          authorId: currentUser.id,
          type: CommentType.SYSTEM,
          content: input.paused
            ? `Contagem de SLA pausada por ${currentUser.name}.${input.reason ? ` Motivo: ${input.reason}` : ''}`
            : `Contagem de SLA retomada por ${currentUser.name}.`,
          isInternal: false,
        },
      });

      return res;
    });

    return updated;
  }
}
