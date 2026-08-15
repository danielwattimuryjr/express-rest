import type { Request } from 'express';
import type { ParamsDictionary } from './route.ts';

export type HttpMethod =
  | 'get'
  | 'head'
  | 'put'
  | 'patch'
  | 'post'
  | 'delete'
  | 'all'
  | 'use';

export type ContentType =
  | 'application/json'
  | 'application/pdf'
  | 'text/html'
  | 'text/plain'
  | 'text/css'
  | 'text/csv'
  | 'text/javascript'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/svg+xml'
  | 'image/png'
  | 'audio/aac'
  | 'audio/mpeg'
  | 'video/mpeg'
  | 'video/mp4';

export type BodyMethod = 'post' | 'put' | 'patch';

export interface Query {
  [key: string]: undefined | string | string[] | Query | Query[];
}

export type HttpRequest<
  TParams extends { [key: string]: string } = ParamsDictionary,
  TResponse = any,
  TRequest = any,
  TQuery = any,
  TLocals extends Record<string, any> = Record<string, any>,
> = Request<TParams, TResponse, TRequest, TQuery, TLocals>;

export type HttpResponse<TData> = TData extends undefined
  ? {
      message: string;
      code: number;
    }
  : {
      message: string;
      code: number;
      data: TData;
    };
