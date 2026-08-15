import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateRequestBodyMiddleware = (
  schema?: ZodType | false,
): RequestHandler => {
  return async (req, _res, next) => {
    if (!schema) return next();

    try {
      const parsed = await schema.parseAsync(req.body);

      req.body = parsed;
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
