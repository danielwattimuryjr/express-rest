import type { JwtPayload } from 'jsonwebtoken';
import type { TokenTypeEnum } from '../enums/TokenTypeEnum.ts';

export interface CustomJwtPayload extends JwtPayload {
  type: TokenTypeEnum;
}
