import type { Pool, PoolClient } from 'pg';

type Database = Pool | PoolClient;

export class UserRepository {
  constructor(private readonly db: Database) {}

  async getAll() {
    const result = await this.db.query<{ name: string }>(
      `SELECT name FROM public.users`,
    );

    return result.rows;
  }
}
