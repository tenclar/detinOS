import { CommentType, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ForbiddenError, NotFoundError } from '../../utils/app-error';
import { CreateCommentInput } from './comment.schema';

export class CommentService {
  async addComment(
    ticketId: string,
    currentUser: { id: string; name: string; role: Role },
    input: CreateCommentInput
  ) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    // Validação de acesso: se for usuário comum, deve ser o autor do chamado
    if (currentUser.role === Role.USUARIO_COMUM && ticket.authorId !== currentUser.id) {
      throw new ForbiddenError('Você não tem permissão para interagir neste chamado');
    }

    const isInternal = currentUser.role === Role.USUARIO_COMUM ? false : input.isInternal;
    const commentType = currentUser.role === Role.USUARIO_COMUM ? CommentType.USER : CommentType.TECH;

    const comment = await prisma.$transaction(async (tx) => {
      // Se for a primeira resposta de um técnico, registra firstRespondedAt
      if (commentType === CommentType.TECH && !ticket.firstRespondedAt) {
        await tx.ticket.update({
          where: { id: ticketId },
          data: { firstRespondedAt: new Date() },
        });
      }

      return tx.comment.create({
        data: {
          ticketId,
          authorId: currentUser.id,
          type: commentType,
          content: input.content,
          isInternal,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true, username: true, role: true },
          },
        },
      });
    });

    return comment;
  }

  async listComments(ticketId: string, currentUser: { id: string; role: Role }) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Chamado não encontrado');
    }

    if (currentUser.role === Role.USUARIO_COMUM && ticket.authorId !== currentUser.id) {
      throw new ForbiddenError('Você não tem permissão para visualizar este chamado');
    }

    const where = {
      ticketId,
      ...(currentUser.role === Role.USUARIO_COMUM ? { isInternal: false } : {}),
    };

    return prisma.comment.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, username: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
