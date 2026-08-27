import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Login ou e-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
