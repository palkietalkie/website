import { describe, expect, it } from "vitest";
import { SUPPORT_EMAIL } from "./support-email";

describe("SUPPORT_EMAIL", () => {
  it("uses the palkietalkie.com domain", () => {
    // Anything other than @palkietalkie.com would mis-route real support requests; assert the domain explicitly so a typo can't ship.
    expect(SUPPORT_EMAIL.endsWith("@palkietalkie.com")).toBe(true);
  });

  it("is a syntactically valid <local>@<domain> address", () => {
    expect(SUPPORT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("matches the iCloud Custom Email Domain cap (hello@) advertised in CLAUDE.md", () => {
    // CLAUDE.md lists hello@/wes@/admin@ as the three iCloud aliases; the public-facing one is hello@.
    expect(SUPPORT_EMAIL).toBe("hello@palkietalkie.com");
  });
});
