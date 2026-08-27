import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { DepartmentController } from './department.controller';

const departmentController = new DepartmentController();

export async function departmentRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.get('/', {
    schema: {
      tags: ['Setores Internos'],
      summary: 'Listar setores internos',
      security: [{ bearerAuth: [] }],
    },
    handler: departmentController.list.bind(departmentController),
  });

  fastify.get('/:id', {
    schema: {
      tags: ['Setores Internos'],
      summary: 'Obter detalhes de um setor',
      security: [{ bearerAuth: [] }],
    },
    handler: departmentController.getById.bind(departmentController),
  });

  fastify.post('/', {
    schema: {
      tags: ['Setores Internos'],
      summary: 'Criar setor interno',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: departmentController.create.bind(departmentController),
  });

  fastify.put('/:id', {
    schema: {
      tags: ['Setores Internos'],
      summary: 'Atualizar setor interno',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: departmentController.update.bind(departmentController),
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['Setores Internos'],
      summary: 'Remover setor interno',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN)],
    handler: departmentController.delete.bind(departmentController),
  });
}
