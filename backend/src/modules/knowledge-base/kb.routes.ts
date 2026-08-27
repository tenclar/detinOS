import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { KnowledgeBaseController } from './kb.controller';

const kbController = new KnowledgeBaseController();

export async function kbRoutes(fastify: FastifyInstance) {
  // Leitura pública/geral da base de conhecimento (com ou sem token)
  fastify.get('/', {
    schema: {
      tags: ['Base de Conhecimento'],
      summary: 'Listar artigos com busca e filtros de categoria',
    },
    handler: kbController.list.bind(kbController),
  });

  fastify.get('/:idOrSlug', {
    schema: {
      tags: ['Base de Conhecimento'],
      summary: 'Obter artigo por ID ou Slug (incrementa visualizações)',
    },
    handler: kbController.getByIdOrSlug.bind(kbController),
  });

  fastify.post('/:id/feedback', {
    schema: {
      tags: ['Base de Conhecimento'],
      summary: 'Votar em artigo (útil / não útil)',
    },
    handler: kbController.feedback.bind(kbController),
  });

  // Rotas restritas para criação, edição e exclusão de artigos
  fastify.register(async (restricted) => {
    restricted.addHook('onRequest', authenticate);

    restricted.post('/', {
      schema: {
        tags: ['Base de Conhecimento'],
        summary: 'Criar novo artigo na base de conhecimento',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
      handler: kbController.create.bind(kbController),
    });

    restricted.put('/:id', {
      schema: {
        tags: ['Base de Conhecimento'],
        summary: 'Atualizar artigo da base de conhecimento',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
      handler: kbController.update.bind(kbController),
    });

    restricted.delete('/:id', {
      schema: {
        tags: ['Base de Conhecimento'],
        summary: 'Excluir artigo da base de conhecimento',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
      handler: kbController.delete.bind(kbController),
    });
  });
}
