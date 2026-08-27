import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createUserSchema, listUsersQuerySchema, resetUserPasswordSchema, updateUserSchema } from './user.schema';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listUsersQuerySchema.parse(request.query);
    const users = await userService.listUsers(query);
    return reply.status(200).send(users);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const user = await userService.getUserById(id);
    return reply.status(200).send(user);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createUserSchema.parse(request.body);
    const user = await userService.createUser(input);
    return reply.status(201).send(user);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateUserSchema.parse(request.body);
    const updated = await userService.updateUser(id, input);
    return reply.status(200).send(updated);
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = resetUserPasswordSchema.parse(request.body);
    const result = await userService.resetPassword(id, input);
    return reply.status(200).send(result);
  }
}
