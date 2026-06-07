import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, test, vi } from "vitest";
import enMessages from "../../../messages/en.json";

const authMock = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({ auth: () => authMock() }));
vi.mock("@clerk/nextjs", () => ({
  SignUp: () => <div data-testid="clerk-signup" />,
  UserButton: () => <div data-testid="clerk-userbutton" />,
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));

import SignupPage, { generateMetadata } from "./page";

const wrap = (ui: React.ReactNode) => (
  <NextIntlClientProvider locale="en" messages={enMessages}>
    {ui}
  </NextIntlClientProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignupPage", () => {
  test("generateMetadata returns titles", async () => {
    const md = await generateMetadata();
    expect(md.title).toBe("metaTitle");
  });

  test("renders Clerk SignUp when user is not signed in", async () => {
    authMock.mockResolvedValue({ userId: null });
    const ui = await SignupPage({ searchParams: Promise.resolve({}) });
    const { getByTestId } = render(wrap(ui));
    expect(getByTestId("clerk-signup")).toBeTruthy();
  });

  test("renders dashboard for signed-in users (UserButton present)", async () => {
    authMock.mockResolvedValue({ userId: "user_42" });
    const ui = await SignupPage({ searchParams: Promise.resolve({ tier: "family_monthly" }) });
    const { getByTestId } = render(wrap(ui));
    expect(getByTestId("clerk-userbutton")).toBeTruthy();
  });

  test("shows canceled banner when canceled=1 in search params", async () => {
    authMock.mockResolvedValue({ userId: "user_x" });
    const ui = await SignupPage({
      searchParams: Promise.resolve({ tier: "individual_yearly", canceled: "1" }),
    });
    expect(() => render(wrap(ui))).not.toThrow();
  });

  test("coerces unknown tier to a default", async () => {
    authMock.mockResolvedValue({ userId: "u" });
    const ui = await SignupPage({
      searchParams: Promise.resolve({ tier: "bogus_tier_value" }),
    });
    expect(() => render(wrap(ui))).not.toThrow();
  });
});
