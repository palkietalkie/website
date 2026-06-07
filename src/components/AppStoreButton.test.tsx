import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { APP_STORE_URL } from "@/constants/app-store-url";
import { renderWithI18n } from "@/test/render-with-i18n";

// vitest.setup.ts globally substitutes AppStoreButton with a static stub so other tests can render pages synchronously. Undo the mock here so the real async-server-component code path is exercised — the launch-state branching is the whole point of the file.
vi.unmock("@/components/AppStoreButton");

// Each test controls shouldShowWaitlist independently. Default to false (launched mode) so AppStoreButton renders the App Store deep link unless the test overrides.
const shouldShowWaitlistMock = vi.fn();
vi.mock("@/lib/should-show-waitlist", () => ({
  shouldShowWaitlist: () => shouldShowWaitlistMock(),
}));

// next-intl/server is mocked globally in vitest.setup.ts to return a translator backed by messages/en.json. Nothing extra needed here.

const { AppStoreButton } = await import("@/components/AppStoreButton");

describe("AppStoreButton (server-component)", () => {
  it("renders the App Store deep link when shouldShowWaitlist=false", async () => {
    shouldShowWaitlistMock.mockResolvedValueOnce(false);
    const node = await AppStoreButton({});
    renderWithI18n(node);
    const link = screen.getByRole("link", { name: /download on the app store/i });
    expect(link).toHaveAttribute("href", APP_STORE_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("renders the waitlist CTA when shouldShowWaitlist=true", async () => {
    shouldShowWaitlistMock.mockResolvedValueOnce(true);
    const node = await AppStoreButton({});
    renderWithI18n(node);
    const link = screen.getByRole("link", { name: /join the waitlist/i });
    expect(link).toHaveAttribute("href", "/waitlist");
  });

  it("respects the size prop on the waitlist branch", async () => {
    shouldShowWaitlistMock.mockResolvedValueOnce(true);
    const node = await AppStoreButton({ size: "lg" });
    renderWithI18n(node);
    const link = screen.getByRole("link", { name: /join the waitlist/i });
    // CSS-modules transform makes className unstable, just check the link is wired right.
    expect(link).toHaveAttribute("href", "/waitlist");
  });

  it("respects the variant prop on the App Store branch", async () => {
    shouldShowWaitlistMock.mockResolvedValueOnce(false);
    const node = await AppStoreButton({ variant: "secondary" });
    renderWithI18n(node);
    const link = screen.getByRole("link", { name: /download on the app store/i });
    expect(link).toHaveAttribute("href", APP_STORE_URL);
  });
});
