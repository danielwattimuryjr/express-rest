import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RefreshToken } from '../modules/refreshToken/refreshToken.entity.ts';
import { Role } from '../modules/roles/role.entity.ts';
import { User } from '../modules/users/user.entity.ts';
import config from './config.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [User, Role, RefreshToken],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
  cache: {
    type: 'redis',
    options: {
      socket: {
        host: config.REDIS_HOST,
        port: 6379,
      },
      password: config.REDIS_PASSWORD,
    },
  },
});
