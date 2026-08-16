import type { Database } from '../../configuration/postgres.ts';
import type { User } from './user.entity.ts';

export class UserRepository {
  constructor(private readonly db: Database) {}

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const result = await this.db.query<Omit<User, 'password'>>(
      `SELECT
      id,
      email,
      first_name AS "firstName",
      last_name AS "lastName",
      username
FROM auth.users`,
    );

    return result.rows;
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const result = await this.db.query<Omit<User, 'password'>>(
      `SELECT
      id,
      email,
      first_name AS "firstName",
      last_name AS "lastName",
      username
FROM auth.users
WHERE id = $1
LIMIT 1`,
      [id],
    );

    return result.rows[0];
  }

  async save(payload: {
    firstName: string;
    lastName?: string;
    email: string;
    username: string;
    password: string;
  }): Promise<Omit<User, 'password'>> {
    const result = await this.db.query<Omit<User, 'password'>>(
      `INSERT INTO auth.users (
  first_name,
  last_name,
  email,
  username,
  password
) VALUES ($1, $2, $3, $4, $5)
RETURNING
  id,
  email,
  username,
  first_name AS "firstName",
  last_name AS "lastName"`,
      [
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.username,
        payload.password,
      ],
    );

    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.db.query<User>(
      `SELECT
      id,
      email,
      password,
      first_name AS "firstName",
      last_name AS "lastName",
      username
FROM auth.users
WHERE email = $1
LIMIT 1`,
      [email],
    );

    return result.rows[0];
  }
}
