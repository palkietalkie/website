// Singleton Neon client for server-action callers. HTTP-mode (`neon(...)`) is the right choice for Vercel server actions — one round-trip per query, no connection pooling state to manage, fine on cold starts.

import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

export function getSql(): ReturnType<typeof neon> {
  if (cached) return cached;
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error("NEON_DATABASE_URL is not set");
  }
  cached = neon(url);
  return cached;
}
