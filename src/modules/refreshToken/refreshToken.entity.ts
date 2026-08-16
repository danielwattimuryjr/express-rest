export type RefreshToken = {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
};
