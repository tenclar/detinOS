import { prisma } from '../lib/prisma';

/**
 * Gera um protocolo anual sequencial único no formato `YYYY-XXXX` (Ex: 2026-0001)
 */
export async function generateTicketProtocol(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${currentYear}-`;

  // Busca o último chamado aberto no ano corrente
  const lastTicket = await prisma.ticket.findFirst({
    where: {
      protocol: {
        startsWith: yearPrefix,
      },
    },
    orderBy: {
      protocol: 'desc',
    },
    select: {
      protocol: true,
    },
  });

  if (!lastTicket || !lastTicket.protocol) {
    return `${yearPrefix}0001`;
  }

  const parts = lastTicket.protocol.split('-');
  const lastSequence = parseInt(parts[1], 10);
  const nextSequence = isNaN(lastSequence) ? 1 : lastSequence + 1;

  return `${yearPrefix}${String(nextSequence).padStart(4, '0')}`;
}
