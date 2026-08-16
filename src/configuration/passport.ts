import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type VerifiedCallback,
  type VerifyCallback,
} from 'passport-jwt';
import { TokenTypeEnum } from '../common/enums/token.ts';
import type { CustomJwtPayload } from '../common/types/token.ts';
import { userService } from '../modules/users/user.module.ts';
import config from './config.ts';

const jwtOptions = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verifyCallback: VerifyCallback = async (
  payload: CustomJwtPayload,
  done: VerifiedCallback,
) => {
  if (payload.type !== TokenTypeEnum.ACCESS) {
    return done(null, false);
  }
  const user = await userService.getOne(Number(payload.sub));
  if (!user) {
    return done(null, false);
  }

  return done(null, {
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

export const jwtStrategy = new JwtStrategy(jwtOptions, verifyCallback);
