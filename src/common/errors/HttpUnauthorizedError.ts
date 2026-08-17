import { StatusCodes } from 'http-status-codes';

export class HttpUnauthorizedError extends Error {
  static readonly name = 'HttpUnauthorizedError';
  static readonly code = StatusCodes.UNAUTHORIZED;

  name = HttpUnauthorizedError.name;
  code: StatusCodes;

  constructor(message?: string) {
    super(message ?? 'Unauthorized');
    this.code = HttpUnauthorizedError.code;
  }

  static isError(err: unknown): err is HttpUnauthorizedError {
    if (err && err instanceof Error) {
      return err.name === HttpUnauthorizedError.name;
    }
    return false;
  }
}

export default HttpUnauthorizedError;
