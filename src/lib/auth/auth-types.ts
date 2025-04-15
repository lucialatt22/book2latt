// src/lib/auth/auth-types.ts
export interface User {
  id: number;
  username: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: Date;
}
