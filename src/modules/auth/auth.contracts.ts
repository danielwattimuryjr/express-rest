import type { RouteDefinition } from '../../common/types/route.ts';
import type { LoginRequestType, LoginResponseType } from './auth.schema.ts';

export type UseAuthRoute = RouteDefinition<'use', '/auth'>;

export type PostLoginRoute = RouteDefinition<
  'post',
  '/login',
  true,
  LoginRequestType,
  LoginResponseType
>;
