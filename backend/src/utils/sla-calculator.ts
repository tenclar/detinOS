import { Priority, Urgency } from '@prisma/client';

export interface SlaCalculationResult {
  slaFirstResponseAt: Date;
  slaResolutionAt: Date;
  priority: Priority;
}

/**
 * Calcula os prazos de SLA de primeira resposta e resolução com base na categoria e urgência informada
 */
export function calculateTicketSla(
  slaFirstResponseMin: number,
  slaResolutionMin: number,
  urgency: Urgency = Urgency.MEDIA
): SlaCalculationResult {
  const now = new Date();

  // Multiplicador de urgência para calibrar o SLA
  let multiplier = 1.0;
  let priority: Priority = Priority.MEDIA;

  switch (urgency) {
    case Urgency.CRITICA:
      multiplier = 0.5; // Reduz o tempo pela metade
      priority = Priority.CRITICA;
      break;
    case Urgency.ALTA:
      multiplier = 0.75;
      priority = Priority.ALTA;
      break;
    case Urgency.MEDIA:
      multiplier = 1.0;
      priority = Priority.MEDIA;
      break;
    case Urgency.BAIXA:
      multiplier = 1.5; // Dá 50% a mais de tempo
      priority = Priority.BAIXA;
      break;
  }

  const effectiveFirstResponseMin = Math.max(5, Math.round(slaFirstResponseMin * multiplier));
  const effectiveResolutionMin = Math.max(15, Math.round(slaResolutionMin * multiplier));

  const slaFirstResponseAt = new Date(now.getTime() + effectiveFirstResponseMin * 60 * 1000);
  const slaResolutionAt = new Date(now.getTime() + effectiveResolutionMin * 60 * 1000);

  return {
    slaFirstResponseAt,
    slaResolutionAt,
    priority,
  };
}

/**
 * Calcula os minutos restantes ou em atraso para o vencimento de um prazo
 */
export function getMinutesRemaining(targetDate: Date | null): number {
  if (!targetDate) return 0;
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  return Math.round((target - now) / (60 * 1000));
}
