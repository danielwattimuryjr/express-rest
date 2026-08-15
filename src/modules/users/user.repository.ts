import type { Pool, PoolClient } from 'pg';
import type { User } from './user.entity.ts';

type Database = Pool | PoolClient;

export class UserRepository {
  constructor(private readonly db: Database) {}

  async getAll(): Promise<Pick<User, 'name'>[]> {
    const result = await this.db.query<Pick<User, 'name'>>(
      `SELECT name FROM public.users`,
    );

    return result.rows;
  }

  async save(payload: { name: string }): Promise<User> {
    const result = await this.db.query<User>(
      `INSERT INTO public.users (name) VALUES ($1) RETURNING id, name`,
      [payload.name],
    );

    return result.rows[0];
  }
}
