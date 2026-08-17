import { controller } from '../../common/http/controller.ts';
import type { GetAllUsersRoute, PostUserRoute } from './user.contract.ts';
import { userRequest } from './user.schema.ts';
import { UserService } from './user.service.ts';

export const getAllUsersController = controller<GetAllUsersRoute>(
  'get',
  '',
  false,
  false,
  async () => {
    const data = await UserService.getAllUsers();

    return { data };
  },
);

export const postUsersController = controller<PostUserRoute>(
  'post',
  '',
  userRequest(),
  {
    type: 'authenticated',
  },
  async (req) => {
    const data = await UserService.createUser(req.body);

    return { data };
  },
);
