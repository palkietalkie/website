import { describe, expect, it, vi } from "vitest";

// vitest.setup.ts globally mocks @/lib/should-show-waitlist (so page tests don't have to await async server components). Undo that mock here so we can exercise the real implementation.
vi.unmock("@/lib/should-show-waitlist");

let mockUserAgent = "";
vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name.toLowerCase() === "user-agent" ? mockUserAgent : null),
  }),
}));

const { shouldShowWaitlist } = await import("./should-show-waitlist");

const UA_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15";
const UA_ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome";

describe("shouldShowWaitlist", () => {
  it("shows waitlist when NEXT_PUBLIC_APP_LAUNCHED is unset (default false)", async () => {
    delete process.env.NEXT_PUBLIC_APP_LAUNCHED;
    mockUserAgent = UA_IPHONE;
    expect(await shouldShowWaitlist()).toBe(true);
  });

  it("still shows waitlist to Android visitors after launch", async () => {
    process.env.NEXT_PUBLIC_APP_LAUNCHED = "true";
    mockUserAgent = UA_ANDROID;
    expect(await shouldShowWaitlist()).toBe(true);
  });

  it("hides waitlist for iPhone visitors after launch", async () => {
    process.env.NEXT_PUBLIC_APP_LAUNCHED = "true";
    mockUserAgent = UA_IPHONE;
    expect(await shouldShowWaitlist()).toBe(false);
  });
});
