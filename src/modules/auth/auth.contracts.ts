import type { RouteDefinition } from '../../common/types/route.ts';
import type {
  LoginRequestType,
  LoginResponseType,
  RefeshResponseType,
} from './auth.schema.ts';

export type UseAuthRoute = RouteDefinition<'use', '/auth'>;

export type PostLoginRoute = RouteDefinition<
  'post',
  '/login',
  false,
  true,
  LoginRequestType,
  LoginResponseType
>;

export type PostRefreshRoute = RouteDefinition<
  'post',
  '/refresh',
  false,
  false,
  undefined,
  RefeshResponseType
>;
