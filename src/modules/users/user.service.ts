import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import HttpDatabaseConflictError from '../../common/errors/HttpDatabaseConflictError.ts';
import { UserRepository } from './user.repository.js';
import type { UserRequestType } from './user.schema.ts';

export class UserService {
  static async getAllUsers() {
    const users = await UserRepository.find();
    return users;
  }

  static async createUser(request: UserRequestType) {
    const existingUser = await UserRepository.findOneBy({
      email: request.email,
    });
    if (existingUser) {
      throw new HttpDatabaseConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(request.password, 12);

    const user = UserRepository.create({
      ...request,
      password: hashedPassword,
      roles: [{ id: RoleEnum.USER }],
    });
    await UserRepository.save(user);

    return user;
  }

  static async getOne(userId: number) {
    return await UserRepository.findOneBy({ id: userId });
  }
}
