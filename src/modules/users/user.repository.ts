import { db } from '../../configuration/postgres.ts';
import type { User } from './user.entity.ts';

export class UserRepository {
  static async findAll(): Promise<User[]> {
    const result = await db.query<User>(
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

  static async findById(id: number): Promise<User> {
    const result = await db.query<User>(
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

  static async save(payload: {
    firstName: string;
    lastName?: string;
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    const result = await db.query<User>(
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

  static async findByEmail(
    email: string,
  ): Promise<User & { password: string }> {
    const result = await db.query<User & { password: string }>(
      `SELECT
      id,
      email,
      first_name AS "firstName",
      last_name AS "lastName",
      password,
      username
FROM auth.users
WHERE email = $1
LIMIT 1`,
      [email],
    );

    return result.rows[0];
  }
}
