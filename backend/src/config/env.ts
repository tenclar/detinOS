import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Carrega .env do diretório atual ou da raiz do workspace
dotenv.config();
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET deve ter no mínimo 16 caracteres'),
  CORS_ORIGIN: z.string().default('*'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(10 * 1024 * 1024), // 10MB
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Erro de configuração nas variáveis de ambiente:', _env.error.format());
  throw new Error('Variáveis de ambiente inválidas');
}

export const env = _env.data;
