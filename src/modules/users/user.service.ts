import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import HttpDatabaseConflictError from '../../common/errors/HttpDatabaseConflictError.ts';
import HttpNotFoundError from '../../common/errors/HttpNotFoundError.ts';
import { UserRepository } from './user.repository.js';
import type { UserRequestType, UserResponseType } from './user.schema.ts';

export class UserService {
  static async getAllUsers(): Promise<UserResponseType[]> {
    const users = await UserRepository.find({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
        username: true,
      },
    });
    return users;
  }

  static async createUser(request: UserRequestType): Promise<UserResponseType> {
    const existingUser = await UserRepository.findOne({
      where: [{ email: request.email }, { username: request.username }],
    });
    if (existingUser) {
      throw new HttpDatabaseConflictError(
        'Email or username already registered',
      );
    }

    const hashedPassword = await bcrypt.hash(request.password, 12);

    const user = UserRepository.create({
      ...request,
      password: hashedPassword,
      roles: [{ id: RoleEnum.USER }],
    });
    await UserRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };
  }

  static async getOne(userId: number): Promise<UserResponseType> {
    const user = await UserRepository.findOneOrFail({
      where: {
        id: userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
        username: true,
      },
    }).catch(() => {
      throw new HttpNotFoundError('User not found');
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };
  }
}
