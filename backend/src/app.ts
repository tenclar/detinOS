import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { jwtPlugin } from './plugins/jwt';
import { multipartPlugin } from './plugins/multipart';
import { swaggerPlugin } from './plugins/swagger';
import { errorHandler } from './plugins/error-handler';
import { appRoutes } from './routes';

export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
  });

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Security Plugins
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
  });

  // Custom Infrastructure Plugins
  await app.register(jwtPlugin);
  await app.register(multipartPlugin);
  await app.register(swaggerPlugin);

  // Global Healthcheck Route
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'detinOS Backend API',
      timestamp: new Date().toISOString(),
    };
  });

  // Register All API v1 Routes
  await app.register(appRoutes, { prefix: '/api/v1' });

  return app;
}
