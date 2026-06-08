import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const stripeRetrieveMock = vi.fn();
vi.mock("stripe", () => ({
  default: class FakeStripe {
    checkout = { sessions: { retrieve: (...args: unknown[]) => stripeRetrieveMock(...args) } };
  },
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));

import SuccessPage, { generateMetadata } from "./page";

const wrap = (ui: React.ReactNode) => (
  <NextIntlClientProvider locale="en" messages={{ success: {} }}>
    {ui}
  </NextIntlClientProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
});
afterEach(() => {
  delete process.env.STRIPE_SECRET_KEY;
});

describe("SuccessPage verifySession branches", () => {
  test("renders without crashing when session_id is missing", async () => {
    const ui = await SuccessPage({ searchParams: Promise.resolve({}) });
    expect(() => render(wrap(ui))).not.toThrow();
  });

  test("renders without crashing when STRIPE_SECRET_KEY is unset", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const ui = await SuccessPage({ searchParams: Promise.resolve({ session_id: "cs_1" }) });
    expect(() => render(wrap(ui))).not.toThrow();
  });

  test("renders happy path when Stripe says complete + paid", async () => {
    stripeRetrieveMock.mockResolvedValue({
      payment_status: "paid",
      status: "complete",
      customer_details: { email: "wes@example.com" },
      metadata: { tier: "individual_monthly" },
    });
    const ui = await SuccessPage({ searchParams: Promise.resolve({ session_id: "cs_1" }) });
    expect(() => render(wrap(ui))).not.toThrow();
  });

  test("renders error path when Stripe throws", async () => {
    stripeRetrieveMock.mockRejectedValue(new Error("network"));
    const ui = await SuccessPage({ searchParams: Promise.resolve({ session_id: "cs_x" }) });
    expect(() => render(wrap(ui))).not.toThrow();
  });

  test("renders unpaid branch when payment_status is not paid", async () => {
    stripeRetrieveMock.mockResolvedValue({
      payment_status: "unpaid",
      status: "open",
      customer_email: "x@y.z",
      metadata: {},
    });
    const ui = await SuccessPage({ searchParams: Promise.resolve({ session_id: "cs_2" }) });
    expect(() => render(wrap(ui))).not.toThrow();
  });
});

describe("SuccessPage metadata", () => {
  test("generateMetadata returns title and description", async () => {
    const md = await generateMetadata();
    expect(md.title).toBe("metaTitle");
    expect(md.description).toBe("metaDescription");
  });
});
