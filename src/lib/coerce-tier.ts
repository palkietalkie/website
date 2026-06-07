import type { Tier } from "@/constants/tiers";

// Normalize an unknown query-string value (e.g. `?tier=individual` or `?tier=garbage`) to a known Tier. Defaults to "individual" so a malformed link still renders a sensible signup page.
export function coerceTier(raw: string | undefined): Tier {
  return raw === "family" ? "family" : "individual";
}
