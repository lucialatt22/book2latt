// src/lib/env.ts
export function getEnv() {
  return {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/book2latt',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}
