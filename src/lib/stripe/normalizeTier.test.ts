import { describe, expect, it } from "vitest";
import { normalizeTier } from "@/lib/stripe/normalizeTier";

describe("normalizeTier", () => {
  it("returns the tier verbatim when valid", () => {
    expect(normalizeTier("individual")).toBe("individual");
    expect(normalizeTier("family")).toBe("family");
  });

  it("returns null for unknown / empty input", () => {
    expect(normalizeTier(null)).toBeNull();
    expect(normalizeTier(undefined)).toBeNull();
    expect(normalizeTier("")).toBeNull();
    expect(normalizeTier("enterprise")).toBeNull();
  });
});
