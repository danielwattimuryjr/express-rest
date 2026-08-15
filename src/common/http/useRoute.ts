import type { RequestHandler } from 'express';
import type { RouteDefinition } from '../types/route.ts';
import type { Concat, ExtractPaths } from '../types/util.ts';

export const useRoute = <TRoute extends Array<RouteDefinition<'use', string>>>(
  path: Concat<ExtractPaths<TRoute>>,
  ...args: RequestHandler[]
): [string, ...RequestHandler[]] => {
  return [path, ...args];
};
