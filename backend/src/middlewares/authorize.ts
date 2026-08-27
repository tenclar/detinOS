import { Role } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../utils/app-error';

export function authorize(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Acesso negado. Seu perfil (${request.user.role}) não tem permissão para esta operação.`
      );
    }
  };
}
