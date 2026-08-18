import bcrypt from 'bcryptjs';
import moment from 'moment';
import type { EntityManager } from 'typeorm';
import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import { TokenTypeEnum } from '../../common/enums/TokenTypeEnum.ts';
import HttpDatabaseConflictError from '../../common/errors/HttpDatabaseConflictError.ts';
import HttpUnauthorizedError from '../../common/errors/HttpUnauthorizedError.ts';
import config from '../../configuration/config.ts';
import { AppDataSource } from '../../configuration/typeorm.ts';
import { JwtService } from '../jwt/jwt.service.ts';
import { RefreshToken } from '../refreshToken/refreshToken.entity.ts';
import { RefreshTokenRepository } from '../refreshToken/refreshToken.repository.ts';
import { Role } from '../roles/role.entity.ts';
import { User } from '../users/user.entity.js';
import { UserRepository } from '../users/user.repository.ts';
import type { LoginRequestType, RegisterRequestType } from './auth.schema.ts';

export class AuthService {
  private static async generateTokenPair(user: User, manager?: EntityManager) {
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

    const repo = manager
      ? manager.getRepository(RefreshToken)
      : RefreshTokenRepository;

    const savedRefreshToken = await repo.save({
      token: refreshToken,
      user: user,
      expiresAt: refreshTokenExpires.toDate(),
      revoked: false,
    });

    return {
      accessToken,
      refreshToken: savedRefreshToken.token,
    };
  }

  static async login(request: LoginRequestType) {
    const user = await UserRepository.findOneOrFail({
      where: { email: request.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    }).catch(() => {
      throw new HttpUnauthorizedError();
    });

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
    const hashedPassword = await bcrypt.hash(request.password, 12);

    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);
      const roleRepo = transactionalEntityManager.getRepository(Role);

      const existingUser = await userRepo.findOneBy({ email: request.email });
      if (existingUser) {
        throw new HttpDatabaseConflictError('Email already registered');
      }

      const role = await roleRepo
        .findOneByOrFail({ id: RoleEnum.USER })
        .catch(() => {
          throw new Error('Default role not found');
        });

      const user = userRepo.create({
        ...request,
        password: hashedPassword,
        roles: [role],
      });

      await userRepo.save(user);

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async refresh(refreshToken: string) {
    const payload = JwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
    const userId = Number(payload.sub);

    return AppDataSource.transaction(async (manager) => {
      const existingRefreshToken = await manager
        .findOneByOrFail(RefreshToken, {
          token: refreshToken,
          user: { id: userId },
          revoked: false,
        })
        .catch(() => {
          throw new HttpUnauthorizedError();
        });

      if (existingRefreshToken.expiresAt < new Date()) {
        throw new HttpUnauthorizedError();
      }

      existingRefreshToken.revoked = true;
      await manager.save(existingRefreshToken);

      const user = await manager
        .findOneByOrFail(User, { id: userId })
        .catch(() => {
          throw new HttpUnauthorizedError();
        });

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokenPair(user, manager);

      return {
        accessToken,
        newRefreshToken,
      };
    });
  }
}
