import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register Security Plugins
  app.register(helmet, {
    contentSecurityPolicy: false, // Managed by Nginx reverse proxy if needed
  });

  app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Healthcheck Route
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'detinOS Backend API',
      timestamp: new Date().toISOString(),
    };
  });

  // API Status & Versioning Route
  app.get('/api/v1/status', async () => {
    return {
      status: 'online',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  });

  return app;
}
