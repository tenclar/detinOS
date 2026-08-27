import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export const swaggerPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'detinOS API - OCA Helpdesk',
        description: 'Documentação da API RESTful do Sistema de Suporte de TI da OCA',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Ambiente Local',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
});
