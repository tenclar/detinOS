import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../utils/app-error';
import { CreateDepartmentInput, UpdateDepartmentInput } from './department.schema';

export class DepartmentService {
  async listAll() {
    return prisma.department.findMany({
      include: {
        _count: {
          select: { users: true, tickets: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!department) {
      throw new NotFoundError('Setor não encontrado');
    }

    return department;
  }

  async create(input: CreateDepartmentInput) {
    const existing = await prisma.department.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new ConflictError('Já existe um setor cadastrado com este nome');
    }

    return prisma.department.create({ data: input });
  }

  async update(id: string, input: UpdateDepartmentInput) {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new NotFoundError('Setor não encontrado');
    }

    if (input.name && input.name !== department.name) {
      const conflict = await prisma.department.findUnique({ where: { name: input.name } });
      if (conflict) {
        throw new ConflictError('Já existe outro setor com este nome');
      }
    }

    return prisma.department.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { users: true, tickets: true } } },
    });

    if (!department) {
      throw new NotFoundError('Setor não encontrado');
    }

    if (department._count.tickets > 0 || department._count.users > 0) {
      throw new ConflictError('Não é possível excluir um setor que possui usuários ou chamados vinculados.');
    }

    await prisma.department.delete({ where: { id } });
    return { message: 'Setor removido com sucesso' };
  }
}
