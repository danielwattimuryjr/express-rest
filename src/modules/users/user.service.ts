import type { UserRepository } from './user.repository.ts';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll() {
    const users = await this.userRepository.getAll();

    return users;
  }
}
