import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../utils/app-error';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema';

export class CategoryService {
  async listAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { tickets: true, articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: true, articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    return category;
  }

  async create(input: CreateCategoryInput) {
    const existing = await prisma.category.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new ConflictError('Já existe uma categoria cadastrada com este nome');
    }

    return prisma.category.create({ data: input });
  }

  async update(id: string, input: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    if (input.name && input.name !== category.name) {
      const conflict = await prisma.category.findUnique({ where: { name: input.name } });
      if (conflict) {
        throw new ConflictError('Já existe outra categoria com este nome');
      }
    }

    return prisma.category.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { tickets: true, articles: true } } },
    });

    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    if (category._count.tickets > 0 || category._count.articles > 0) {
      throw new ConflictError('Não é possível excluir uma categoria que possui chamados ou artigos vinculados.');
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Categoria removida com sucesso' };
  }
}
