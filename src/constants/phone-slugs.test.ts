import { describe, expect, it } from "vitest";
import { PHONE_SLUG_SET, PHONE_SLUGS } from "./phone-slugs";

describe("PHONE_SLUGS / PHONE_SLUG_SET", () => {
  it("PHONE_SLUG_SET matches PHONE_SLUGS length and membership", () => {
    expect(PHONE_SLUG_SET.size).toBe(PHONE_SLUGS.length);
    for (const slug of PHONE_SLUGS) {
      expect(PHONE_SLUG_SET.has(slug)).toBe(true);
    }
  });
  it("contains the post-rename iOS 26 bucket and not 19-25", () => {
    expect(PHONE_SLUGS).toContain("iphone_ios_26");
    expect(PHONE_SLUGS).not.toContain("iphone_ios_19");
    expect(PHONE_SLUGS).not.toContain("iphone_ios_22");
    expect(PHONE_SLUGS).not.toContain("iphone_ios_25");
  });
});
