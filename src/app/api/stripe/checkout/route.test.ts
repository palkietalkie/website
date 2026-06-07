import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const getCurrentUserIdMock = vi.fn();
const getCurrentUserEmailMock = vi.fn();
const createCheckoutSessionMock = vi.fn();

vi.mock("@/lib/auth/getCurrentUserId", () => ({
  getCurrentUserId: () => getCurrentUserIdMock(),
  getCurrentUserEmail: () => getCurrentUserEmailMock(),
}));

vi.mock("@/lib/stripe/checkout", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/stripe/checkout")>("@/lib/stripe/checkout");
  return {
    ...actual,
    createCheckoutSession: (...args: Parameters<typeof actual.createCheckoutSession>) =>
      createCheckoutSessionMock(...args),
  };
});

const { POST } = await import("@/app/api/stripe/checkout/route");

function buildReq(opts: { url: string; body?: unknown; jsonContentType?: boolean }): NextRequest {
  const url = new URL(opts.url);
  const headers = new Map<string, string>();
  if (opts.jsonContentType) headers.set("content-type", "application/json");

  const nextReq = {
    url: opts.url,
    nextUrl: url,
    headers: {
      get: (key: string) => headers.get(key.toLowerCase()) ?? null,
    },
    json: async () => opts.body,
  } as unknown as NextRequest;
  return nextReq;
}

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    getCurrentUserIdMock.mockReset();
    getCurrentUserEmailMock.mockReset();
    createCheckoutSessionMock.mockReset();
  });

  it("returns 401 when no Clerk user", async () => {
    getCurrentUserIdMock.mockResolvedValue(null);
    const res = await POST(buildReq({ url: "https://x.com/api/stripe/checkout?tier=individual" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing/invalid tier in query string", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    const res = await POST(buildReq({ url: "https://x.com/api/stripe/checkout?tier=bogus" }));
    expect(res.status).toBe(400);
  });

  it("reads tier from JSON body when content-type is JSON", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue("u@example.com");
    createCheckoutSessionMock.mockResolvedValue({
      id: "cs_1",
      url: "https://stripe.test/cs_1",
    });

    const res = await POST(
      buildReq({
        url: "https://x.com/api/stripe/checkout",
        body: { tier: "family" },
        jsonContentType: true,
      }),
    );

    expect(createCheckoutSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        tier: "family",
        userId: "user_1",
        email: "u@example.com",
        origin: "https://x.com",
      }),
    );
    expect(res.status).toBe(303);
  });

  it("returns 500 when Stripe returns no URL", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    createCheckoutSessionMock.mockResolvedValue({ id: "cs_no_url", url: null });

    const res = await POST(buildReq({ url: "https://x.com/api/stripe/checkout?tier=individual" }));
    expect(res.status).toBe(500);
  });

  it("returns 500 with the error message when Stripe throws", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    createCheckoutSessionMock.mockRejectedValue(new Error("Stripe bad request"));

    const res = await POST(buildReq({ url: "https://x.com/api/stripe/checkout?tier=individual" }));
    expect(res.status).toBe(500);
    const payload = await res.json();
    expect(payload.error).toBe("Stripe bad request");
  });

  it("returns 400 when the JSON body omits tier entirely", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    const res = await POST(
      buildReq({
        url: "https://x.com/api/stripe/checkout",
        body: {},
        jsonContentType: true,
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 500 with the fallback message when Stripe throws a non-Error value", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    createCheckoutSessionMock.mockRejectedValue("not an error instance");

    const res = await POST(buildReq({ url: "https://x.com/api/stripe/checkout?tier=individual" }));
    expect(res.status).toBe(500);
    const payload = await res.json();
    expect(payload.error).toBe("Stripe error");
  });
});
