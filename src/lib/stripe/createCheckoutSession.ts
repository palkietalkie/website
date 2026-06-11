import Stripe from "stripe";
import type { SubscriptionCycle } from "@/constants/iap-subscriptions";
import type { Tier } from "@/constants/tiers";
import { getStripeClient } from "@/lib/stripe/getStripeClient";
import { resolvePriceId } from "@/lib/stripe/resolvePriceId";

export type CreateCheckoutSessionArgs = {
  tier: Tier;
  cycle?: SubscriptionCycle;
  userId: string;
  email?: string | null;
  origin: string;
  stripe?: Stripe;
};

export async function createCheckoutSession(
  args: CreateCheckoutSessionArgs,
): Promise<Stripe.Checkout.Session> {
  const { tier, cycle = "monthly", userId, email, origin } = args;
  const priceId = resolvePriceId(tier, cycle);
  const stripe = args.stripe ?? getStripeClient();

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
