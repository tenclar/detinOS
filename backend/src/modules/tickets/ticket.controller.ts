import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  assignTicketSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  pauseSlaSchema,
  updateTicketStatusSchema,
} from './ticket.schema';
import { TicketService } from './ticket.service';

const ticketService = new TicketService();

export class TicketController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createTicketSchema.parse(request.body);
    const ticket = await ticketService.createTicket(request.user.id, input);
    return reply.status(201).send(ticket);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listTicketsQuerySchema.parse(request.query);
    const result = await ticketService.listTickets(request.user, query);
    return reply.status(200).send(result);
  }

  async getByIdOrProtocol(request: FastifyRequest, reply: FastifyReply) {
    const { idOrProtocol } = z.object({ idOrProtocol: z.string().min(1) }).parse(request.params);
    const ticket = await ticketService.getTicketByIdOrProtocol(idOrProtocol, request.user);
    return reply.status(200).send(ticket);
  }

  async assign(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = assignTicketSchema.parse(request.body || {});
    const updated = await ticketService.assignTicket(id, request.user, input);
    return reply.status(200).send(updated);
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = updateTicketStatusSchema.parse(request.body);
    const updated = await ticketService.updateTicketStatus(id, request.user, input);
    return reply.status(200).send(updated);
  }

  async pauseSla(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = pauseSlaSchema.parse(request.body);
    const updated = await ticketService.pauseSla(id, request.user, input);
    return reply.status(200).send(updated);
  }
}
