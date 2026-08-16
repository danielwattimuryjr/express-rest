import { pool } from '../../configuration/postgres.ts';
import { RefreshTokenRepository } from './refreshToken.repository.ts';

export const refreshTokenRepository = new RefreshTokenRepository(pool);
