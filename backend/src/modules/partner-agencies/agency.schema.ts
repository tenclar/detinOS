import { SphereType, Status } from '@prisma/client';
import { z } from 'zod';

export const createAgencySchema = z.object({
  name: z.string().min(2, 'Nome do órgão é obrigatório').trim(),
  acronym: z.string().min(1, 'Sigla é obrigatória').trim(),
  sphere: z.nativeEnum(SphereType).default(SphereType.ESTADUAL),
  contact: z.string().optional().nullable(),
  status: z.nativeEnum(Status).default(Status.ATIVO),
});

export const updateAgencySchema = z.object({
  name: z.string().min(2).optional(),
  acronym: z.string().min(1).optional(),
  sphere: z.nativeEnum(SphereType).optional(),
  contact: z.string().optional().nullable(),
  status: z.nativeEnum(Status).optional(),
});

export type CreateAgencyInput = z.infer<typeof createAgencySchema>;
export type UpdateAgencyInput = z.infer<typeof updateAgencySchema>;
