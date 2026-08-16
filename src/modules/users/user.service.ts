import bcrypt from 'bcryptjs';
import type { UserRepository } from './user.repository.ts';
import type { UserRequestType } from './user.schema.ts';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll() {
    const users = await this.userRepository.getAll();
    return users;
  }

  async post(request: UserRequestType) {
    const hashedPassword = await bcrypt.hash(request.password, 12);
    const users = await this.userRepository.save({
      ...request,
      password: hashedPassword,
    });
    return users;
  }

  async getOne(userId: number) {
    return await this.userRepository.findById(userId);
  }
}
