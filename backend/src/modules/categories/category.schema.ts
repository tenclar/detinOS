import { Status } from '@prisma/client';
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome da categoria é obrigatório').trim(),
  description: z.string().optional().nullable(),
  responsibleTeam: z.string().default('Suporte TI'),
  slaFirstResponseMin: z.coerce.number().min(5, 'SLA de 1ª resposta deve ser no mínimo 5 minutos').default(30),
  slaResolutionMin: z.coerce.number().min(15, 'SLA de resolução deve ser no mínimo 15 minutos').default(240),
  status: z.nativeEnum(Status).default(Status.ATIVO),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  responsibleTeam: z.string().optional(),
  slaFirstResponseMin: z.coerce.number().min(5).optional(),
  slaResolutionMin: z.coerce.number().min(15).optional(),
  status: z.nativeEnum(Status).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
