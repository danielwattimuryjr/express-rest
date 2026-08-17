import jwt from 'jsonwebtoken';
import moment, { type Moment } from 'moment';
import type { TokenTypeEnum } from '../../common/enums/TokenTypeEnum.ts';
import HttpUnauthorizedError from '../../common/errors/HttpUnauthorizedError.ts';
import type { CustomJwtPayload } from '../../common/types/token.ts';
import config from '../../configuration/config.ts';
import type { User } from '../users/user.entity.ts';

export class JwtService {
  static generateToken(
    user: User,
    expires: Moment,
    type: TokenTypeEnum,
    secret: string = config.JWT_SECRET,
  ) {
    const payload: CustomJwtPayload = {
      sub: `${user.id}`,
      email: user.email,
      username: user.username,
      iat: moment().unix(),
      exp: expires.unix(),
      type: type,
    };

    return jwt.sign(payload, secret);
  }

  static verifyToken(
    token: string,
    expectedType: TokenTypeEnum,
    secret: string = config.JWT_SECRET,
  ): CustomJwtPayload {
    let payload: CustomJwtPayload;

    try {
      payload = jwt.verify(token, secret) as CustomJwtPayload;
    } catch (err) {
      throw new HttpUnauthorizedError('Invalid or expired token');
    }

    if (payload.type !== expectedType) {
      throw new HttpUnauthorizedError('Invalid token type');
    }

    return payload;
  }
}
