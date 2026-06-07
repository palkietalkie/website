import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import enMessages from "../../messages/en.json";
import { DEFAULT_LOCALE } from "@/i18n/config";

/**
 * Wraps `render()` with `NextIntlClientProvider` + EN messages so components that call `useTranslations()` work in tests.
 * Tests assert against EN strings — that's the canonical source of truth.
 */
export function renderWithI18n(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={enMessages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}

export { enMessages };
