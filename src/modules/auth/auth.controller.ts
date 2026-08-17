import { extractBearerToken } from '../../common/helper/extractBearerToken.ts';
import { controller } from '../../common/http/controller.ts';
import type { PostLoginRoute, PostRefreshRoute } from './auth.contracts.ts';
import { loginRequest } from './auth.schema.ts';
import { AuthService } from './auth.service.ts';

export const postLoginController = controller<PostLoginRoute>(
  'post',
  '/login',
  loginRequest(),
  false,
  async (req) => {
    const tokenPair = await AuthService.login(req.body);

    return {
      data: tokenPair,
    };
  },
);

export const postRefreshController = controller<PostRefreshRoute>(
  'post',
  '/refresh',
  false,
  false,
  async (req) => {
    const refreshToken = extractBearerToken(req.headers.authorization);

    const { accessToken, newRefreshToken } =
      await AuthService.refresh(refreshToken);

    return {
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  },
);
