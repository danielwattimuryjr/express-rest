import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../configuration/config.ts';
import HttpDatabaseConflictError from '../errors/HttpDatabaseConflictError.ts';
import HttpDatabaseError from '../errors/HttpDatabaseError.ts';
import HttpForbiddenError from '../errors/HttpForbiddenError.ts';
import HttpNotFoundError from '../errors/HttpNotFoundError.ts';
import HttpUnauthorizedError from '../errors/HttpUnauthorizedError.ts';
import { HttpValidationError } from '../errors/HttpValidationError.ts';
import type { HttpResponse } from '../types/http.ts';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const response: HttpResponse<unknown> = {
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
    data: undefined,
  };

  if (HttpValidationError.isError(err)) {
    response.code = err.code;
    response.data = err.data;
  } else if (HttpNotFoundError.isError(err)) {
    response.code = err.code;
    response.data = err.url;
  } else if (HttpUnauthorizedError.isError(err)) {
    response.code = err.code;
  } else if (HttpForbiddenError.isError(err)) {
    response.code = err.code;
  } else if (HttpDatabaseConflictError.isError(err)) {
    response.code = err.code;
    if (config.NODE_ENV !== 'production') {
      response.data = err.data;
    }
  } else if (HttpDatabaseError.isError(err)) {
    response.code = err.code;
    if (config.NODE_ENV !== 'production') {
      response.data = err.data;
    }
  } else {
    response.message = 'Unknown error';
    console.log(err.stack);
  }

  if (!response.data) {
    delete response.data;
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(response.code).json(response);
}

export default errorHandler;
