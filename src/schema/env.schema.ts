import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z
    .string()
    .default('3000')
    .transform((val) => Number(val))
    .pipe(z.number().int().min(1).max(65535)),

  POSTGRES_USER: z.string().min(1, 'PGUSER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'PGPASSWORD is required'),
  POSTGRES_HOST: z.string().min(1, 'PGHOST is required'),
  POSTGRES_PORT: z
    .string()
    .min(1, 'PGPORT is required')
    .transform((val) => Number(val))
    .pipe(z.number().int().min(1).max(65535)),
  POSTGRES_DB: z.string().min(1, 'PGDATABASE is required'),
});
