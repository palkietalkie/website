import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";
import { renderWithI18n } from "@/test/render-with-i18n";

describe("PrivacyPage", () => {
  it("renders the page H1 and key section headings", () => {
    renderWithI18n(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /who we are/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /what we collect/i })).toBeInTheDocument();
  });
});
