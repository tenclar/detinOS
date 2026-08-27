import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../utils/app-error';
import { hashPassword } from '../../utils/password';
import { CreateUserInput, ListUsersQuery, ResetUserPasswordInput, UpdateUserInput } from './user.schema';

export class UserService {
  async listUsers(query: ListUsersQuery) {
    const where: Prisma.UserWhereInput = {};

    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.partnerAgencyId) where.partnerAgencyId = query.partnerAgencyId;

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { username: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        contact: true,
        status: true,
        department: { select: { id: true, name: true, acronym: true } },
        partnerAgency: { select: { id: true, name: true, acronym: true } },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        contact: true,
        status: true,
        departmentId: true,
        department: true,
        partnerAgencyId: true,
        partnerAgency: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  async createUser(input: CreateUserInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existing) {
      throw new ConflictError('Já existe um usuário cadastrado com este e-mail ou username');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        ...input,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        contact: true,
        status: true,
        departmentId: true,
        partnerAgencyId: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateUser(id: string, input: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (input.email || input.username) {
      const conflict = await prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(input.email ? [{ email: input.email }] : []),
            ...(input.username ? [{ username: input.username }] : []),
          ],
        },
      });

      if (conflict) {
        throw new ConflictError('E-mail ou username já em uso por outro usuário');
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: input,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        contact: true,
        status: true,
        departmentId: true,
        partnerAgencyId: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async resetPassword(id: string, input: ResetUserPasswordInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const passwordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });

    return { message: 'Senha do usuário redefinida com sucesso' };
  }
}
