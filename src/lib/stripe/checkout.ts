import Stripe from "stripe";
import { type SubscriptionCycle, stripePriceFor } from "@/constants/iap-subscriptions";
import type { Tier } from "@/constants/tiers";

// Pure helpers — no Next.js request/response, no Clerk. Easy to unit test.

export type CreateCheckoutSessionArgs = {
  tier: Tier;
  cycle?: SubscriptionCycle;
  userId: string;
  email?: string | null;
  origin: string;
  stripe?: Stripe;
};

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function priceIdFor(tier: Tier, cycle: SubscriptionCycle = "monthly"): string {
  return stripePriceFor(tier, cycle);
}

export function normalizeTier(raw: string | null | undefined): Tier | null {
  if (raw === "individual" || raw === "family") return raw;
  return null;
}

export function buildStripeClient(): Stripe {
  return new Stripe(readEnv("STRIPE_SECRET_KEY"));
}

export async function createCheckoutSession(
  args: CreateCheckoutSessionArgs,
): Promise<Stripe.Checkout.Session> {
  const { tier, cycle = "monthly", userId, email, origin } = args;
  const priceId = priceIdFor(tier, cycle);
  const stripe = args.stripe ?? buildStripeClient();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email ?? undefined,
    client_reference_id: userId,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/signup?tier=${tier}&canceled=1`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { clerk_user_id: userId, tier },
    },
    metadata: { clerk_user_id: userId, tier },
  });
}
