import jwt from 'jsonwebtoken';
import moment, { type Moment } from 'moment';
import type { TokenTypeEnum } from '../../common/enums/token.ts';
import type { CustomJwtPayload } from '../../common/types/token.ts';
import config from '../../configuration/config.ts';
import type { User } from '../users/user.entity.ts';

export class JwtService {
  generateToken(
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
}
