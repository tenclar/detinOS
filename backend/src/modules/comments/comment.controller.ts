import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createCommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

const commentService = new CommentService();

export class CommentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { ticketId } = z.object({ ticketId: z.string().uuid() }).parse(request.params);
    const input = createCommentSchema.parse(request.body);
    const comment = await commentService.addComment(ticketId, request.user, input);
    return reply.status(201).send(comment);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { ticketId } = z.object({ ticketId: z.string().uuid() }).parse(request.params);
    const comments = await commentService.listComments(ticketId, request.user);
    return reply.status(200).send(comments);
  }
}
