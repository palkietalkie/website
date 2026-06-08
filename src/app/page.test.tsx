import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

// Home is an async server component (awaits shouldShowWaitlist + getTranslations). Per the Next.js testing guide, await the component function to resolve to JSX before passing to render(). This keeps the rest of the test sync. Helper avoids repeating the await pattern in every it() block.
async function renderHome() {
  const resolved = await Home();
  return renderWithI18n(resolved);
}

describe("Home (landing page)", () => {
  it("renders the hero tagline as the page H1", async () => {
    await renderHome();
    expect(
      screen.getByRole("heading", { level: 1, name: enMessages.meta.tagline }),
    ).toBeInTheDocument();
  });

  it("exposes at least one App Store CTA", async () => {
    await renderHome();
    const ctas = screen.getAllByRole("link", { name: /app store/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it("renders each feature title in the Features section", async () => {
    await renderHome();
    for (const f of enMessages.features.items) {
      expect(screen.getByRole("heading", { level: 3, name: f.title })).toBeInTheDocument();
    }
  });

  it("renders each problem card title", async () => {
    await renderHome();
    for (const p of enMessages.problems.items) {
      expect(screen.getByRole("heading", { level: 3, name: p.title })).toBeInTheDocument();
    }
  });

  it("renders pricing teaser tier names", async () => {
    await renderHome();
    // Free name appears in both the priceName slot and the priceAmount slot (since the Free tier reuses the name as the headline amount), hence getAllByText.
    expect(screen.getAllByText(enMessages.pricing.tiers.free.name).length).toBeGreaterThanOrEqual(
      2,
    );
    expect(screen.getByText(enMessages.pricing.tiers.individual.name)).toBeInTheDocument();
    expect(screen.getByText(enMessages.pricing.tiers.family.name)).toBeInTheDocument();
  });

  it("links to the full pricing page", async () => {
    await renderHome();
    const pricingLinks = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href") === "/pricing");
    expect(pricingLinks.length).toBeGreaterThan(0);
  });
});
