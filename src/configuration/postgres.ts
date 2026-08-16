import { Pool, type PoolClient } from 'pg';
import config from './config.ts';

export const pool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
});

export type Database = Pool | PoolClient;
