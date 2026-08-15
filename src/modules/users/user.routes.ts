import { Router } from 'express';
import { useRoute } from '../../common/http/useRoute.ts';
import type { UseUsersRoute } from './user.contract.ts';
import {
  getAllUsersController,
  postUsersController,
} from './user.controller.ts';

const usersRouter = Router();
usersRouter.use(
  ...useRoute<[UseUsersRoute]>(
    '/users',
    getAllUsersController,
    postUsersController,
  ),
);

export default usersRouter;
