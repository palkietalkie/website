import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAppLaunched } from "./is-app-launched";

describe("isAppLaunched", () => {
  const original = process.env.NEXT_PUBLIC_APP_LAUNCHED;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_APP_LAUNCHED;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_APP_LAUNCHED;
    else process.env.NEXT_PUBLIC_APP_LAUNCHED = original;
  });

  it("defaults to false when the env var is unset (waitlist mode)", () => {
    expect(isAppLaunched()).toBe(false);
  });

  it("returns true only for the exact string 'true'", () => {
    process.env.NEXT_PUBLIC_APP_LAUNCHED = "true";
    expect(isAppLaunched()).toBe(true);
  });

  it("treats any other truthy-looking string as not launched", () => {
    // Guards against the common bug where `1`, `yes`, `TRUE` get treated as enabled and ship a half-configured launch.
    for (const value of ["1", "yes", "TRUE", "True", "on", "false", ""]) {
      process.env.NEXT_PUBLIC_APP_LAUNCHED = value;
      expect(isAppLaunched()).toBe(false);
    }
  });
});
