import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../configuration/config.ts';
import logger from '../../configuration/logger.ts';
import { isHttpError } from '../errors/HttpError.ts';
import type { HttpResponse } from '../types/http.ts';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<HttpResponse<undefined>> {
  let statusCode = 500;
  let message = 'Internal server error';

  if (isHttpError(err)) {
    statusCode = err.statusCode;
    message = err.safeMessage ?? err.message ?? message;

    if (err.headers) {
      for (const [key, value] of Object.entries(err.headers)) {
        if (value) {
          try {
            res.setHeader(key, String(value));
          } catch {
            // ignore invalid headers
          }
        }
      }
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    logger.debug('Validation error: %o', err.format());
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  // Log with stack in development for debugging
  if (config.NODE_ENV === 'development') {
    logger.error('Error on %s %s: %O', req.method, req.originalUrl, err);
  } else {
    logger.error('Error on %s %s: %s', req.method, req.originalUrl, message);
  }

  const response: HttpResponse<undefined> = {
    code: statusCode,
    message,
  };

  return res.status(statusCode).json(response);
}

export default errorHandler;
