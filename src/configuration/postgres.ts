import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import HttpDatabaseConflictError from '../common/errors/HttpDatabaseConflictError.ts';
import HttpDatabaseError, {
  type DatabaseErrorData,
} from '../common/errors/HttpDatabaseError.ts';
import config from './config.ts';
import logger from './logger.ts';

type PgError = Error & {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
};

function mapDatabaseError(error: unknown): Error {
  if (!(error instanceof Error)) {
    return new HttpDatabaseError('Database operation failed');
  }

  const pgError = error as PgError;

  if (config.NODE_ENV !== 'production') {
    logger.error('PostgreSQL error: %o', {
      message: pgError.message,
      code: pgError.code,
      detail: pgError.detail,
      constraint: pgError.constraint,
      table: pgError.table,
      column: pgError.column,
    });
  }

  const data: DatabaseErrorData = {
    code: pgError.code,
  };

  const message =
    config.NODE_ENV === 'production'
      ? 'Database operation failed'
      : pgError.message;

  if (pgError.code === '23505') {
    return new HttpDatabaseConflictError('Unique constraint violation', data);
  }

  return new HttpDatabaseError(message, data);
}

export const pool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
});

export const db = {
  async query<T extends QueryResultRow>(text: string, values?: unknown[]) {
    try {
      return await pool.query<T>(text, values);
    } catch (error) {
      throw mapDatabaseError(error);
    }
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
