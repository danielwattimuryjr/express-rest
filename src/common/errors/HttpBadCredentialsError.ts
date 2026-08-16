import type { HttpErrorOptions } from './HttpError.ts';
import { HttpError } from './HttpError.ts';

export class HttpBadCredentialsError extends HttpError {
  constructor(
    message = 'Email or password wrong',
    options: HttpErrorOptions = {},
  ) {
    super(message, {
      ...options,
      statusCode: 401,
      safeMessage: options.safeMessage ?? 'Email or password wrong',
    });
    this.name = 'BadCredentialsError';
  }
}

export default HttpBadCredentialsError;
