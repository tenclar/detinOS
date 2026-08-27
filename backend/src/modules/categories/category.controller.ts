import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createCategorySchema, updateCategorySchema } from './category.schema';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export class CategoryController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const list = await categoryService.listAll();
    return reply.status(200).send(list);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const category = await categoryService.getById(id);
    return reply.status(200).send(category);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createCategorySchema.parse(request.body);
    const created = await categoryService.create(input);
    return reply.status(201).send(created);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateCategorySchema.parse(request.body);
    const updated = await categoryService.update(id, input);
    return reply.status(200).send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const result = await categoryService.delete(id);
    return reply.status(200).send(result);
  }
}
