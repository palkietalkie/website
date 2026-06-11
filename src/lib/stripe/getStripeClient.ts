import Stripe from "stripe";
import { readEnv } from "@/lib/readEnv";

// Shared Stripe client construction — used by checkout AND the success-page verifier (and any future Stripe caller), so it lives on its own, not inside checkout.ts. A function, not a module-level const: a const would read the secret + open the client at import time (constructing even where it's not used, failing at import if the key is absent). This builds it on first use.

export function getStripeClient(): Stripe {
  return new Stripe(readEnv("STRIPE_SECRET_KEY"));
}
