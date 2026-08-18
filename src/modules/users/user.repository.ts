import { Repository } from 'typeorm';
import { AppDataSource } from '../../configuration/typeorm.ts';
import { User } from './user.entity.ts';

class UserRepositoryClass extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager);
  }
}

export const UserRepository = new UserRepositoryClass();
