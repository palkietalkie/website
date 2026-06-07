import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE } from "./config";
import { getLocale } from "./get-locale";

// Deep-merge JSON objects. Used to overlay a locale bundle on top of the EN fallback so missing keys quietly degrade to EN instead of crashing the render.
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const [k, v] of Object.entries(source)) {
    const tv = out[k];
    if (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof tv === "object" &&
      tv !== null &&
      !Array.isArray(tv)
    ) {
      out[k] = deepMerge(tv as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export default getRequestConfig(async () => {
  const locale = await getLocale();
  const enMessages = (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default as Record<
    string,
    unknown
  >;
  if (locale === DEFAULT_LOCALE) {
    return { locale, messages: enMessages };
  }
  const localeMessages = (await import(`../../messages/${locale}.json`)).default as Record<
    string,
    unknown
  >;
  return {
    locale,
    messages: deepMerge(enMessages, localeMessages),
  };
});
