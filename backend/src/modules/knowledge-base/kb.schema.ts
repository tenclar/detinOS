import { ArticleAudience, ArticleStatus } from '@prisma/client';
import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(3, 'Título é obrigatório').trim(),
  excerpt: z.string().min(5, 'Resumo é obrigatório').trim(),
  content: z.string().min(10, 'Conteúdo do artigo é obrigatório').trim(),
  categoryId: z.string().uuid('Categoria inválida'),
  audience: z.nativeEnum(ArticleAudience).default(ArticleAudience.GERAL),
  status: z.nativeEnum(ArticleStatus).default(ArticleStatus.PUBLICADO),
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(5).optional(),
  content: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  audience: z.nativeEnum(ArticleAudience).optional(),
  status: z.nativeEnum(ArticleStatus).optional(),
});

export const listArticlesQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.nativeEnum(ArticleStatus).optional(),
  audience: z.nativeEnum(ArticleAudience).optional(),
});

export const articleFeedbackSchema = z.object({
  isUseful: z.boolean(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
export type ArticleFeedbackInput = z.infer<typeof articleFeedbackSchema>;
