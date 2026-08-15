import { z } from 'zod';

export const userRequest = () =>
  z.object({
    name: z.string().min(1, 'Name is required'),
  });

export type UserRequestType = z.infer<ReturnType<typeof userRequest>>;
