import type { RoleEnum } from '../enums/RoleEnum.ts';
import type { BodyMethod, ContentType, HttpMethod, Query } from './http.ts';

export interface ParamsDictionary {
  [key: string]: string;
}

type RemoveTail<
  TString extends string,
  KTail extends string,
> = TString extends `${infer P}${KTail}` ? P : TString;

type GetRouteParams<KString extends string> = RemoveTail<
  RemoveTail<RemoveTail<KString, `/${string}`>, `-${string}`>,
  `.${string}`
>;

type RouteParams<TRoute extends string | undefined> = string extends TRoute
  ? ParamsDictionary
  : TRoute extends `${string}(${string}`
    ? ParamsDictionary
    : TRoute extends `${string}:${infer Rest}`
      ? (GetRouteParams<Rest> extends never
          ? ParamsDictionary
          : GetRouteParams<Rest> extends `${infer ParamName}?`
            ? { [P in ParamName]?: string }
            : { [P in GetRouteParams<Rest>]: string }) &
          (Rest extends `${GetRouteParams<Rest>}${infer Next}`
            ? RouteParams<Next>
            : unknown)
      : TRoute extends undefined
        ? undefined
        : {};

export type AuthorizationPolicy =
  | RoleAuthorizationPolicy
  // | PermissionAuthorizationPolicy
  | {
      type: 'authenticated';
    }
  | false;

type RoleAuthorizationPolicy = {
  type: 'role';
  values: RoleEnum[];
  mode?: 'any' | 'all';
};

type PermissionAuthorizationPolicy = {
  type: 'permission';
  values: string[];
  mode?: 'any' | 'all';
};

export type RouteDefinition<
  TMethod extends HttpMethod,
  TPath extends string = string,
  TAuthPolicy extends AuthorizationPolicy = false,
  TSchema extends true | false = false,
  TBody = any,
  TResponse = any,
  TQuery = Query,
  TType extends ContentType = 'application/json',
> = {
  method: TMethod;
  path: TPath;
  authorizationPolicy: TAuthPolicy;
  response: TMethod extends 'use' ? undefined : TResponse;
  request: TMethod extends 'post' | 'put' | 'patch' ? TBody : undefined;
  query: TMethod extends 'use' ? undefined : TQuery;
  params: RouteParams<TPath>;
  schema: TMethod extends BodyMethod ? TSchema : false;
  mimeType?: TType;
};

export type AnyRoute = RouteDefinition<
  HttpMethod,
  string,
  AuthorizationPolicy,
  true | false,
  unknown,
  unknown,
  Query,
  ContentType
>;
