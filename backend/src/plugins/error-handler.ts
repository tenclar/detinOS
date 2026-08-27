import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error';

export function errorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // 1. Erros de validação do Zod
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Falha na validação dos dados enviados',
      issues: formattedErrors,
    });
  }

  // 2. Erros customizados da aplicação (AppError)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name || 'Application Error',
      message: error.message,
      details: error.details,
    });
  }

  // 3. Erros conhecidos do Prisma ORM
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[])?.join(', ') || 'campo';
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: `Já existe um registro com este valor único para: ${target}`,
      });
    }

    // Record not found
    if (error.code === 'P2025') {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Registro solicitado não foi encontrado no banco de dados',
      });
    }
  }

  // 4. Erros de autenticação do Fastify JWT
  if (error.name === 'FastifyJWTError' || (error as FastifyError).statusCode === 401) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token de autenticação ausente, expirado ou inválido',
    });
  }

  // 5. Erro interno não tratado
  const isProd = process.env.NODE_ENV === 'production';
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: isProd ? 'Ocorreu um erro interno no servidor' : error.message,
  });
}
