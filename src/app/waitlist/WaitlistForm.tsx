"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useTransition } from "react";
import { LANGUAGE_NAMES, LOCALES, type Locale } from "@/i18n/config";
import { PHONE_SLUGS, PhoneSlug } from "@/constants/phone-slugs";
import { submitWaitlist, type WaitlistResult } from "./actions/submit-waitlist";
import styles from "./waitlist.module.css";

type Props = {
  /** UA-derived autofill for the phone <select>. One of PHONE_SLUGS, or "" if no UA match. */
  phoneAutofill: PhoneSlug | "";
  /** Default native-language selection — set to the page's current display locale, so a visitor reading the page in JA gets `ja` pre-selected. They can override. */
  nativeDefault: Locale;
};

export function WaitlistForm({ phoneAutofill, nativeDefault }: Props) {
  const t = useTranslations("waitlist");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<WaitlistResult | null>(null);
  // Native languages — tap-to-toggle chip selection. The page's display locale is pre-selected; user can tap to add more or remove the default. Serialized into hidden inputs at submit time so it rides the standard FormData path (no JS in the server action's contract).
  const [natives, setNatives] = useState<Set<string>>(() => new Set([nativeDefault]));
  const nativeOptions = useMemo(() => [...LOCALES, "other" as const], []);
  function toggleNative(code: string) {
    setNatives((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function onSubmit(formData: FormData) {
    if (typeof window !== "undefined") {
      formData.set("ua", window.navigator.userAgent);
    }
    startTransition(async () => {
      const r = await submitWaitlist(formData);
      setResult(r);
    });
  }

  if (result?.ok) {
    return (
      <div className={styles.thanks}>
        <h2 className={styles.thanksTitle}>{t("thanksTitle")}</h2>
        <p className={styles.thanksLead}>{t("thanksLead")}</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className={styles.form}>
      <label className={styles.field}>
        <span>{t("fields.email")}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("fields.emailPlaceholder")}
        />
      </label>

      <label className={styles.field}>
        <span>{t("fields.name")}</span>
        <input
          name="name"
          type="text"
          autoComplete="given-name"
          required
          placeholder={t("fields.namePlaceholder")}
        />
      </label>

      <label className={styles.field}>
        <span>{t("fields.phone")}</span>
        {phoneAutofill ? (
          // Mobile visitor: UA gives us a slug, so render the constrained <select> pre-selected to their detected OS bucket.
          <select name="phone" defaultValue={phoneAutofill} required>
            {PHONE_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {t(`fields.phones.${slug}`)}
              </option>
            ))}
          </select>
        ) : (
          // Desktop visitor: UA tells us nothing useful, so let them type the phone they'll install on.
          <input
            name="phone"
            type="text"
            required
            placeholder={t("fields.phoneDesktopPlaceholder")}
          />
        )}
      </label>

      <MultiSelectField
        label={t("fields.nativeLanguage")}
        placeholder={t("fields.nativeLanguageChoose")}
        name="nativeLanguages"
        selected={natives}
        onToggle={toggleNative}
        options={nativeOptions.map((code) => ({
          value: code,
          label: code === "other" ? t("fields.nativeLanguageOther") : LANGUAGE_NAMES[code],
        }))}
      />

      <label className={styles.field}>
        <span>{t("fields.targetLanguage")}</span>
        <select name="targetLanguage" defaultValue="" required>
          <option value="" disabled>
            {t("fields.targetLanguageChoose")}
          </option>
          {LOCALES.map((code: Locale) => (
            <option key={code} value={code}>
              {LANGUAGE_NAMES[code]}
            </option>
          ))}
          <option value="other">{t("fields.targetLanguageOther")}</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>{t("fields.biggestPain")}</span>
        <textarea name="biggestPain" rows={3} placeholder={t("fields.biggestPainPlaceholder")} />
      </label>

      {result && !result.ok && <p className={styles.error}>{result.error}</p>}

      <button type="submit" className={`${styles.submit} tap-target`} disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

// Custom multi-select. Looks like the other <select>s when closed; opens to a panel of tappable rows. Selected rows show a fill state. Click outside or press Escape to close. Serializes selected values into hidden inputs so it rides the standard FormData path.
function MultiSelectField({
  label,
  placeholder,
  name,
  selected,
  onToggle,
  options,
}: {
  label: string;
  placeholder: string;
  name: string;
  selected: Set<string>;
  onToggle: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const selectedLabels = options.filter((o) => selected.has(o.value)).map((o) => o.label);
  const summary = selectedLabels.length === 0 ? placeholder : selectedLabels.join(", ");

  return (
    <div className={styles.field}>
      <span>{label}</span>
      <button
        type="button"
        className={`${styles.multiTrigger} ${selected.size === 0 ? styles.multiPlaceholder : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.multiSummary}>{summary}</span>
      </button>
      {open && (
        <>
          {/* Full-screen transparent overlay catches every tap outside the panel and closes it. Works on iOS Safari (which won't fire mousedown on inert body areas) because the overlay is itself an interactive element. */}
          <button
            type="button"
            aria-label="Close"
            className={styles.multiOverlay}
            onClick={() => setOpen(false)}
          />
          <div className={styles.multiPanel} role="listbox" aria-multiselectable="true">
            {options.map((o) => {
              const isOn = selected.has(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={isOn}
                  className={`${styles.multiRow} ${isOn ? styles.multiRowOn : ""}`}
                  onClick={() => onToggle(o.value)}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </>
      )}
      {Array.from(selected).map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
    </div>
  );
}
