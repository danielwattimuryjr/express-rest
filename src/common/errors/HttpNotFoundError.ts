import type { HttpErrorOptions } from './HttpError.ts';
import { HttpError } from './HttpError.ts';

export class HttpNotFoundError extends HttpError {
  constructor(message = 'Not Found', options: HttpErrorOptions = {}) {
    super(message, {
      ...options,
      statusCode: 404,
      safeMessage: options.safeMessage ?? 'Not Found',
    });
    this.name = 'NotFoundError';
  }
}

export default HttpNotFoundError;
