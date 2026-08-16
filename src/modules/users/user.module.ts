import { pool } from '../../configuration/postgres.ts';
import { UserRepository } from './user.repository.ts';
import { UserService } from './user.service.ts';

export const userRepository = new UserRepository(pool);
export const userService = new UserService(userRepository);
