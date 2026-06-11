import type { Tier } from "@/constants/tiers";

export function normalizeTier(raw: string | null | undefined): Tier | null {
  if (raw === "individual" || raw === "family") return raw;
  return null;
}
