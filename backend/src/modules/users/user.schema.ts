import { Role, Status } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres').trim().toLowerCase(),
  email: z.string().email('E-mail inválido').trim().toLowerCase(),
  name: z.string().min(2, 'Nome é obrigatório').trim(),
  password: z.string().min(6, 'Senha inicial deve ter no mínimo 6 caracteres'),
  role: z.nativeEnum(Role).default(Role.USUARIO_COMUM),
  contact: z.string().optional(),
  departmentId: z.string().uuid().optional().nullable(),
  partnerAgencyId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(Status).default(Status.ATIVO),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  role: z.nativeEnum(Role).optional(),
  contact: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),
  partnerAgencyId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(Status).optional(),
});

export const resetUserPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(Status).optional(),
  departmentId: z.string().optional(),
  partnerAgencyId: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
