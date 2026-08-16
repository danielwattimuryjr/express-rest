import type { JwtPayload } from 'jsonwebtoken';
import type { TokenTypeEnum } from '../enums/token.ts';

export interface CustomJwtPayload extends JwtPayload {
  type: TokenTypeEnum;
}
