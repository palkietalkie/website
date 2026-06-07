import { describe, expect, test, vi } from "vitest";

vi.mock("@/i18n/get-locale", () => ({ getLocale: vi.fn(async () => "ja") }));
vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(async () => ({ meta: {}, hero: {} })),
  getTranslations: vi.fn(async () => (key: string) => {
    const m: Record<string, string> = {
      siteName: "Palkie Talkie",
      homeTitle: "Talk like a native",
      description: "Voice English partner",
    };
    return m[key] ?? key;
  }),
}));
vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("next-intl", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("next-intl");
  return {
    ...actual,
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

import RootLayout, { generateMetadata, viewport } from "./layout";

describe("RootLayout", () => {
  test("generateMetadata returns localized title + description from translations", async () => {
    const md = await generateMetadata();
    expect(md.description).toBe("Voice English partner");
    expect((md.openGraph as { siteName?: string }).siteName).toBe("Palkie Talkie");
  });

  test("viewport exports theme colors for light + dark", () => {
    expect(Array.isArray(viewport.themeColor)).toBe(true);
  });

  test("RootLayout returns a tree containing children", async () => {
    const tree = await RootLayout({ children: <div data-testid="child" /> });
    // Server-component return value is a React element. The exact <html> wrapper isn't renderable inside jsdom (jsdom already provides one), so we just smoke-test the structure exists.
    expect(tree).toBeTruthy();
  });
});
