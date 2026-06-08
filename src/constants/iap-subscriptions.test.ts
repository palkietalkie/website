import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SUBSCRIPTIONS, stripePriceFor } from "./iap-subscriptions";

describe("SUBSCRIPTIONS catalogue", () => {
  it("ships the four expected (tier x cycle) combinations", () => {
    // Backend's subscriptions_list.py is the source of truth; this asserts the codegen output preserves all four rows.
    expect(SUBSCRIPTIONS).toHaveLength(4);
    const combos = SUBSCRIPTIONS.map((s) => `${s.tier}:${s.cycle}`).sort();
    expect(combos).toEqual([
      "family:monthly",
      "family:yearly",
      "individual:monthly",
      "individual:yearly",
    ]);
  });

  it("uses com.palkietalkie.<tier>.<cycle> as the Apple product id", () => {
    // App Store Connect product ids are immutable once submitted; a drift here would break IAP entitlement.
    for (const sub of SUBSCRIPTIONS) {
      expect(sub.appleProductId).toBe(`com.palkietalkie.${sub.tier}.${sub.cycle}`);
    }
  });

  it("prices match the published Business Model tiers", () => {
    // Cross-checked against root CLAUDE.md "Palkie Talkie tiers" table.
    const byKey = Object.fromEntries(
      SUBSCRIPTIONS.map((s) => [`${s.tier}:${s.cycle}`, s.targetUsdPrice]),
    );
    expect(byKey["individual:monthly"]).toBe("17.99");
    expect(byKey["individual:yearly"]).toBe("83.99");
    expect(byKey["family:monthly"]).toBe("19.99");
    expect(byKey["family:yearly"]).toBe("112.99");
  });

  it("every row carries both sandbox and live Stripe price ids", () => {
    for (const sub of SUBSCRIPTIONS) {
      expect(sub.stripePriceSandbox).toMatch(/^price_/);
      expect(sub.stripePriceLive).toMatch(/^price_/);
      expect(sub.stripePriceSandbox).not.toBe(sub.stripePriceLive);
    }
  });
});

describe("stripePriceFor", () => {
  // `vi.stubEnv("X", undefined)` removes the env var; an empty string would survive `??` (only `undefined`/`null` falls through) and break the "APP_ENV unset → fall back to NODE_ENV" test. Direct `process.env.X = ...` would trip strict-mode TS errors (`NODE_ENV` is typed read-only in Next.js's process.env shim).
  beforeEach(() => {
    vi.stubEnv("APP_ENV", undefined);
    vi.stubEnv("NODE_ENV", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the sandbox price id when APP_ENV is unset (dev default)", () => {
    expect(stripePriceFor("individual", "monthly")).toBe("price_1Tb7Wa5kJkygJqGZq0o4ssGx");
  });

  it("returns the live price id when APP_ENV=production", () => {
    vi.stubEnv("APP_ENV", "production");
    expect(stripePriceFor("individual", "monthly")).toBe("price_1Tb7Wb8n3tBguXEAXS1NVSjH");
  });

  it("falls back to NODE_ENV when APP_ENV is unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(stripePriceFor("family", "yearly")).toBe("price_1TfBGw8n3tBguXEAITu8xy3X");
  });

  it("returns sandbox in non-production NODE_ENV", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(stripePriceFor("family", "monthly")).toBe("price_1Tb7Wa5kJkygJqGZUxd7pwlV");
  });

  it("throws for an unknown (tier, cycle) combination", () => {
    // Cast to bypass the TS literal-type narrowing so the runtime guard is actually exercised.
    expect(() => stripePriceFor("individual", "weekly" as unknown as "monthly")).toThrow(
      /Unknown subscription/,
    );
  });
});
