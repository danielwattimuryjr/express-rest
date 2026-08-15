import type { UserRepository } from './user.repository.ts';
import type { UserRequestType } from './user.schema.ts';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll() {
    const users = await this.userRepository.getAll();

    return users;
  }

  async post(request: UserRequestType) {
    const users = await this.userRepository.save(request);

    return users;
  }
}
