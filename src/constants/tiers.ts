import { formatUsdPrice } from "@/lib/format-usd-price";
import { APP_STORE_URL } from "./app-store-url";

// Paid tier identifier. Used by Stripe checkout; the Free tier is excluded because it has no Stripe price.
export type Tier = "individual" | "family";

// All tier keys including Free. Maps to messages/<locale>.json `pricing.tiers.<key>`. Order is the order they render on /pricing.
export const TIER_KEYS = ["free", "individual", "family"] as const;
export type TierKey = (typeof TIER_KEYS)[number];

// Per-tier non-translatable metadata: amounts, checkout hrefs, and which one renders the "Most popular" badge.
export const TIER_META: Record<
  TierKey,
  { monthly: string; yearly: string; href: string; featured: boolean }
> = {
  free: { monthly: "$0", yearly: "$0", href: APP_STORE_URL, featured: false },
  individual: {
    monthly: formatUsdPrice("individual", "monthly"),
    yearly: formatUsdPrice("individual", "yearly"),
    href: "/signup?tier=individual",
    featured: true,
  },
  family: {
    monthly: formatUsdPrice("family", "monthly"),
    yearly: formatUsdPrice("family", "yearly"),
    href: "/signup?tier=family",
    featured: false,
  },
};

// Raw paid-tier amounts. Distinct from TIER_META because Stripe checkout only sees paid tiers — the Tier-typed map enforces "no Free" at the type level. Derived from the same SUBSCRIPTIONS SSoT.
export const TIER_PRICE: Record<Tier, { monthly: string; yearly: string }> = {
  individual: {
    monthly: formatUsdPrice("individual", "monthly"),
    yearly: formatUsdPrice("individual", "yearly"),
  },
  family: {
    monthly: formatUsdPrice("family", "monthly"),
    yearly: formatUsdPrice("family", "yearly"),
  },
};
