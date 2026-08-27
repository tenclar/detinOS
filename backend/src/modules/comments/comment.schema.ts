import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'A mensagem não pode estar vazia').trim(),
  isInternal: z.boolean().default(false),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
