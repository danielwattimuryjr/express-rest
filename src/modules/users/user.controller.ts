import { controller } from '../../common/http/controller.ts';
import type { GetAllUsersRoute, PostUserRoute } from './user.contract.ts';
import { userService } from './user.module.ts';
import { userRequest } from './user.schema.ts';

export const getAllUsersController = controller<GetAllUsersRoute>(
  'get',
  '',
  false,
  async () => {
    const data = await userService.getAll();

    return { data };
  },
);

export const postUsersController = controller<PostUserRoute>(
  'post',
  '',
  userRequest(),
  async (req) => {
    const data = await userService.post(req.body);

    return { data };
  },
);
