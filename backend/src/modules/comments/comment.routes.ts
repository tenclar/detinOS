import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { CommentController } from './comment.controller';

const commentController = new CommentController();

export async function commentRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post('/tickets/:ticketId/comments', {
    schema: {
      tags: ['Interações & Histórico de Chamados'],
      summary: 'Adicionar mensagem ou nota interna a um chamado',
      security: [{ bearerAuth: [] }],
    },
    handler: commentController.create.bind(commentController),
  });

  fastify.get('/tickets/:ticketId/comments', {
    schema: {
      tags: ['Interações & Histórico de Chamados'],
      summary: 'Listar interações de um chamado',
      security: [{ bearerAuth: [] }],
    },
    handler: commentController.list.bind(commentController),
  });
}
