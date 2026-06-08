import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingPage from "@/app/pricing/page";
import { TIER_KEYS } from "@/constants/tiers";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

// PricingPage is async (awaits shouldShowWaitlist + getTranslations). Resolve the JSX before passing to render(). See page.test.tsx for the same pattern.
async function renderPricing() {
  const resolved = await PricingPage();
  return renderWithI18n(resolved);
}

describe("PricingPage", () => {
  it("renders the page H1", async () => {
    await renderPricing();
    expect(
      screen.getByRole("heading", { level: 1, name: enMessages.pricing.pageTitle }),
    ).toBeInTheDocument();
  });

  it("renders every tier from TIER_KEYS", async () => {
    await renderPricing();
    for (const key of TIER_KEYS) {
      const tierName = enMessages.pricing.tiers[key].name;
      expect(screen.getByRole("heading", { level: 3, name: tierName })).toBeInTheDocument();
    }
  });

  it("contains an App Store CTA and a Subscribe-on-web CTA", async () => {
    await renderPricing();
    expect(screen.getAllByRole("link", { name: /app store/i }).length).toBeGreaterThan(0);
    const webBtns = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href")?.startsWith("/signup"));
    expect(webBtns.length).toBeGreaterThan(0);
  });

  it("renders header navigation to home and pricing", async () => {
    await renderPricing();
    const brandLinks = screen.getAllByRole("link").filter((el) => el.getAttribute("href") === "/");
    expect(brandLinks.length).toBeGreaterThan(0);

    // Header has its own <nav>; footer also has one. Grab the first.
    const [headerNav] = screen.getAllByRole("navigation");
    expect(within(headerNav).getByRole("link", { name: enMessages.nav.pricing })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });
});
