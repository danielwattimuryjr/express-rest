import { Router } from 'express';
import { useRoute } from '../../common/http/useRoute.ts';
import limiter from '../../configuration/rateLimit.ts';
import type { UseAuthRoute } from './auth.contracts.ts';
import {
  postLoginController,
  postRefreshController,
  postRegisterController,
} from './auth.controller.ts';

const authRouter = Router();
authRouter.use('/auth', limiter);
authRouter.use(
  ...useRoute<[UseAuthRoute]>(
    '/auth',
    postLoginController,
    postRefreshController,
    postRegisterController,
  ),
);

export default authRouter;
