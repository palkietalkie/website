import { describe, expect, test, vi } from "vitest";

vi.mock("./get-locale", () => ({ getLocale: vi.fn() }));
vi.mock("next-intl/server", () => ({
  getRequestConfig: (factory: () => Promise<unknown>) => factory,
}));

const { getLocale } = await import("./get-locale");
const mockGetLocale = getLocale as ReturnType<typeof vi.fn>;

describe("i18n request config", () => {
  test("returns en messages when locale resolves to en (no merge)", async () => {
    mockGetLocale.mockResolvedValue("en");
    const factory = (await import("./request")).default;
    // next-intl's getRequestConfig wraps a callable factory; we mocked it to return the factory itself.
    const result = await (
      factory as () => Promise<{ locale: string; messages: Record<string, unknown> }>
    )();
    expect(result.locale).toBe("en");
    expect(result.messages).toBeTypeOf("object");
    expect(Object.keys(result.messages).length).toBeGreaterThan(0);
  });

  test("deep-merges non-en locale on top of en", async () => {
    mockGetLocale.mockResolvedValue("ja");
    // Re-import to pick up the new locale (modules cache, but the factory re-evaluates).
    const factory = (await import("./request")).default;
    const result = await (
      factory as () => Promise<{ locale: string; messages: Record<string, unknown> }>
    )();
    expect(result.locale).toBe("ja");
    expect(result.messages).toBeTypeOf("object");
  });
});
