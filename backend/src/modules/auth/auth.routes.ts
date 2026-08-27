import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { AuthController } from './auth.controller';

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  // Rota pública de login
  fastify.post('/login', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Login do usuário',
      description: 'Autentica um usuário com email/login e senha, retornando token JWT e dados do perfil.',
    },
    handler: authController.login.bind(authController),
  });

  // Rotas autenticadas
  fastify.get('/me', {
    onRequest: [authenticate],
    schema: {
      tags: ['Autenticação'],
      summary: 'Perfil do usuário logado',
      security: [{ bearerAuth: [] }],
    },
    handler: authController.me.bind(authController),
  });

  fastify.patch('/change-password', {
    onRequest: [authenticate],
    schema: {
      tags: ['Autenticação'],
      summary: 'Alteração de senha',
      security: [{ bearerAuth: [] }],
    },
    handler: authController.changePassword.bind(authController),
  });
}
