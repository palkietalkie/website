import { screen } from "@testing-library/react";
import { useTranslations } from "next-intl";
import { describe, expect, it } from "vitest";
import { enMessages, renderWithI18n } from "@/test/render-with-i18n";

// Tiny client component that pulls from next-intl. If the i18n provider is wired correctly, the EN string for `nav.pricing` from messages/en.json shows up; otherwise next-intl throws the missing-provider error.
function NavLabel() {
  const t = useTranslations("nav");
  return <span data-testid="label">{t("pricing")}</span>;
}

describe("renderWithI18n", () => {
  it("makes useTranslations resolve against messages/en.json", () => {
    renderWithI18n(<NavLabel />);
    expect(screen.getByTestId("label")).toHaveTextContent(enMessages.nav.pricing);
  });

  it("re-exports enMessages so tests can assert against the canonical EN strings", () => {
    // The re-export is the contract — components vary in how they consume translations, but every test pins assertions against this same source bundle.
    expect(enMessages).toBeDefined();
    expect(typeof enMessages).toBe("object");
    expect(enMessages.nav).toBeDefined();
  });

  it("returns the same shape as @testing-library/react's render", () => {
    const result = renderWithI18n(<NavLabel />);
    // Sanity check on common helpers — locks the API surface so a refactor doesn't accidentally drop them.
    expect(typeof result.rerender).toBe("function");
    expect(typeof result.unmount).toBe("function");
    expect(result.container).toBeInstanceOf(HTMLElement);
  });
});
