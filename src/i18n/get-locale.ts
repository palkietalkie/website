import { cookies, headers } from "next/headers";
import { COOKIE_NAME, isLocale, pickAcceptLanguage, type Locale } from "./config";

/**
 * Server-side: figure out which locale to render this request in.
 *
 * Priority:
 *  1. Cookie (visitor previously picked a language → respect it)
 *  2. Accept-Language header (visitor's OS / browser locale on first visit)
 *  3. DEFAULT_LOCALE
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return pickAcceptLanguage(headerStore.get("accept-language"));
}
