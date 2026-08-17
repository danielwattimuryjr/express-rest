import type { RoleEnum } from '../../common/enums/RoleEnum.ts';
import type { RouteDefinition } from '../../common/types/route.ts';
import { type UserRequestType, type UserResponseType } from './user.schema.ts';

export type UseUsersRoute = RouteDefinition<'use', '/users'>;

export type GetAllUsersRoute = RouteDefinition<
  'get',
  '',
  {
    type: 'role';
    values: [RoleEnum.ADMIN];
  },
  false,
  any,
  UserResponseType[]
>;

export type PostUserRoute = RouteDefinition<
  'post',
  '',
  {
    type: 'role';
    values: [RoleEnum.ADMIN];
  },
  true,
  UserRequestType,
  UserResponseType
>;
