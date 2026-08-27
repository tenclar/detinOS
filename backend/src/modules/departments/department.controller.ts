import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createDepartmentSchema, updateDepartmentSchema } from './department.schema';
import { DepartmentService } from './department.service';

const departmentService = new DepartmentService();

export class DepartmentController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const list = await departmentService.listAll();
    return reply.status(200).send(list);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const department = await departmentService.getById(id);
    return reply.status(200).send(department);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createDepartmentSchema.parse(request.body);
    const created = await departmentService.create(input);
    return reply.status(201).send(created);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateDepartmentSchema.parse(request.body);
    const updated = await departmentService.update(id, input);
    return reply.status(200).send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const result = await departmentService.delete(id);
    return reply.status(200).send(result);
  }
}
