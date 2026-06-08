import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_URL = process.env.NEON_DATABASE_URL;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL_URL === undefined) delete process.env.NEON_DATABASE_URL;
  else process.env.NEON_DATABASE_URL = ORIGINAL_URL;
});

describe("getSql", () => {
  it("throws when NEON_DATABASE_URL is missing", async () => {
    delete process.env.NEON_DATABASE_URL;
    const { getSql } = await import("@/lib/neon/get-sql");
    expect(() => getSql()).toThrow(/NEON_DATABASE_URL/);
  });

  it("returns a cached client when called twice", async () => {
    process.env.NEON_DATABASE_URL = "postgresql://user:pass@host/db?sslmode=require";
    const { getSql } = await import("@/lib/neon/get-sql");
    const first = getSql();
    const second = getSql();
    expect(second).toBe(first);
  });
});
