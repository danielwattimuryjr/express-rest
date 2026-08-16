import type { Database } from '../../configuration/postgres.ts';
import type { RefreshToken } from './refreshToken.entity.ts';

export class RefreshTokenRepository {
  constructor(private readonly db: Database) {}

  async save(
    token: string,
    userId: number,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const result = await this.db.query<RefreshToken>(
      `INSERT INTO auth.refresh_tokens (
    token,
    user_id,
    expires_at
) VALUES ($1, $2, $3) RETURNING
    id,
    token,
    user_id AS "userId",
    expires_at AS "expiresAt",
    revoked,
    created_at AS "createdAt"`,
      [token, userId, expiresAt],
    );

    return result.rows[0];
  }
}
