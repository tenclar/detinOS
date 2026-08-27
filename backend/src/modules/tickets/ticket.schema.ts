import { Priority, TicketStatus, Urgency } from '@prisma/client';
import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Assunto/Título é obrigatório').trim(),
  description: z.string().min(5, 'Descrição detalhada é obrigatória').trim(),
  categoryId: z.string().uuid('Categoria inválida'),
  urgency: z.nativeEnum(Urgency).default(Urgency.MEDIA),
  location: z.string().min(2, 'Local de atendimento é obrigatório').trim(),
  contact: z.string().min(5, 'Contato (telefone/WhatsApp) é obrigatório').trim(),
  departmentId: z.string().uuid().optional().nullable(),
  partnerAgencyId: z.string().uuid().optional().nullable(),
});

export const listTicketsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  categoryId: z.string().optional(),
  departmentId: z.string().optional(),
  partnerAgencyId: z.string().optional(),
  assigneeId: z.string().optional(),
  authorId: z.string().optional(),
  onlyMine: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional()),
  overdueOnly: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional()),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const assignTicketSchema = z.object({
  assigneeId: z.string().uuid('ID do técnico inválido').optional().nullable(),
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  justification: z.string().optional(),
});

export const pauseSlaSchema = z.object({
  paused: z.boolean(),
  reason: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
export type PauseSlaInput = z.infer<typeof pauseSlaSchema>;
