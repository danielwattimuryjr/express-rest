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

  async create(payload: { name: string; email: string }) {
    const result = await this.db.query<{
      id: number;
      name: string;
      email: string;
    }>(
      `INSERT INTO public.users (name, email) VALUES ($1, $2) RETURNING id, name, email`,
      [payload.name, payload.email],
    );

    return result.rows[0];
  }
}
