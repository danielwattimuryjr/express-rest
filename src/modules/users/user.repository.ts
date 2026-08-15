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

  async save(payload: { name: string }) {
    const result = await this.db.query<{
      id: number;
      name: string;
    }>(`INSERT INTO public.users (name) VALUES ($1) RETURNING id, name`, [
      payload.name,
    ]);

    return result.rows[0];
  }
}
