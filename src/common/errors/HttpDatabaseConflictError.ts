import { StatusCodes } from 'http-status-codes';
import type { DatabaseErrorData } from './HttpDatabaseError.ts';

export class HttpDatabaseConflictError extends Error {
  static readonly name = 'HttpDatabaseConflictError';
  static readonly code = StatusCodes.CONFLICT;

  name = HttpDatabaseConflictError.name;
  code: StatusCodes;
  data: DatabaseErrorData | undefined;

  constructor(message?: string, data?: DatabaseErrorData) {
    super(message ?? 'Database conflict');
    this.code = HttpDatabaseConflictError.code;
    this.data = data;
  }

  static isError(err: unknown): err is HttpDatabaseConflictError {
    if (err && err instanceof Error) {
      return err.name === HttpDatabaseConflictError.name;
    }

    return false;
  }
}

export default HttpDatabaseConflictError;
