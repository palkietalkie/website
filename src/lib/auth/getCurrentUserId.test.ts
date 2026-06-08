import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const currentUserMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
  currentUser: () => currentUserMock(),
}));

// Import AFTER vi.mock so the helper picks up the mocked module.
const { getCurrentUserId, getCurrentUserEmail } = await import("@/lib/auth/getCurrentUserId");

describe("getCurrentUserId", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("returns the Clerk userId when signed in", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });
    await expect(getCurrentUserId()).resolves.toBe("user_123");
  });

  it("returns null when Clerk reports no user", async () => {
    authMock.mockResolvedValue({ userId: null });
    await expect(getCurrentUserId()).resolves.toBeNull();
  });

  it("returns null when userId is missing from response", async () => {
    authMock.mockResolvedValue({});
    await expect(getCurrentUserId()).resolves.toBeNull();
  });
});

describe("getCurrentUserEmail", () => {
  beforeEach(() => {
    currentUserMock.mockReset();
  });

  it("returns the primary email when present", async () => {
    currentUserMock.mockResolvedValue({
      emailAddresses: [{ emailAddress: "wes@palkietalkie.com" }],
    });
    await expect(getCurrentUserEmail()).resolves.toBe("wes@palkietalkie.com");
  });

  it("returns null when user has no addresses", async () => {
    currentUserMock.mockResolvedValue({ emailAddresses: [] });
    await expect(getCurrentUserEmail()).resolves.toBeNull();
  });

  it("returns null when user is null", async () => {
    currentUserMock.mockResolvedValue(null);
    await expect(getCurrentUserEmail()).resolves.toBeNull();
  });
});
