import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  articleFeedbackSchema,
  createArticleSchema,
  listArticlesQuerySchema,
  updateArticleSchema,
} from './kb.schema';
import { KnowledgeBaseService } from './kb.service';

const kbService = new KnowledgeBaseService();

export class KnowledgeBaseController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listArticlesQuerySchema.parse(request.query);
    const articles = await kbService.listArticles(query);
    return reply.status(200).send(articles);
  }

  async getByIdOrSlug(request: FastifyRequest, reply: FastifyReply) {
    const { idOrSlug } = z.object({ idOrSlug: z.string().min(1) }).parse(request.params);
    const article = await kbService.getArticleByIdOrSlug(idOrSlug, true);
    return reply.status(200).send(article);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createArticleSchema.parse(request.body);
    const created = await kbService.createArticle(request.user.id, input);
    return reply.status(201).send(created);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateArticleSchema.parse(request.body);
    const updated = await kbService.updateArticle(id, input);
    return reply.status(200).send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const result = await kbService.deleteArticle(id);
    return reply.status(200).send(result);
  }

  async feedback(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = articleFeedbackSchema.parse(request.body);
    const userId = request.user?.id;
    const userIp = request.ip;
    const result = await kbService.registerFeedback(id, userId, userIp, input);
    return reply.status(200).send(result);
  }
}
