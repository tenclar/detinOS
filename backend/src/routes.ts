import { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { departmentRoutes } from './modules/departments/department.routes';
import { agencyRoutes } from './modules/partner-agencies/agency.routes';
import { categoryRoutes } from './modules/categories/category.routes';
import { ticketRoutes } from './modules/tickets/ticket.routes';
import { commentRoutes } from './modules/comments/comment.routes';
import { kbRoutes } from './modules/knowledge-base/kb.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { uploadRoutes } from './modules/uploads/upload.routes';

export async function appRoutes(fastify: FastifyInstance) {
  // Health & Info
  fastify.get('/status', async () => {
    return {
      status: 'online',
      service: 'detinOS Backend API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  });

  // Módulos da API
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/users' });
  fastify.register(departmentRoutes, { prefix: '/departments' });
  fastify.register(agencyRoutes, { prefix: '/agencies' });
  fastify.register(categoryRoutes, { prefix: '/categories' });
  fastify.register(ticketRoutes, { prefix: '/tickets' });
  fastify.register(commentRoutes);
  fastify.register(kbRoutes, { prefix: '/kb' });
  fastify.register(dashboardRoutes, { prefix: '/dashboard' });
  fastify.register(uploadRoutes, { prefix: '/uploads' });
}
