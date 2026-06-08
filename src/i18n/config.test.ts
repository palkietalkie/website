import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, LOCALES, pickAcceptLanguage } from "./config";

describe("isLocale", () => {
  it("returns true for every shipped locale", () => {
    for (const code of LOCALES) {
      expect(isLocale(code)).toBe(true);
    }
  });
  it("returns false for unknown / empty / null", () => {
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("pickAcceptLanguage", () => {
  it("returns DEFAULT_LOCALE for missing / empty header", () => {
    expect(pickAcceptLanguage(null)).toBe(DEFAULT_LOCALE);
    expect(pickAcceptLanguage(undefined)).toBe(DEFAULT_LOCALE);
    expect(pickAcceptLanguage("")).toBe(DEFAULT_LOCALE);
  });
  it("returns DEFAULT_LOCALE when no candidate is supported", () => {
    expect(pickAcceptLanguage("xx-YY,bogus")).toBe(DEFAULT_LOCALE);
  });
  it("matches the full tag first (zh-cn → zh-CN)", () => {
    expect(pickAcceptLanguage("zh-CN,en;q=0.9")).toBe("zh-CN");
    expect(pickAcceptLanguage("zh-cn")).toBe("zh-CN");
  });
  it("falls back to primary-tag fallback (bare 'zh' → zh-CN, 'pt' → pt-BR)", () => {
    expect(pickAcceptLanguage("zh")).toBe("zh-CN");
    expect(pickAcceptLanguage("pt;q=0.8")).toBe("pt-BR");
  });
  it("uses primary tag when supported as-is (en-US → en)", () => {
    expect(pickAcceptLanguage("en-US")).toBe("en");
  });
  it("honors q-weighted order", () => {
    // First candidate wins regardless of q-value (we pick left-to-right since browsers already pre-sort).
    expect(pickAcceptLanguage("ja,en;q=0.9")).toBe("ja");
  });
});
