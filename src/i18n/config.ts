// Source of truth for which locales the site speaks.
// Add a new language: drop messages/<code>.json in place, add the code below, add a label in LANGUAGE_NAMES.

// Locale codes use the same shape Accept-Language sends: language-REGION where region matters (zh-CN vs zh-TW, pt-BR vs pt-PT). Where region collapsing is safe, we ship one bundle (es covers LatAm + Spain; fr covers FR + CA).
export const LOCALES = [
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
  "ko",
  "es",
  "pt-BR",
  "fr",
  "de",
  "vi",
  "id",
  "hi",
] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Native-script label so a non-English visitor can recognize their language without needing to read English.
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ko: "한국어",
  es: "Español",
  "pt-BR": "Português",
  fr: "Français",
  de: "Deutsch",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  hi: "हिन्दी",
};

// Primary-tag fallbacks for region tags we don't carry separately. Example: a "pt-PT" visitor maps to "pt-BR" rather than English. Order in the value list doesn't matter — first match wins per visitor.
const PRIMARY_TAG_FALLBACK: Record<string, Locale> = {
  zh: "zh-CN", // bare "zh" → Mainland Simplified
  pt: "pt-BR",
};

export const COOKIE_NAME = "PT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value as Locale);
}

/**
 * Pick the best supported locale from a raw Accept-Language header.
 * Tries full tag first (so "zh-CN" matches our zh-CN bundle, not zh-TW), then primary-tag fallback. Final fallback is DEFAULT_LOCALE.
 */
export function pickAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  // q-weighted entries: "ja,en-US;q=0.9,en;q=0.8" → ["ja", "en-us", "en"]
  const candidates = header
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .map((tag) => tag.toLowerCase());
  for (const raw of candidates) {
    // Normalize "zh-cn" → "zh-CN" so it matches a region-bearing LOCALES entry.
    const parts = raw.split("-");
    const normalized = parts.length === 2 ? `${parts[0]}-${parts[1].toUpperCase()}` : raw;
    if (isLocale(normalized)) return normalized;
    const primary = parts[0];
    if (isLocale(primary)) return primary;
    const fallback = PRIMARY_TAG_FALLBACK[primary];
    if (fallback) return fallback;
  }
  return DEFAULT_LOCALE;
}
