import { describe, expect, it } from "vitest";
import { coerceTier } from "./coerce-tier";

describe("coerceTier", () => {
  it("returns 'family' when input is 'family'", () => {
    expect(coerceTier("family")).toBe("family");
  });

  it("defaults to 'individual' for any other input", () => {
    expect(coerceTier("individual")).toBe("individual");
    expect(coerceTier(undefined)).toBe("individual");
    expect(coerceTier("")).toBe("individual");
    expect(coerceTier("enterprise")).toBe("individual");
  });
});
