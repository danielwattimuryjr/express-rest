import type { RequestHandler } from 'express';
import HttpNotFoundError from '../errors/HttpNotFoundError.ts';

export const notFoundController: RequestHandler = (req, res, next) => {
  next(new HttpNotFoundError('URL not found', req.originalUrl));
};
