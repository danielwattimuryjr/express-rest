import { StatusCodes } from 'http-status-codes';

export class HttpForbiddenError extends Error {
  static readonly name = 'ForbiddenError';
  static readonly code = StatusCodes.FORBIDDEN;

  name = HttpForbiddenError.name;
  code: StatusCodes;

  constructor(message?: string) {
    super(message ?? 'Insufficient role');
    this.code = HttpForbiddenError.code;
  }

  static isError(err: unknown): err is HttpForbiddenError {
    if (err && err instanceof Error) {
      return err.name === HttpForbiddenError.name;
    }
    return false;
  }
}

export default HttpForbiddenError;
