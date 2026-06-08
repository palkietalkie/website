import { describe, expect, it } from "vitest";
import { TIER_PRICE } from "./tiers";

describe("TIER_PRICE", () => {
  it("has individual and family entries with monthly + yearly amounts", () => {
    for (const tier of ["individual", "family"] as const) {
      const price = TIER_PRICE[tier];
      expect(price.monthly).toMatch(/\$/);
      expect(price.yearly).toMatch(/\$/);
    }
  });
});
