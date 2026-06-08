import { beforeEach, describe, expect, test, vi } from "vitest";
import { COOKIE_NAME, DEFAULT_LOCALE } from "./config";
import { getLocale } from "./get-locale";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
}));

const { cookies, headers } = await import("next/headers");
const mockCookies = cookies as ReturnType<typeof vi.fn>;
const mockHeaders = headers as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getLocale", () => {
  test("returns cookie value when it's a supported locale", async () => {
    mockCookies.mockResolvedValue({ get: () => ({ value: "ja" }) });
    mockHeaders.mockResolvedValue({ get: () => null });
    expect(await getLocale()).toBe("ja");
  });

  test("ignores cookie when value is not a supported locale, falls through to header", async () => {
    mockCookies.mockResolvedValue({ get: () => ({ value: "xx-unsupported" }) });
    mockHeaders.mockResolvedValue({ get: () => "fr-FR,fr;q=0.9" });
    expect(await getLocale()).toBe("fr");
  });

  test("uses Accept-Language when cookie is absent", async () => {
    mockCookies.mockResolvedValue({ get: () => undefined });
    mockHeaders.mockResolvedValue({ get: () => "ko,en;q=0.8" });
    expect(await getLocale()).toBe("ko");
  });

  test(`falls back to DEFAULT_LOCALE when nothing matches`, async () => {
    mockCookies.mockResolvedValue({ get: () => undefined });
    mockHeaders.mockResolvedValue({ get: () => null });
    expect(await getLocale()).toBe(DEFAULT_LOCALE);
  });

  test("uses COOKIE_NAME exactly", async () => {
    const get = vi.fn(() => ({ value: "es" }));
    mockCookies.mockResolvedValue({ get });
    mockHeaders.mockResolvedValue({ get: () => null });
    await getLocale();
    expect(get).toHaveBeenCalledWith(COOKIE_NAME);
  });
});
