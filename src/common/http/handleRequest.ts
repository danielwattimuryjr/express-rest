import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ControllerHandler } from '../types/controller.ts';
import type { HttpRequest, HttpResponse } from '../types/http.ts';
import type { AnyRoute } from '../types/route.ts';

const controllerDidRespond = <TResponse>(
  t: unknown,
): t is HttpResponse<TResponse> & { totalRows?: number } => {
  return !!t && t !== null && Object.keys(t).length > 0;
};

export function requestHandler<TRoute extends AnyRoute>(
  fn: ControllerHandler<TRoute>,
  contentType: TRoute['mimeType'] = 'application/json',
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(
      req as HttpRequest<
        TRoute['params'],
        TRoute['response'],
        TRoute['request'],
        TRoute['query']
      >,
      res,
      next,
    )
      .then((result) => {
        const defaultResponse: Omit<HttpResponse<undefined>, 'data'> = {
          code: StatusCodes.OK,
          message: 'success',
        };
        if (controllerDidRespond<TRoute['response']>(result)) {
          const { totalRows, ...content } = result;
          if (totalRows) {
            res.header('X-Total-Rows', `${totalRows}`);
          }
          if (
            'data' in content &&
            Buffer.isBuffer(content.data) &&
            contentType !== 'application/json'
          ) {
            return res
              .status(result.code || defaultResponse.code)
              .type(contentType)
              .send(content.data);
          }
          return res
            .status(content.code || defaultResponse.code)
            .json({ ...defaultResponse, ...content });
        }
        return res.status(defaultResponse.code).json(defaultResponse);
      })
      .catch(next);
  };
}
