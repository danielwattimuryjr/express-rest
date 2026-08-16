import { z } from 'zod';

export const loginRequest = () =>
  z.object({
    email: z.email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  });

export type LoginRequestType = z.infer<ReturnType<typeof loginRequest>>;
export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
};
