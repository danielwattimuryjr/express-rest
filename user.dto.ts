import type { RouteDefinition } from '../../common/types/route.ts';

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
