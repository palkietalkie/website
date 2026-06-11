import { describe, expect, it } from "vitest";
import { resolvePriceId } from "@/lib/stripe/resolvePriceId";

describe("resolvePriceId", () => {
  // Codegen-backed: prices come from backend/app/iap/products_list.py via constants/iap-subscriptions.ts. Tests pin against the literal ids so a drift in regen breaks here.
  it("returns the sandbox individual monthly price id by default (dev env)", () => {
    expect(resolvePriceId("individual")).toBe("price_1Tb7Wa5kJkygJqGZq0o4ssGx");
  });

  it("supports yearly cycle", () => {
    expect(resolvePriceId("individual", "yearly")).toBe("price_1TfBGv5kJkygJqGZhvE2hah8");
  });

  it("routes family tier to the family price id", () => {
    expect(resolvePriceId("family")).toBe("price_1Tb7Wa5kJkygJqGZUxd7pwlV");
  });
});
