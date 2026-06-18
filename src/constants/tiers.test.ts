import { describe, expect, it } from "vitest";
import { SUBSCRIPTIONS } from "./iap-subscriptions";
import { TIER_PRICE } from "./tiers";

describe("TIER_PRICE", () => {
  it("has individual and family entries with monthly + yearly amounts", () => {
    for (const tier of ["individual", "family"] as const) {
      const price = TIER_PRICE[tier];
      expect(price.monthly).toMatch(/\$/);
      expect(price.yearly).toMatch(/\$/);
    }
  });

  it("derives every price from the SUBSCRIPTIONS SSoT (no drift)", () => {
    for (const tier of ["individual", "family"] as const) {
      for (const cycle of ["monthly", "yearly"] as const) {
        const sub = SUBSCRIPTIONS.find((s) => s.tier === tier && s.cycle === cycle);
        expect(TIER_PRICE[tier][cycle]).toBe(`$${sub?.targetUsdPrice}`);
      }
    }
  });
});
