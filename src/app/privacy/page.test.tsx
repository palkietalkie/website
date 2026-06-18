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

  it("describes deletion honestly: no false hard-delete / 30-day-grace claim", () => {
    const { container } = renderWithI18n(<PrivacyPage />);
    const text = container.textContent ?? "";
    // Soft-delete reality: account deletion exists, but we don't claim a hard purge / Pinecone+Neo4j cascade we don't perform.
    expect(text).toMatch(/Delete my account/i);
    expect(text).not.toMatch(/hard-delete/i);
    expect(text).not.toMatch(/30-day grace/i);
  });
});
