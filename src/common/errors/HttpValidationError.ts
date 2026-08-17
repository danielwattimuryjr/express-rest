import { StatusCodes } from 'http-status-codes';
import type z from 'zod';

export class HttpValidationError extends Error {
  static readonly name = 'HttpValidationError';
  static readonly code = StatusCodes.UNPROCESSABLE_ENTITY;

  name = HttpValidationError.name;
  code: StatusCodes;
  data: z.core.$ZodIssue[];

  constructor(message: string, data: z.core.$ZodIssue[]) {
    super(message);
    this.code = HttpValidationError.code;
    this.data = data;
  }

  static isError(err: unknown): err is HttpValidationError {
    if (err && err instanceof Error) {
      return err.name === HttpValidationError.name;
    }
    return false;
  }
}
