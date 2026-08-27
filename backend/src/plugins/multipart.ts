import fp from 'fastify-plugin';
import fastifyMultipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';

export const multipartPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
      files: 5,
    },
  });
});
