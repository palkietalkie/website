"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { COOKIE_NAME, LANGUAGE_NAMES, LOCALES, type Locale } from "@/i18n/config";
import styles from "./LanguageSwitcher.module.css";

// Cookie is read by getLocale() on the server. 1 year is long enough that returning visitors don't get reset, short enough to honor a future locale removal. Lives outside the component so React 19's lint rule for in-render mutation doesn't trip on `document.cookie =`.
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
function persistLocaleCookie(value: Locale): void {
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

/**
 * Compact language switcher: globe icon button that opens a popover panel listing all supported languages in their native script. Picking one writes the cookie + triggers a server re-render so messages reload in the new locale.
 *
 * Why not a native <select>: 12 language names in native scripts (English, 日本語, 简体中文, …) make the closed-state width ~120px on mobile, which dominates the header. The icon-button trigger collapses to ~44px (Apple HIG tap target).
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("nav");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function pick(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    persistLocaleCookie(next);
    startTransition(() => router.refresh());
  }

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        title={t("language")}
        disabled={isPending}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe className={styles.icon} aria-hidden="true" />
      </button>
      {open && (
        <>
          {/* Transparent overlay catches taps outside the panel and closes it. Works on iOS Safari where document-level mousedown wouldn't fire on inert body areas. */}
          <button
            type="button"
            aria-label="Close"
            className={styles.overlay}
            onClick={() => setOpen(false)}
          />
          <div className={styles.panel} role="listbox">
            {LOCALES.map((code) => {
              const selected = code === locale;
              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`${styles.row} ${selected ? styles.rowOn : ""}`}
                  onClick={() => pick(code)}
                >
                  {LANGUAGE_NAMES[code]}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
