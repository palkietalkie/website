import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/Footer";
import { SUPPORT_EMAIL } from "@/constants/support-email";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

describe("Footer", () => {
  it("renders the closing CTA headline", () => {
    renderWithI18n(<Footer />);
    expect(
      screen.getByRole("heading", { level: 2, name: enMessages.footer.ctaTitle }),
    ).toBeInTheDocument();
  });

  it("contains an App Store CTA", () => {
    renderWithI18n(<Footer />);
    expect(screen.getByRole("link", { name: /app store/i })).toBeInTheDocument();
  });

  it("renders nav links to Home, Pricing, FAQ, Contact", () => {
    renderWithI18n(<Footer />);
    expect(screen.getByRole("link", { name: enMessages.footer.home })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: enMessages.nav.pricing })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("link", { name: enMessages.footer.faq })).toHaveAttribute(
      "href",
      "/faq",
    );
    expect(
      screen.getByRole("link", { name: enMessages.footer.contact }).getAttribute("href"),
    ).toMatch(new RegExp(`^mailto:${SUPPORT_EMAIL}(\\?subject=.*)?$`));
  });

  it("renders a copyright line containing the current year", () => {
    renderWithI18n(<Footer />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`© ${year} Palkie Talkie`))).toBeInTheDocument();
  });
});
