import type { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';
import { In } from 'typeorm';
import { RoleRepository } from '../../modules/roles/role.repository.ts';
import HttpForbiddenError from '../errors/HttpForbiddenError.ts';
import HttpUnauthorizedError from '../errors/HttpUnauthorizedError.ts';
import type { AuthorizationPolicy } from '../types/route.ts';

const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Express.User> => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: Error | null, user: Express.User | false, info: any) => {
        if (err) return reject(err);
        if (!user) return reject(new HttpUnauthorizedError(info?.message));
        resolve(user);
      },
    )(req, res, next);
  });
};

export const checkUserPermissionMiddleware = (
  policy: AuthorizationPolicy,
): RequestHandler => {
  return async (req, res, next) => {
    if (!policy) return next();

    try {
      const user = await authenticateJwt(req, res, next);
      req.user = user;

      if (policy.type === 'authenticated') {
        return next();
      }

      if (policy.type === 'role') {
        const hasRole = await RoleRepository.findOneBy({
          users: { id: user.id },
          id: In(policy.values),
        });

        if (!hasRole) {
          return next(new HttpForbiddenError());
        }

        return next();
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
