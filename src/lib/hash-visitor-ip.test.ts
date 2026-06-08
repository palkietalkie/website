import { describe, expect, test, vi } from "vitest";
import { hashVisitorIp } from "./hash-visitor-ip";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

const { headers } = await import("next/headers");
const mockHeaders = headers as ReturnType<typeof vi.fn>;

describe("hashVisitorIp", () => {
  test("returns 32-char hex digest of x-forwarded-for first IP", async () => {
    mockHeaders.mockResolvedValue({
      get: (k: string) => (k === "x-forwarded-for" ? "1.2.3.4" : null),
    });
    const result = await hashVisitorIp();
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });

  test("strips port-and-spaces and uses only the first comma-separated entry", async () => {
    mockHeaders.mockResolvedValue({ get: () => " 5.6.7.8 , 9.10.11.12" });
    const a = await hashVisitorIp();
    mockHeaders.mockResolvedValue({ get: () => "5.6.7.8" });
    const b = await hashVisitorIp();
    expect(a).toBe(b);
  });

  test("handles missing x-forwarded-for by hashing the empty-IP sentinel", async () => {
    mockHeaders.mockResolvedValue({ get: () => null });
    const result = await hashVisitorIp();
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });
});
