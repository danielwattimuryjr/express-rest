import bcrypt from 'bcryptjs';
import moment from 'moment';
import { TokenTypeEnum } from '../../common/enums/token.ts';
import HttpBadCredentialsError from '../../common/errors/HttpBadCredentialsError.ts';
import config from '../../configuration/config.ts';
import { jwtService } from '../jwt/jwt.module.ts';
import { refreshTokenRepository } from '../refreshToken/refreshToken.module.ts';
import { userRepository } from '../users/user.module.ts';
import type { LoginRequestType } from './auth.schema.ts';

export class AuthService {
  async login(request: LoginRequestType) {
    const user = await userRepository.findByEmail(request.email);
    if (!user) {
      throw new HttpBadCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpBadCredentialsError();
    }

    const accessToken = jwtService.generateToken(
      user,
      moment().add(config.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes'),
      TokenTypeEnum.ACCESS,
    );

    const refreshTokenExpires = moment().add(
      config.JWT_REFRESH_EXPIRATION_DAYS,
      'days',
    );
    const refreshToken = jwtService.generateToken(
      user,
      refreshTokenExpires,
      TokenTypeEnum.REFRESH,
    );
    const savedRefreshToken = await refreshTokenRepository.save(
      refreshToken,
      user.id,
      refreshTokenExpires.toDate(),
    );

    return {
      accessToken,
      refreshToken: savedRefreshToken.token,
    };
  }
}
