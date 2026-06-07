import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingCard } from "@/components/PricingCard";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

const baseProps = {
  name: "Individual",
  monthly: "$12.99",
  yearly: "$89",
  includes: ["One user", "Unlimited talk time"],
  cta: "Subscribe on web",
  href: "/signup?tier=individual",
};

describe("PricingCard", () => {
  it("renders the tier name as a heading", () => {
    renderWithI18n(<PricingCard {...baseProps} />);
    expect(screen.getByRole("heading", { level: 3, name: "Individual" })).toBeInTheDocument();
  });

  it("shows monthly price and yearly price", () => {
    renderWithI18n(<PricingCard {...baseProps} />);
    expect(screen.getByText("$12.99")).toBeInTheDocument();
    expect(screen.getByText(/or \$89 \/ year/)).toBeInTheDocument();
  });

  it("renders each included feature", () => {
    renderWithI18n(<PricingCard {...baseProps} />);
    expect(screen.getByText("One user")).toBeInTheDocument();
    expect(screen.getByText("Unlimited talk time")).toBeInTheDocument();
  });

  it("uses a Link CTA when not the Free tier", () => {
    renderWithI18n(<PricingCard {...baseProps} />);
    const link = screen.getByRole("link", { name: /Subscribe on web/i });
    expect(link).toHaveAttribute("href", "/signup?tier=individual");
  });

  it("replaces the price with 'Free' label when isFree is true", () => {
    renderWithI18n(
      <PricingCard
        {...baseProps}
        name="Free"
        includes={["10 min/day, reset at local midnight", "30 min/week, reset Monday"]}
        isFree
      />,
    );
    // "Free" appears both as the H3 tier name and as the amount slot. Both should be present.
    expect(screen.getAllByText(enMessages.pricing.tiers.free.name).length).toBeGreaterThanOrEqual(
      2,
    );
    // No "or $0 / year" filler.
    expect(screen.queryByText(/\$0 \/ year/)).not.toBeInTheDocument();
  });

  it("renders the 'Most popular' badge when featured", () => {
    renderWithI18n(<PricingCard {...baseProps} featured />);
    expect(screen.getByText(enMessages.pricing.mostPopular)).toBeInTheDocument();
  });

  it("omits the badge when not featured", () => {
    renderWithI18n(<PricingCard {...baseProps} />);
    expect(screen.queryByText(enMessages.pricing.mostPopular)).not.toBeInTheDocument();
  });
});
