import { Role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { DashboardController } from './dashboard.controller';

const dashboardController = new DashboardController();

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  // Estatísticas para o Dashboard do Solicitante
  fastify.get('/user-stats', {
    schema: {
      tags: ['Dashboards & Métricas'],
      summary: 'Obter contadores e resumo de chamados do solicitante logado',
      security: [{ bearerAuth: [] }],
    },
    handler: dashboardController.getUserStats.bind(dashboardController),
  });

  // Estatísticas para a Fila do Técnico
  fastify.get('/tech-queue-stats', {
    schema: {
      tags: ['Dashboards & Métricas'],
      summary: 'Obter contadores da fila de atendimento técnico e alertas de SLA',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR, Role.TECNICO)],
    handler: dashboardController.getTechQueueStats.bind(dashboardController),
  });

  // KPIs e Gráficos para a Visão Gerencial
  fastify.get('/manager-kpis', {
    schema: {
      tags: ['Dashboards & Métricas'],
      summary: 'Obter KPIs estratégicos, distribuição por setor/status e desempenho da equipe',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authorize(Role.ADMIN, Role.GESTOR)],
    handler: dashboardController.getManagerKpis.bind(dashboardController),
  });
}
