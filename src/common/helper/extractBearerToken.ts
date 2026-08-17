import HttpUnauthorizedError from '../errors/HttpUnauthorizedError.ts';

export const extractBearerToken = (authHeader: string | undefined): string => {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new HttpUnauthorizedError('Token not provided');
  }
  return authHeader.split(' ')[1];
};
