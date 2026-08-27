import { Status } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UnauthorizedError } from '../../utils/app-error';
import { comparePassword, hashPassword } from '../../utils/password';
import { ChangePasswordInput, LoginInput } from './auth.schema';

export class AuthService {
  async authenticate(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.login }, { username: input.login }],
      },
      include: {
        department: {
          select: { id: true, name: true, acronym: true },
        },
        partnerAgency: {
          select: { id: true, name: true, acronym: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas. Verifique seu login e senha.');
    }

    if (user.status !== Status.ATIVO) {
      throw new UnauthorizedError('Esta conta de usuário está desativada. Contate o administrador.');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas. Verifique seu login e senha.');
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      contact: user.contact,
      department: user.department,
      partnerAgency: user.partnerAgency,
      departmentId: user.departmentId,
      partnerAgencyId: user.partnerAgencyId,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        partnerAgency: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    const isCurrentValid = await comparePassword(input.currentPassword, user.password);
    if (!isCurrentValid) {
      throw new UnauthorizedError('A senha atual informada está incorreta');
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}
