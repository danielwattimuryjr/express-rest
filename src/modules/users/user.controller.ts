import { RoleEnum } from '../../common/enums/RoleEnum.ts';
import { controller } from '../../common/http/controller.ts';
import type { GetAllUsersRoute, PostUserRoute } from './user.contract.ts';
import { userRequest } from './user.schema.ts';
import { UserService } from './user.service.ts';

export const getAllUsersController = controller<GetAllUsersRoute>(
  'get',
  '',
  false,
  {
    type: 'role',
    values: [RoleEnum.ADMIN],
  },
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
    type: 'role',
    values: [RoleEnum.ADMIN],
  },
  async (req) => {
    const data = await UserService.createUser(req.body);

    return { data };
  },
);
