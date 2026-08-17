import { Router } from 'express';
import { useRoute } from '../../common/http/useRoute.ts';
import type { UseAuthRoute } from './auth.contracts.ts';
import {
  postLoginController,
  postRefreshController,
} from './auth.controller.ts';

const authRouter = Router();
authRouter.use(
  ...useRoute<[UseAuthRoute]>(
    '/auth',
    postLoginController,
    postRefreshController,
  ),
);

export default authRouter;
