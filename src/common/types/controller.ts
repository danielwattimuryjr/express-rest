import type { NextFunction, Response } from 'express';
import type { HttpRequest, HttpResponse } from './http.ts';
import type { AnyRoute } from './route.ts';
import type { RequiredOnly } from './util.ts';

export type ControllerHandler<TRoute extends AnyRoute> = (
  req: HttpRequest<
    TRoute['params'],
    TRoute['response'],
    TRoute['request'],
    TRoute['query']
  >,
  res: Response,
  next: NextFunction,
) => TRoute['response'] extends undefined
  ?
      | Promise<void>
      | Promise<Partial<Omit<HttpResponse<TRoute['response']>, 'data'>>>
  : Promise<
      RequiredOnly<HttpResponse<NonNullable<TRoute['response']>>, 'data'> & {
        totalRows?: number;
      }
    >;
