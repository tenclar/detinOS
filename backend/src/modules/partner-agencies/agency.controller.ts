import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createAgencySchema, updateAgencySchema } from './agency.schema';
import { PartnerAgencyService } from './agency.service';

const agencyService = new PartnerAgencyService();

export class PartnerAgencyController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const list = await agencyService.listAll();
    return reply.status(200).send(list);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const agency = await agencyService.getById(id);
    return reply.status(200).send(agency);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createAgencySchema.parse(request.body);
    const created = await agencyService.create(input);
    return reply.status(201).send(created);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateAgencySchema.parse(request.body);
    const updated = await agencyService.update(id, input);
    return reply.status(200).send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const result = await agencyService.delete(id);
    return reply.status(200).send(result);
  }
}
