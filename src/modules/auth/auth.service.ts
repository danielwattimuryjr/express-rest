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
import type {
  LoginRequestType,
  LoginResponseType,
  RefeshResponseType,
  RegisterRequestType,
  RegisterResponseType,
  TokenPair,
} from './auth.schema.ts';

export class AuthService {
  private static async generateTokenPair(
    user: User,
    manager?: EntityManager,
  ): Promise<TokenPair> {
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

  static async login(request: LoginRequestType): Promise<LoginResponseType> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);

      const user = await userRepo
        .findOneOrFail({
          where: { email: request.email },
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        })
        .catch(() => {
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
    });
  }

  static async register(
    request: RegisterRequestType,
  ): Promise<RegisterResponseType> {
    const hashedPassword = await bcrypt.hash(request.password, 12);

    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);
      const roleRepo = transactionalEntityManager.getRepository(Role);

      const existingUser = await userRepo.findOne({
        where: [{ email: request.email }, { username: request.username }],
      });
      if (existingUser) {
        throw new HttpDatabaseConflictError(
          'Email or username already registered',
        );
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

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
    });
  }

  static async refresh(refreshToken: string): Promise<RefeshResponseType> {
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
        refreshToken: newRefreshToken,
      };
    });
  }
}
