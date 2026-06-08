import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

describe("Hero", () => {
  it("renders the brand name", () => {
    renderWithI18n(<Hero />);
    expect(screen.getByText(/Palkie\s?Talkie/)).toBeInTheDocument();
  });

  it("renders the tagline as the H1", () => {
    renderWithI18n(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: enMessages.meta.tagline }),
    ).toBeInTheDocument();
  });

  it("renders the subtagline", () => {
    renderWithI18n(<Hero />);
    expect(screen.getByText(enMessages.meta.description)).toBeInTheDocument();
  });

  it("includes the App Store CTA", () => {
    renderWithI18n(<Hero />);
    expect(screen.getByRole("link", { name: /app store/i })).toBeInTheDocument();
  });

  it("renders the navigation Pricing and Subscribe links", () => {
    renderWithI18n(<Hero />);
    expect(screen.getByRole("link", { name: enMessages.nav.pricing })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("link", { name: enMessages.nav.subscribe })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("renders the free-tier smallprint", () => {
    renderWithI18n(<Hero />);
    // Hero's default planLimits prop is {day: 10, week: 30}; substitute into the catalog template the same way next-intl does at render time.
    const expected = enMessages.hero.smallprint.replace("{day}", "10").replace("{week}", "30");
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
