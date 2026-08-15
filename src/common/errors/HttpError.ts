import type { IncomingHttpHeaders } from 'http';

export interface HttpErrorOptions {
  statusCode?: number;
  safeMessage?: string;
  details?: unknown;
  headers?: IncomingHttpHeaders;
}

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly safeMessage: string;
  public readonly details?: unknown;
  public readonly headers?: IncomingHttpHeaders;

  constructor(message: string, options: HttpErrorOptions = {}) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = options.statusCode ?? 500;
    this.safeMessage = options.safeMessage ?? 'Internal server error';
    this.details = options.details;
    this.headers = options.headers;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const isHttpError = (err: unknown): err is HttpError =>
  typeof err === 'object' && err !== null && 'statusCode' in (err as any);
