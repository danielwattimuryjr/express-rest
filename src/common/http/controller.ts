import { Router, type RequestHandler } from 'express';
import { ZodType } from 'zod';
import { validateRequestBodyMiddleware } from '../middleware/validateRequest.ts';
import type { ControllerHandler } from '../types/controller.ts';
import type { AnyRoute } from '../types/route.ts';
import { requestHandler } from './handleRequest.ts';

export function controller<TRoute extends AnyRoute>(
  method: TRoute['method'],
  path: TRoute['path'],
  validate: TRoute['schema'] extends true ? ZodType : false,
  fn: ControllerHandler<TRoute>,
  contentType: TRoute['mimeType'] = 'application/json',
): RequestHandler {
  const router = Router();

  router[method](
    path,
    //   checkUserPermissionMiddleware(permission),
    validateRequestBodyMiddleware(validate),
    requestHandler(fn, contentType),
  );

  return router;
}
