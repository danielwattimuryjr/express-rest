import { db } from '../../configuration/postgres.ts';
import type { RefreshToken } from './refreshToken.entity.ts';

export class RefreshTokenRepository {
  static async save(
    token: string,
    userId: number,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const result = await db.query<RefreshToken>(
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

  static async getRefreshTokenByTokenAndUserId(
    refreshToken: string,
    userId: number,
  ): Promise<RefreshToken> {
    const result = await db.query<RefreshToken>(
      `SELECT
        id,
        token,
        user_id AS "userId",
        expires_at AS "expiresAt",
        revoked,
        created_at AS "createdAt"
      FROM auth.refresh_tokens
      WHERE token = $1
        AND user_id = $2`,
      [refreshToken, userId],
    );

    return result.rows[0];
  }

  static async revokeToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    await db.query(
      `UPDATE auth.refresh_tokens
      SET revoked = TRUE
      WHERE token = $1
        AND user_id = $2`,
      [refreshToken, userId],
    );
  }
}
