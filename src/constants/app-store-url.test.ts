import { describe, expect, it } from "vitest";
import { APP_STORE_URL } from "./app-store-url";

describe("APP_STORE_URL", () => {
  it("points at the apps.apple.com host", () => {
    // Hard-coded host check guards against accidental swap to a tracking-redirect domain that would break the iOS deep-link.
    expect(APP_STORE_URL.startsWith("https://apps.apple.com/")).toBe(true);
  });

  it("references the palkie-talkie app slug", () => {
    expect(APP_STORE_URL).toContain("/app/palkie-talkie/");
  });

  it("carries an id<digits> path segment", () => {
    // Match Apple's id<digits> path even while the bundle id is still the id000000000 placeholder. Locks the shape so a malformed URL never ships.
    expect(APP_STORE_URL).toMatch(/\/id\d+$/);
  });
});
