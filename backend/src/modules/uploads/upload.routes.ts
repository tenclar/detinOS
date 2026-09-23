import { FastifyInstance } from 'fastify';

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.get('/ping', async () => {
    return { status: 'upload module active' };
  });
}
