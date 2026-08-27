import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { UserController } from './user.controller';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  // Listar usuários (Admin, Gestor e Técnico podem consultar usuários)
  fastify.get('/', {
    schema: {
      tags: ['Usuários'],
      summary: 'Listar usuários com filtros',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: userController.list.bind(userController),
  });

  // Obter usuário por ID
  fastify.get('/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Obter detalhes de um usuário',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: userController.getById.bind(userController),
  });

  // Criar usuário (Apenas Admin e Gestor)
  fastify.post('/', {
    schema: {
      tags: ['Usuários'],
      summary: 'Criar novo usuário',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: userController.create.bind(userController),
  });

  // Atualizar usuário (Apenas Admin e Gestor)
  fastify.put('/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar dados de um usuário',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: userController.update.bind(userController),
  });

  // Resetar senha de um usuário (Apenas Admin)
  fastify.patch('/:id/reset-password', {
    schema: {
      tags: ['Usuários'],
      summary: 'Redefinir senha de um usuário',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN)],
    handler: userController.resetPassword.bind(userController),
  });
}
