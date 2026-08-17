import type { RequestHandler } from 'express';
import { z, type ZodType } from 'zod';
import { HttpValidationError } from '../errors/HttpValidationError.ts';

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
      if (err instanceof z.ZodError) {
        throw new HttpValidationError('Validation failed', err.issues);
      }
    }
  };
};
