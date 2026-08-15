import { Router } from 'express';
import { useRoute } from '../../common/http/useRoute.ts';
import {
  getAllUsersController,
  postUsersController,
} from './user.controller.ts';
import type { UseUsersRoute } from './user.dto.ts';

const routes = Router();
routes.use(getAllUsersController);
routes.use(postUsersController);

const usersRouter = Router();
usersRouter.use(...useRoute<[UseUsersRoute]>('/users', routes));

export default usersRouter;
