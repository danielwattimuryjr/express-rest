import { Router, type RequestHandler } from 'express';
import { ZodObject } from 'zod';
import type { ControllerHandler } from '../types/controller.ts';
import type { AnyRoute } from '../types/route.ts';
import { requestHandler } from './handleRequest.ts';

export function controller<TRoute extends AnyRoute>(
  method: TRoute['method'],
  path: TRoute['path'],
  validate: TRoute['schema'] extends true ? ZodObject : false,
  fn: ControllerHandler<TRoute>,
  contentType: TRoute['mimeType'] = 'application/json',
): RequestHandler {
  const router = Router();

  router[method](
    path,
    //   checkUserPermissionMiddleware(permission),
    //   validateRequestBodyMiddleware(validate),
    requestHandler(fn, contentType),
  );

  return router;
}
