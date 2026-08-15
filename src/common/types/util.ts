import type { AnyRoute, RouteDefinition } from './route.ts';

export type RequiredOnly<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

export type Concat<T extends string[]> = T extends [infer F, ...infer R]
  ? F extends string
    ? R extends string[]
      ? `${F}${Concat<R>}`
      : never
    : never
  : '';

export type ExtractPaths<T extends Array<AnyRoute>> = {
  [K in keyof T]: T[K] extends RouteDefinition<
    'get' | 'head' | 'put' | 'patch' | 'post' | 'delete' | 'all' | 'use',
    infer P,
    any,
    any,
    any,
    any,
    any
  >
    ? P
    : never;
};
