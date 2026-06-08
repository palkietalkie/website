import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => {
    const map: Record<string, string> = {
      metaTitle: "Join the waitlist",
      metaDescription: "be first",
      title: "Get early access",
      lead: "Practice English by voice.",
    };
    return (key: string) => map[key] ?? key;
  }),
}));
vi.mock("@/i18n/get-locale", () => ({ getLocale: vi.fn(async () => "ja") }));
vi.mock("@/lib/visitor-phone-slug", () => ({
  visitorPhoneSlug: vi.fn(async () => "iphone-16"),
}));

import WaitlistPage, { generateMetadata } from "./page";

const messages = { waitlist: { form: {} } } as Record<string, unknown>;

describe("WaitlistPage", () => {
  test("generateMetadata uses translations", async () => {
    const md = await generateMetadata();
    expect(md.title).toBe("Join the waitlist");
    expect(md.description).toBe("be first");
  });

  test("renders title and lead text", async () => {
    const ui = await WaitlistPage();
    const { getByText } = render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        {ui}
      </NextIntlClientProvider>,
    );
    expect(getByText("Get early access")).toBeTruthy();
    expect(getByText("Practice English by voice.")).toBeTruthy();
  });
});
