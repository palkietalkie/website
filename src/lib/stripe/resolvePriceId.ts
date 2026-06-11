import { type SubscriptionCycle, stripePriceFor } from "@/constants/iap-subscriptions";
import type { Tier } from "@/constants/tiers";

export function resolvePriceId(tier: Tier, cycle: SubscriptionCycle = "monthly"): string {
  return stripePriceFor(tier, cycle);
}
