import { controller } from '../../common/http/controller.ts';
import type { GetAllUsersRoute } from './user.dto.ts';
import { userService } from './user.module.ts';

export const getAllUsersController = controller<GetAllUsersRoute>(
  'get',
  '',
  false,
  async () => {
    const data = await userService.getAll();

    return { data };
  },
);
