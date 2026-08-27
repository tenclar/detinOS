import { buildApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

async function start() {
  try {
    const app = await buildApp();

    // Testa conexão com o banco de dados
    try {
      await prisma.$connect();
      app.log.info('📦 Conexão com PostgreSQL estabelecida com sucesso.');
    } catch (dbErr: any) {
      app.log.warn(`⚠️ Aviso: Não foi possível conectar ao banco de dados imediatamente: ${dbErr.message}`);
    }

    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 detinOS Backend rodando em http://${env.HOST}:${env.PORT}`);
    app.log.info(`📄 Documentação Swagger UI disponível em http://${env.HOST}:${env.PORT}/docs`);

    // Graceful Shutdown Handler
    const listeners = ['SIGINT', 'SIGTERM'];
    listeners.forEach((signal) => {
      process.on(signal, async () => {
        app.log.info(`Sinal ${signal} recebido. Encerrando servidor detinOS com segurança...`);
        await app.close();
        await prisma.$disconnect();
        if (redis && redis.status === 'ready') {
          await redis.quit();
        }
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('❌ Falha fatal ao iniciar o servidor:', err);
    process.exit(1);
  }
}

start();
