import { z } from 'zod';

export const managerKpiQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano']).default('mes'),
});

export type ManagerKpiQuery = z.infer<typeof managerKpiQuerySchema>;
