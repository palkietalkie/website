import { describe, expect, it, vi } from "vitest";

let mockUserAgent = "";
vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name.toLowerCase() === "user-agent" ? mockUserAgent : null),
  }),
}));

const { visitorPhoneSlug } = await import("./visitor-phone-slug");

const UA_DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

describe("visitorPhoneSlug", () => {
  it("returns iphone_ios_18 for the default test iOS 18 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15";
    expect(await visitorPhoneSlug()).toBe("iphone_ios_18");
  });

  it("returns iphone_ios_26 for iOS 26 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15";
    expect(await visitorPhoneSlug()).toBe("iphone_ios_26");
  });

  it("returns iphone_ios_26 for iOS 19-25 UA (renamed but real visitor)", async () => {
    // iOS 19-25 never publicly shipped (renamed to iOS 26). Any UA in that range is either a bug or test fixture; map to the closest real version (iOS 26).
    mockUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 22_0 like Mac OS X) AppleWebKit/605.1.15";
    expect(await visitorPhoneSlug()).toBe("iphone_ios_26");
  });

  it("returns iphone_ios_16_or_older for iOS 15 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15";
    expect(await visitorPhoneSlug()).toBe("iphone_ios_16_or_older");
  });

  it("returns android_14 for Android 14 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome";
    expect(await visitorPhoneSlug()).toBe("android_14");
  });

  it("returns android_16 for Android 16 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36";
    expect(await visitorPhoneSlug()).toBe("android_16");
  });

  it("returns android_12_or_older for Android 11 UA", async () => {
    mockUserAgent = "Mozilla/5.0 (Linux; Android 11; SM-G781U) AppleWebKit/537.36";
    expect(await visitorPhoneSlug()).toBe("android_12_or_older");
  });

  it("returns empty slug for desktop UA", async () => {
    mockUserAgent = UA_DESKTOP;
    expect(await visitorPhoneSlug()).toBe("");
  });
});
