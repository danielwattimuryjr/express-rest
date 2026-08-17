import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import config from './config.ts';

export const pool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
});

export const db = {
  async query<T extends QueryResultRow>(text: string, values?: unknown[]) {
    return pool.query<T>(text, values);
  },

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await callback(client);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

export type Database = Pool | PoolClient;
