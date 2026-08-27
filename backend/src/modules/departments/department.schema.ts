import { Status } from '@prisma/client';
import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Nome do setor é obrigatório').trim(),
  acronym: z.string().min(1, 'Sigla é obrigatória').trim().toUpperCase(),
  head: z.string().optional().nullable(),
  phoneExtension: z.string().optional().nullable(),
  status: z.nativeEnum(Status).default(Status.ATIVO),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  acronym: z.string().min(1).optional(),
  head: z.string().optional().nullable(),
  phoneExtension: z.string().optional().nullable(),
  status: z.nativeEnum(Status).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
