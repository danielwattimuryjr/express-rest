import type { User as AppUser } from '../../modules/users/user.entity.ts';

declare global {
  namespace Express {
    interface User extends Pick<AppUser, 'id' | 'email' | 'username'> {}
  }
}

export {};
