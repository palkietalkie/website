import { describe, expect, it } from "vitest";
import { LOCAL_DEV_ORIGIN } from "./local-dev-origin";

describe("LOCAL_DEV_ORIGIN", () => {
  it("is an http URL (no https) since local dev does not terminate TLS", () => {
    expect(LOCAL_DEV_ORIGIN.startsWith("http://")).toBe(true);
    expect(LOCAL_DEV_ORIGIN.startsWith("https://")).toBe(false);
  });

  it("points at localhost on port 3030 to match package.json dev/start scripts", () => {
    // Drift here would silently make resolveOrigin() generate wrong absolute URLs (and break Stripe checkout return URLs in local dev).
    expect(LOCAL_DEV_ORIGIN).toBe("http://localhost:3030");
  });

  it("has no trailing slash so callers can append `/path` cleanly", () => {
    expect(LOCAL_DEV_ORIGIN.endsWith("/")).toBe(false);
  });
});
