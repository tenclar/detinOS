import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { PartnerAgencyController } from './agency.controller';

const agencyController = new PartnerAgencyController();

export async function agencyRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.get('/', {
    schema: {
      tags: ['Órgãos Parceiros'],
      summary: 'Listar órgãos parceiros',
      security: [{ bearerAuth: [] }],
    },
    handler: agencyController.list.bind(agencyController),
  });

  fastify.get('/:id', {
    schema: {
      tags: ['Órgãos Parceiros'],
      summary: 'Obter detalhes de um órgão parceiro',
      security: [{ bearerAuth: [] }],
    },
    handler: agencyController.getById.bind(agencyController),
  });

  fastify.post('/', {
    schema: {
      tags: ['Órgãos Parceiros'],
      summary: 'Criar órgão parceiro',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: agencyController.create.bind(agencyController),
  });

  fastify.put('/:id', {
    schema: {
      tags: ['Órgãos Parceiros'],
      summary: 'Atualizar órgão parceiro',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: agencyController.update.bind(agencyController),
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['Órgãos Parceiros'],
      summary: 'Remover órgão parceiro',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN)],
    handler: agencyController.delete.bind(agencyController),
  });
}
