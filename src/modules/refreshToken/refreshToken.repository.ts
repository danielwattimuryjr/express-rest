import { Repository } from 'typeorm';
import { AppDataSource } from '../../configuration/typeorm.ts';
import { RefreshToken } from './refreshToken.entity.ts';

class RefreshTokenRepositoryClass extends Repository<RefreshToken> {
  constructor() {
    super(RefreshToken, AppDataSource.manager);
  }
}

export const RefreshTokenRepository = new RefreshTokenRepositoryClass();
