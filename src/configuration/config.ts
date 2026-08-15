import dotenv from 'dotenv';
import { envSchema } from '../schema/env.schema.ts';

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Environment validation failed:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

const config = parsedEnv.data;

export default config;
export type AppConfig = typeof config;
