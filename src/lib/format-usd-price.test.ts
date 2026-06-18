import { describe, expect, it } from "vitest";
import { SUBSCRIPTIONS } from "@/constants/iap-subscriptions";
import { formatUsdPrice } from "./format-usd-price";

describe("formatUsdPrice", () => {
  it("formats every subscription price from the SSoT as $NN.NN", () => {
    for (const s of SUBSCRIPTIONS) {
      expect(formatUsdPrice(s.tier, s.cycle)).toBe(`$${s.targetUsdPrice}`);
    }
  });

  it("throws on an unknown tier/cycle so a typo can't silently render an empty price", () => {
    // @ts-expect-error intentionally invalid input to exercise the guard
    expect(() => formatUsdPrice("enterprise", "monthly")).toThrow();
  });
});
