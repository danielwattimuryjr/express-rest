import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import { RoleRepository } from '../roles/role.repository.ts';
import { UserRepository } from './user.repository.js';
import type { UserRequestType } from './user.schema.ts';

export class UserService {
  static async getAllUsers() {
    const users = await UserRepository.findAll();
    return users;
  }

  static async createUser(request: UserRequestType) {
    const hashedPassword = await bcrypt.hash(request.password, 12);
    const user = await UserRepository.save({
      ...request,
      password: hashedPassword,
    });
    await RoleRepository.setRoles(user.id, [RoleEnum.USER]);
    return user;
  }

  static async getOne(userId: number) {
    return await UserRepository.findById(userId);
  }
}
