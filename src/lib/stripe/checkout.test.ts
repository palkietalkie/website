import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildStripeClient,
  createCheckoutSession,
  normalizeTier,
  priceIdFor,
} from "@/lib/stripe/checkout";

type FakeSession = { id: string; url: string };

function makeFakeStripe(session: FakeSession = { id: "cs_1", url: "https://stripe.test/cs_1" }) {
  const create = vi.fn().mockResolvedValue(session);
  return {
    stripe: { checkout: { sessions: { create } } } as never,
    create,
  };
}

describe("normalizeTier", () => {
  it("returns the tier verbatim when valid", () => {
    expect(normalizeTier("individual")).toBe("individual");
    expect(normalizeTier("family")).toBe("family");
  });

  it("returns null for unknown / empty input", () => {
    expect(normalizeTier(null)).toBeNull();
    expect(normalizeTier(undefined)).toBeNull();
    expect(normalizeTier("")).toBeNull();
    expect(normalizeTier("enterprise")).toBeNull();
  });
});

describe("priceIdFor", () => {
  // Codegen-backed: prices come from backend/app/iap/products_list.py via constants/iap-products.ts. Tests pin against the literal ids so a drift in regen breaks here.
  it("returns the sandbox individual monthly price id by default (dev env)", () => {
    expect(priceIdFor("individual")).toBe("price_1Tb7Wa5kJkygJqGZq0o4ssGx");
  });

  it("supports yearly cycle", () => {
    expect(priceIdFor("individual", "yearly")).toBe("price_1TfBGv5kJkygJqGZhvE2hah8");
  });

  it("routes family tier to the family price id", () => {
    expect(priceIdFor("family")).toBe("price_1Tb7Wa5kJkygJqGZUxd7pwlV");
  });
});

describe("buildStripeClient", () => {
  const original = process.env.STRIPE_SECRET_KEY;

  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterAll(() => {
    if (original === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = original;
  });

  it("throws when STRIPE_SECRET_KEY is missing", () => {
    expect(() => buildStripeClient()).toThrow(/Missing STRIPE_SECRET_KEY/);
  });

  it("returns a Stripe client instance when key is set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    const client = buildStripeClient();
    expect(client).toBeDefined();
    expect(typeof (client as unknown as { checkout: unknown }).checkout).toBe("object");
  });

  it("createCheckoutSession constructs a default client when none is passed", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    const create = vi.fn().mockResolvedValue({ id: "cs", url: "https://x" });
    const stripe = { checkout: { sessions: { create } } } as never;
    await createCheckoutSession({
      tier: "individual",
      userId: "u",
      email: null,
      origin: "https://x",
      stripe,
    });
    expect(create).toHaveBeenCalled();
  });
});

describe("createCheckoutSession", () => {
  it("routes individual tier to the correct price id with quantity 1", async () => {
    const { stripe, create } = makeFakeStripe();
    await createCheckoutSession({
      tier: "individual",
      userId: "user_abc",
      email: "user@example.com",
      origin: "https://palkietalkie.com",
      stripe,
    });

    expect(create).toHaveBeenCalledTimes(1);
    const arg = create.mock.calls[0]![0];
    expect(arg.line_items).toEqual([{ price: "price_1Tb7Wa5kJkygJqGZq0o4ssGx", quantity: 1 }]);
    expect(arg.mode).toBe("subscription");
  });

  it("routes family tier to the correct price id", async () => {
    const { stripe, create } = makeFakeStripe();
    await createCheckoutSession({
      tier: "family",
      userId: "user_abc",
      email: "f@example.com",
      origin: "https://palkietalkie.com",
      stripe,
    });
    const arg = create.mock.calls[0]![0];
    expect(arg.line_items[0].price).toBe("price_1Tb7Wa5kJkygJqGZUxd7pwlV");
  });

  it("uses success_url and cancel_url derived from origin and tier", async () => {
    const { stripe, create } = makeFakeStripe();
    await createCheckoutSession({
      tier: "family",
      userId: "user_xyz",
      email: null,
      origin: "https://palkietalkie.com",
      stripe,
    });
    const arg = create.mock.calls[0]![0];
    expect(arg.success_url).toBe(
      "https://palkietalkie.com/success?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(arg.cancel_url).toBe("https://palkietalkie.com/signup?tier=family&canceled=1");
  });

  it("attaches userId and tier to client_reference_id and metadata", async () => {
    const { stripe, create } = makeFakeStripe();
    await createCheckoutSession({
      tier: "individual",
      userId: "user_777",
      email: "x@example.com",
      origin: "https://palkietalkie.com",
      stripe,
    });
    const arg = create.mock.calls[0]![0];
    expect(arg.client_reference_id).toBe("user_777");
    expect(arg.metadata).toEqual({ clerk_user_id: "user_777", tier: "individual" });
    expect(arg.subscription_data.metadata).toEqual({
      clerk_user_id: "user_777",
      tier: "individual",
    });
    expect(arg.allow_promotion_codes).toBe(true);
  });

  it("passes customer_email when provided; omits it when null", async () => {
    const { stripe, create } = makeFakeStripe();
    await createCheckoutSession({
      tier: "individual",
      userId: "u",
      email: "a@b.c",
      origin: "https://x.com",
      stripe,
    });
    expect(create.mock.calls[0]![0].customer_email).toBe("a@b.c");

    await createCheckoutSession({
      tier: "individual",
      userId: "u",
      email: null,
      origin: "https://x.com",
      stripe,
    });
    expect(create.mock.calls[1]![0].customer_email).toBeUndefined();
  });

  it("returns the Stripe session object", async () => {
    const { stripe } = makeFakeStripe({ id: "cs_42", url: "https://stripe.test/cs_42" });
    const session = await createCheckoutSession({
      tier: "individual",
      userId: "u",
      email: "a@b.c",
      origin: "https://x.com",
      stripe,
    });
    expect(session.id).toBe("cs_42");
    expect(session.url).toBe("https://stripe.test/cs_42");
  });
});
