import { z } from 'zod';
import type { User } from '../users/user.entity.ts';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export const loginRequest = () =>
  z.object({
    email: z.email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  });
export type LoginRequestType = z.infer<ReturnType<typeof loginRequest>>;
export type LoginResponseType = TokenPair;

export type RefeshResponseType = TokenPair;

export const registerRequest = () =>
  z.object({
    firstName: z.string().min(1, 'Name is required'),
    lastName: z.string().optional(),
    email: z.email().min(1, 'Email is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  });
export type RegisterRequestType = z.infer<ReturnType<typeof registerRequest>>;
export type RegisterResponseType = User;
