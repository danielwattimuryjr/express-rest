import { z } from 'zod';
import type { User } from './user.entity.ts';

export const userRequest = () =>
  z.object({
    firstName: z.string().min(1, 'Name is required'),
    lastName: z.string().optional(),
    email: z.email().min(1, 'Email is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  });

export type UserRequestType = z.infer<ReturnType<typeof userRequest>>;
export type UserResponseType = User;
