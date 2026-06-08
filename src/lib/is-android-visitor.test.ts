import { describe, expect, it, vi } from "vitest";

let mockUserAgent = "";
vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name.toLowerCase() === "user-agent" ? mockUserAgent : null),
  }),
}));

const { isAndroidVisitor } = await import("./is-android-visitor");

const UA_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15";
const UA_ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome";
const UA_DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

describe("isAndroidVisitor", () => {
  it("detects Android UA", async () => {
    mockUserAgent = UA_ANDROID;
    expect(await isAndroidVisitor()).toBe(true);
  });

  it("does not treat iPhone as Android", async () => {
    mockUserAgent = UA_IPHONE;
    expect(await isAndroidVisitor()).toBe(false);
  });

  it("does not treat desktop as Android", async () => {
    mockUserAgent = UA_DESKTOP;
    expect(await isAndroidVisitor()).toBe(false);
  });
});
