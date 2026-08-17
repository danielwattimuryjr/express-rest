import bcrypt from 'bcryptjs';
import moment from 'moment';
import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import { TokenTypeEnum } from '../../common/enums/TokenTypeEnum.ts';
import HttpUnauthorizedError from '../../common/errors/HttpUnauthorizedError.ts';
import config from '../../configuration/config.ts';
import { JwtService } from '../jwt/jwt.service.ts';
import { RefreshTokenRepository } from '../refreshToken/refreshToken.repository.ts';
import { RoleRepository } from '../roles/role.repository.ts';
import type { User } from '../users/user.entity.ts';
import { UserRepository } from '../users/user.repository.ts';
import type { LoginRequestType, RegisterRequestType } from './auth.schema.ts';

export class AuthService {
  private static async generateTokenPair(user: User) {
    const accessToken = JwtService.generateToken(
      user,
      moment().add(config.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes'),
      TokenTypeEnum.ACCESS,
    );

    const refreshTokenExpires = moment().add(
      config.JWT_REFRESH_EXPIRATION_DAYS,
      'days',
    );
    const refreshToken = JwtService.generateToken(
      user,
      refreshTokenExpires,
      TokenTypeEnum.REFRESH,
    );
    const savedRefreshToken = await RefreshTokenRepository.save(
      refreshToken,
      user.id,
      refreshTokenExpires.toDate(),
    );

    return {
      accessToken,
      refreshToken: savedRefreshToken.token,
    };
  }

  static async login(request: LoginRequestType) {
    const user = await UserRepository.findByEmail(request.email);
    if (!user) {
      throw new HttpUnauthorizedError();
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpUnauthorizedError();
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async register(request: RegisterRequestType) {
    const user = await UserRepository.save(request);
    await RoleRepository.setRoles(user.id, [RoleEnum.USER]);

    return user;
  }

  static async refresh(refreshToken: string) {
    const payload = JwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
    const userId = Number(payload.sub);

    RefreshTokenRepository.revokeToken(refreshToken, userId);

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new HttpUnauthorizedError();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokenPair(user);

    return {
      accessToken,
      newRefreshToken,
    };
  }
}
