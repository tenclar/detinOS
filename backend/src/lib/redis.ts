import Redis from 'ioredis';
import { env } from '../config/env';

let redisClient: Redis | null = null;

try {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Não reconecta infinitamente se o Redis estiver desativado no ambiente de teste
      }
      return Math.min(times * 100, 2000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    console.log('✅ Conectado ao Redis');
  });

  redisClient.on('error', (err) => {
    // Apenas log de aviso para não travar a aplicação caso o Redis esteja indisponível
    console.warn('⚠️ Aviso de conexão Redis (cache em modo fallback):', err.message);
  });

  redisClient.connect().catch(() => {
    console.warn('⚠️ Não foi possível conectar ao Redis na inicialização. Prosseguindo sem cache em memória.');
  });
} catch (e) {
  console.warn('⚠️ Falha ao inicializar cliente Redis:', e);
}

export const redis = redisClient;

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis || redis.status !== 'ready') return null;
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
  if (!redis || redis.status !== 'ready') return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Ignorar falhas de escrita no cache
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis || redis.status !== 'ready') return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Ignorar falhas de limpeza
  }
}
