import type { RouteDefinition } from '../../common/types/route.ts';
import { type UserRequestType, type UserResponseType } from './user.schema.ts';

export type UseUsersRoute = RouteDefinition<'use', '/users'>;

export type GetAllUsersRoute = RouteDefinition<
  'get',
  '',
  {
    type: 'authenticated';
  },
  false,
  any,
  UserResponseType[]
>;

export type PostUserRoute = RouteDefinition<
  'post',
  '',
  {
    type: 'authenticated';
  },
  true,
  UserRequestType,
  UserResponseType
>;
