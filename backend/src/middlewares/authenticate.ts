import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../utils/app-error';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError('Token de autenticação ausente ou inválido');
  }
}
