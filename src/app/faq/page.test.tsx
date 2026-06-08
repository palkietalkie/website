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
});
