import {
  SUBSCRIPTIONS,
  type SubscriptionCycle,
  type SubscriptionTier,
} from "@/constants/iap-subscriptions";

// Format a tier+cycle price as a "$NN.NN" display string, sourced ONLY from the generated SUBSCRIPTIONS SSoT (backend/app/iap/subscriptions_list.py via iap-subscriptions.ts). Never hardcode a price elsewhere, or the display drifts from the actual Apple/Stripe charge.
export function formatUsdPrice(tier: SubscriptionTier, cycle: SubscriptionCycle): string {
  const sub = SUBSCRIPTIONS.find((s) => s.tier === tier && s.cycle === cycle);
  if (!sub) throw new Error(`No subscription price for ${tier} ${cycle}`);
  return `$${sub.targetUsdPrice}`;
}
