import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TermsPage from "@/app/terms/page";
import { renderWithI18n } from "@/test/render-with-i18n";

// Page is an async Server Component that awaits `fetchPlanLimits`. Stub the fetcher so the test resolves synchronously without hitting the network.
vi.mock("@/lib/fetch-plan-limits", () => ({
  fetchPlanLimits: () => Promise.resolve({ freeMinutesPerDay: 10, freeMinutesPerWeek: 30 }),
}));

describe("TermsPage", () => {
  it("renders the page H1 and numbered section headings", async () => {
    renderWithI18n(await TermsPage());
    expect(
      screen.getByRole("heading", { level: 1, name: /terms of service/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /1\. acceptance/i })).toBeInTheDocument();
  });
});
