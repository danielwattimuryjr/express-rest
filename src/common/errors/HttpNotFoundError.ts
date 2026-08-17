import { StatusCodes } from 'http-status-codes';

export class HttpNotFoundError extends Error {
  static readonly name = 'NotFoundError';
  static readonly code = StatusCodes.NOT_FOUND;

  name = HttpNotFoundError.name;
  code: StatusCodes;
  url: string | undefined;

  constructor(message?: string, url?: string) {
    super(message ?? 'Resource not found');
    this.code = HttpNotFoundError.code;
    this.url = url;
  }

  static isError(err: unknown): err is HttpNotFoundError {
    if (err && err instanceof Error) {
      return err.name === HttpNotFoundError.name;
    }
    return false;
  }
}

export default HttpNotFoundError;
