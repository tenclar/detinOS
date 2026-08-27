import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';

export const jwtPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '8h',
    },
  });
});
