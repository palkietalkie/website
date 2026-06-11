import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { getStripeClient } from "@/lib/stripe/getStripeClient";

describe("getStripeClient", () => {
  const original = process.env.STRIPE_SECRET_KEY;

  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterAll(() => {
    if (original === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = original;
  });

  it("throws when STRIPE_SECRET_KEY is missing", () => {
    expect(() => getStripeClient()).toThrow(/Missing STRIPE_SECRET_KEY/);
  });

  it("returns a Stripe client instance when key is set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    const client = getStripeClient();
    expect(client).toBeDefined();
    expect(typeof (client as unknown as { checkout: unknown }).checkout).toBe("object");
  });
});
