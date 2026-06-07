import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportPage from "@/app/support/page";
import { renderWithI18n } from "@/test/render-with-i18n";

describe("SupportPage", () => {
  it("renders the page heading", () => {
    renderWithI18n(<SupportPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
