import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../utils/app-error';
import { CreateAgencyInput, UpdateAgencyInput } from './agency.schema';

export class PartnerAgencyService {
  async listAll() {
    return prisma.partnerAgency.findMany({
      include: {
        _count: {
          select: { users: true, tickets: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const agency = await prisma.partnerAgency.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!agency) {
      throw new NotFoundError('Órgão parceiro não encontrado');
    }

    return agency;
  }

  async create(input: CreateAgencyInput) {
    const existing = await prisma.partnerAgency.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new ConflictError('Já existe um órgão parceiro cadastrado com este nome');
    }

    return prisma.partnerAgency.create({ data: input });
  }

  async update(id: string, input: UpdateAgencyInput) {
    const agency = await prisma.partnerAgency.findUnique({ where: { id } });
    if (!agency) {
      throw new NotFoundError('Órgão parceiro não encontrado');
    }

    if (input.name && input.name !== agency.name) {
      const conflict = await prisma.partnerAgency.findUnique({ where: { name: input.name } });
      if (conflict) {
        throw new ConflictError('Já existe outro órgão parceiro com este nome');
      }
    }

    return prisma.partnerAgency.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    const agency = await prisma.partnerAgency.findUnique({
      where: { id },
      include: { _count: { select: { users: true, tickets: true } } },
    });

    if (!agency) {
      throw new NotFoundError('Órgão parceiro não encontrado');
    }

    if (agency._count.tickets > 0 || agency._count.users > 0) {
      throw new ConflictError('Não é possível excluir um órgão que possui usuários ou chamados vinculados.');
    }

    await prisma.partnerAgency.delete({ where: { id } });
    return { message: 'Órgão parceiro removido com sucesso' };
  }
}
