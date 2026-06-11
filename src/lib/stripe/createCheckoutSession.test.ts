import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";

type FakeSession = { id: string; url: string };

function makeFakeStripe(session: FakeSession = { id: "cs_1", url: "https://stripe.test/cs_1" }) {
  const create = vi.fn().mockResolvedValue(session);
  return {
    stripe: { checkout: { sessions: { create } } } as never,
    create,
  };
}

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
