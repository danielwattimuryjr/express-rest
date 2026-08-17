import { StatusCodes } from 'http-status-codes';

export type DatabaseErrorData = {
  code?: string;
};

export class HttpDatabaseError extends Error {
  static readonly name = 'HttpDatabaseError';
  static readonly code = StatusCodes.INTERNAL_SERVER_ERROR;

  name = HttpDatabaseError.name;
  code: StatusCodes;
  data: DatabaseErrorData | undefined;

  constructor(message?: string, data?: DatabaseErrorData) {
    super(message ?? 'Database operation failed');
    this.code = HttpDatabaseError.code;
    this.data = data;
  }

  static isError(err: unknown): err is HttpDatabaseError {
    if (err && err instanceof Error) {
      return err.name === HttpDatabaseError.name;
    }

    return false;
  }
}

export default HttpDatabaseError;
