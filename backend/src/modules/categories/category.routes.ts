import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { CategoryController } from './category.controller';

const categoryController = new CategoryController();

export async function categoryRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.get('/', {
    schema: {
      tags: ['Categorias & SLA'],
      summary: 'Listar todas as categorias e regras de SLA',
      security: [{ bearerAuth: [] }],
    },
    handler: categoryController.list.bind(categoryController),
  });

  fastify.get('/:id', {
    schema: {
      tags: ['Categorias & SLA'],
      summary: 'Obter detalhes de uma categoria',
      security: [{ bearerAuth: [] }],
    },
    handler: categoryController.getById.bind(categoryController),
  });

  fastify.post('/', {
    schema: {
      tags: ['Categorias & SLA'],
      summary: 'Criar nova categoria e parametrização de SLA',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: categoryController.create.bind(categoryController),
  });

  fastify.put('/:id', {
    schema: {
      tags: ['Categorias & SLA'],
      summary: 'Atualizar categoria e parametrização de SLA',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: categoryController.update.bind(categoryController),
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['Categorias & SLA'],
      summary: 'Remover categoria',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN)],
    handler: categoryController.delete.bind(categoryController),
  });
}
