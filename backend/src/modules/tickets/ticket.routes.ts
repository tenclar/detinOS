import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { TicketController } from './ticket.controller';

const ticketController = new TicketController();

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  // Abertura de chamado (qualquer usuário autenticado)
  fastify.post('/', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Abrir novo chamado',
      security: [{ bearerAuth: [] }],
    },
    handler: ticketController.create.bind(ticketController),
  });

  // Listagem de chamados (com filtros)
  fastify.get('/', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Listar chamados com filtros e paginação',
      security: [{ bearerAuth: [] }],
    },
    handler: ticketController.list.bind(ticketController),
  });

  // Detalhes de um chamado por ID ou Protocolo
  fastify.get('/:idOrProtocol', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Obter detalhes de um chamado por ID ou Protocolo',
      security: [{ bearerAuth: [] }],
    },
    handler: ticketController.getByIdOrProtocol.bind(ticketController),
  });

  // Atribuir/Assumir chamado (Técnicos, Gestores e Admins)
  fastify.patch('/:id/assign', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Assumir ou atribuir chamado para um técnico',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: ticketController.assign.bind(ticketController),
  });

  // Atualizar status do chamado (Em andamento, Concluído, Cancelado)
  fastify.patch('/:id/status', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Alterar status de um chamado',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: ticketController.updateStatus.bind(ticketController),
  });

  // Pausar / Retomar contagem de SLA
  fastify.patch('/:id/pause-sla', {
    schema: {
      tags: ['Chamados & Ordens de Serviço'],
      summary: 'Pausar ou retomar a contagem de SLA do chamado',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: ticketController.pauseSla.bind(ticketController),
  });
}
