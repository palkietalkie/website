import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaqPage from "@/app/faq/page";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

describe("FaqPage", () => {
  it("renders the page H1 from messages", () => {
    renderWithI18n(<FaqPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: enMessages.faq.title }),
    ).toBeInTheDocument();
  });
  it("renders every FAQ question as a <summary>", () => {
    renderWithI18n(<FaqPage />);
    for (const item of enMessages.faq.items) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
    }
  });
  it("renders a download/waitlist CTA so an iPhone-only reader can act", () => {
    renderWithI18n(<FaqPage />);
    // AppStoreButton renders "Download on the App Store" or "Join the waitlist" depending on launch state. The page body adds one and the Footer has another, so assert at least one is present.
    expect(screen.getAllByRole("link", { name: /app store|waitlist/i }).length).toBeGreaterThan(0);
  });
});
