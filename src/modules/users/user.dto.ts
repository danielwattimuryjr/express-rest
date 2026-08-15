import type { RouteDefinition } from '../../common/types/route.ts';
import { type UserRequestType } from './user.schema.ts';

export type UseUsersRoute = RouteDefinition<'use', '/users'>;

export type GetAllUsersRoute = RouteDefinition<
  'get',
  '',
  false,
  any,
  {
    name: string;
  }[]
>;

export type PostUserRoute = RouteDefinition<
  'post',
  '',
  true,
  UserRequestType,
  {
    id: number;
    name: string;
  }
>;
