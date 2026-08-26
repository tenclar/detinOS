import dotenv from 'dotenv';
import { buildApp } from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = buildApp();

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`🚀 detinOS Backend rodando em http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful Shutdown Handler
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Sinal ${signal} recebido. Encerrando servidor Fastify...`);
    await app.close();
    process.exit(0);
  });
});

start();
