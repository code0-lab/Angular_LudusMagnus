export interface IToken {
  id?: number;
  token: string;
  userId: number;
  expiresAt: string; // ISO date string
  createdAt: string; // ISO date string
}