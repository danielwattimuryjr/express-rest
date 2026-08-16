import { controller } from '../../common/http/controller.ts';
import type { PostLoginRoute } from './auth.contracts.ts';
import { authService } from './auth.module.ts';
import { loginRequest } from './auth.schema.ts';

export const postLoginController = controller<PostLoginRoute>(
  'post',
  '/login',
  loginRequest(),
  async (req) => {
    const tokenPair = await authService.login(req.body);

    return {
      data: tokenPair,
    };
  },
);
