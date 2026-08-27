import { FastifyReply, FastifyRequest } from 'fastify';
import { managerKpiQuerySchema } from './dashboard.schema';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getUserStats(request: FastifyRequest, reply: FastifyReply) {
    const stats = await dashboardService.getUserStats(request.user.id);
    return reply.status(200).send(stats);
  }

  async getTechQueueStats(request: FastifyRequest, reply: FastifyReply) {
    const stats = await dashboardService.getTechQueueStats();
    return reply.status(200).send(stats);
  }

  async getManagerKpis(request: FastifyRequest, reply: FastifyReply) {
    const query = managerKpiQuerySchema.parse(request.query);
    const kpis = await dashboardService.getManagerKpis(query);
    return reply.status(200).send(kpis);
  }
}
