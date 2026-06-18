import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportPage from "@/app/support/page";
import { renderWithI18n } from "@/test/render-with-i18n";

describe("SupportPage", () => {
  it("renders the page heading", () => {
    renderWithI18n(<SupportPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("answers account deletion without the false hard-delete-after-30-days claim", () => {
    const { container } = renderWithI18n(<SupportPage />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/delete my account/i);
    expect(text).not.toMatch(/hard-delete after 30 days/i);
  });
});
