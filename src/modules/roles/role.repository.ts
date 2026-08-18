import { Repository } from 'typeorm';
import { AppDataSource } from '../../configuration/typeorm.ts';
import { Role } from './role.entity.ts';

class RoleRepositoryClass extends Repository<Role> {
  constructor() {
    super(Role, AppDataSource.manager);
  }
}

export const RoleRepository = new RoleRepositoryClass();
