import { beforeEach, describe, expect, it, vi } from "vitest";
import { LOCAL_DEV_ORIGIN } from "@/constants/local-dev-origin";

const getCurrentUserIdMock = vi.fn();
const getCurrentUserEmailMock = vi.fn();
const createCheckoutSessionMock = vi.fn();
const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const headersMock = vi.fn();

vi.mock("@/lib/auth/getCurrentUserId", () => ({
  getCurrentUserId: () => getCurrentUserIdMock(),
  getCurrentUserEmail: () => getCurrentUserEmailMock(),
}));

vi.mock("@/lib/stripe/createCheckoutSession", async () => {
  const actual = await vi.importActual<typeof import("@/lib/stripe/createCheckoutSession")>(
    "@/lib/stripe/createCheckoutSession",
  );
  return {
    ...actual,
    createCheckoutSession: (...args: Parameters<typeof actual.createCheckoutSession>) =>
      createCheckoutSessionMock(...args),
  };
});

vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

const { startCheckout } = await import("@/app/signup/actions/start-checkout");

function makeHeaderBag(map: Record<string, string>) {
  return {
    get: (key: string) => map[key.toLowerCase()] ?? null,
  };
}

describe("startCheckout server action", () => {
  beforeEach(() => {
    getCurrentUserIdMock.mockReset();
    getCurrentUserEmailMock.mockReset();
    createCheckoutSessionMock.mockReset();
    redirectMock.mockClear();
    headersMock.mockReset();
  });

  it("redirects to sign-in when no user", async () => {
    getCurrentUserIdMock.mockResolvedValue(null);
    headersMock.mockResolvedValue(makeHeaderBag({}));

    await expect(startCheckout("individual")).rejects.toThrow(/NEXT_REDIRECT/);
    expect(redirectMock).toHaveBeenCalledWith("/sign-in?redirect_url=/signup");
  });

  it("calls createCheckoutSession with resolved origin and redirects", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_42");
    getCurrentUserEmailMock.mockResolvedValue("a@b.c");
    headersMock.mockResolvedValue(
      makeHeaderBag({
        host: "palkietalkie.com",
        "x-forwarded-proto": "https",
      }),
    );
    createCheckoutSessionMock.mockResolvedValue({
      id: "cs_1",
      url: "https://stripe.test/cs_1",
    });

    await expect(startCheckout("family")).rejects.toThrow(/NEXT_REDIRECT/);

    expect(createCheckoutSessionMock).toHaveBeenCalledWith({
      tier: "family",
      userId: "user_42",
      email: "a@b.c",
      origin: "https://palkietalkie.com",
    });
    expect(redirectMock).toHaveBeenLastCalledWith("https://stripe.test/cs_1");
  });

  it("prefers x-forwarded-host over host when both are present", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    headersMock.mockResolvedValue(
      makeHeaderBag({
        host: "internal.local",
        "x-forwarded-host": "palkietalkie.com",
        "x-forwarded-proto": "https",
      }),
    );
    createCheckoutSessionMock.mockResolvedValue({
      id: "cs_1",
      url: "https://stripe.test/cs_1",
    });

    await expect(startCheckout("individual")).rejects.toThrow(/NEXT_REDIRECT/);
    const arg = createCheckoutSessionMock.mock.calls[0]![0];
    expect(arg.origin).toBe("https://palkietalkie.com");
  });

  it("falls back to localhost when no host header is set", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    headersMock.mockResolvedValue(makeHeaderBag({}));
    createCheckoutSessionMock.mockResolvedValue({
      id: "cs_1",
      url: "https://stripe.test/cs_1",
    });

    await expect(startCheckout("individual")).rejects.toThrow(/NEXT_REDIRECT/);
    const arg = createCheckoutSessionMock.mock.calls[0]![0];
    expect(arg.origin).toBe(LOCAL_DEV_ORIGIN);
  });

  it("throws when Stripe returns no URL", async () => {
    getCurrentUserIdMock.mockResolvedValue("user_1");
    getCurrentUserEmailMock.mockResolvedValue(null);
    headersMock.mockResolvedValue(makeHeaderBag({ host: "palkietalkie.com" }));
    createCheckoutSessionMock.mockResolvedValue({ id: "cs_no", url: null });

    await expect(startCheckout("individual")).rejects.toThrow(/did not return a checkout URL/);
  });
});
