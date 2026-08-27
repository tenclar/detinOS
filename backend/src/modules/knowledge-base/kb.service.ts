import { ArticleStatus, Prisma } from '@prisma/client';
import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/app-error';
import { ArticleFeedbackInput, CreateArticleInput, ListArticlesQuery, UpdateArticleInput } from './kb.schema';

export class KnowledgeBaseService {
  private generateSlug(title: string): string {
    const baseSlug = slugify(title, { lower: true, strict: true });
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${baseSlug}-${randomSuffix}`;
  }

  async listArticles(query: ListArticlesQuery) {
    const where: Prisma.ArticleWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.audience) where.audience = query.audience;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return prisma.article.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
      },
      orderBy: { views: 'desc' },
    });
  }

  async getArticleByIdOrSlug(idOrSlug: string, incrementView = true) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const article = await prisma.article.findUnique({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!article) {
      throw new NotFoundError('Artigo não encontrado');
    }

    if (incrementView) {
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      });
    }

    return article;
  }

  async createArticle(authorId: string, input: CreateArticleInput) {
    const slug = this.generateSlug(input.title);

    return prisma.article.create({
      data: {
        ...input,
        slug,
        authorId,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
      },
    });
  }

  async updateArticle(id: string, input: UpdateArticleInput) {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundError('Artigo não encontrado');
    }

    return prisma.article.update({
      where: { id },
      data: input,
      include: {
        category: true,
        author: { select: { id: true, name: true } },
      },
    });
  }

  async deleteArticle(id: string) {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundError('Artigo não encontrado');
    }

    await prisma.article.delete({ where: { id } });
    return { message: 'Artigo excluído com sucesso' };
  }

  async registerFeedback(articleId: string, userId: string | undefined, userIp: string, input: ArticleFeedbackInput) {
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundError('Artigo não encontrado');
    }

    await prisma.$transaction(async (tx) => {
      await tx.articleFeedback.create({
        data: {
          articleId,
          isUseful: input.isUseful,
          userId,
          userIp,
        },
      });

      await tx.article.update({
        where: { id: articleId },
        data: input.isUseful
          ? { usefulVotes: { increment: 1 } }
          : { notUsefulVotes: { increment: 1 } },
      });
    });

    return { message: 'Feedback registrado com sucesso' };
  }
}
