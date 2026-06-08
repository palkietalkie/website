"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, LOCALES } from "@/i18n/config";
import { PHONE_SLUG_SET } from "@/constants/phone-slugs";
import { hashVisitorIp } from "@/lib/hash-visitor-ip";
import { getSql } from "@/lib/neon/get-sql";
import { postMessage } from "@/lib/slack/post-message";

export type WaitlistResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANG_VALUES = new Set<string>([...LOCALES, "other"]);

function trim(value: FormDataEntryValue | null, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  if (!s) return undefined;
  if (s.length > max) return s.slice(0, max);
  return s;
}

export async function submitWaitlist(formData: FormData): Promise<WaitlistResult> {
  const email = trim(formData.get("email"), 320);
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const name = trim(formData.get("name"), 120);
  if (!name) {
    return { ok: false, error: "Please enter your first name." };
  }
  // Install device — the thing they'll run the app on. Slug on mobile (the <select>), free text on desktop. UX label says "Phone" since iPhone is the primary case, but iPads count too, so the column is `install_device`, not `phone`.
  const installDevice = trim(formData.get("phone"), 120);
  if (!installDevice) {
    return { ok: false, error: "Please tell us what device you'll install on." };
  }
  const installDeviceIsSlug = PHONE_SLUG_SET.has(installDevice);
  const nativeLanguages = formData
    .getAll("nativeLanguages")
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v): v is string => v.length > 0 && LANG_VALUES.has(v));
  if (nativeLanguages.length === 0) {
    return { ok: false, error: "Please pick at least one native language." };
  }
  const targetLanguage = trim(formData.get("targetLanguage"), 40);
  if (!targetLanguage || !LANG_VALUES.has(targetLanguage)) {
    return { ok: false, error: "Please pick the language you want to learn." };
  }
  const biggestPain = trim(formData.get("biggestPain"), 2000);
  const userAgent = trim(formData.get("ua"), 500);
  const localeCookie = (await cookies()).get(COOKIE_NAME)?.value;

  if (!process.env.NEON_DATABASE_URL) {
    // Local dev without Neon wired — log and call it a soft success.
    console.warn("[waitlist] NEON_DATABASE_URL not set — logging only.");
    console.log(
      "[waitlist:fallback]",
      JSON.stringify({
        email,
        name,
        installDevice,
        installDeviceIsSlug,
        nativeLanguages,
        targetLanguage,
      }),
    );
    return { ok: true };
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO waitlist
        (email, first_name, install_device, install_device_is_slug,
         native_languages, target_language,
         biggest_pain, user_agent, ip_hash, locale)
      VALUES
        (${email}, ${name}, ${installDevice}, ${installDeviceIsSlug},
         ${nativeLanguages}, ${targetLanguage},
         ${biggestPain ?? null}, ${userAgent ?? null}, ${await hashVisitorIp()}, ${localeCookie ?? null})
      ON CONFLICT (LOWER(email)) DO UPDATE
         SET first_name             = EXCLUDED.first_name,
             install_device         = EXCLUDED.install_device,
             install_device_is_slug = EXCLUDED.install_device_is_slug,
             native_languages       = EXCLUDED.native_languages,
             target_language        = EXCLUDED.target_language,
             biggest_pain           = COALESCE(EXCLUDED.biggest_pain, waitlist.biggest_pain),
             user_agent             = COALESCE(EXCLUDED.user_agent, waitlist.user_agent),
             locale                 = COALESCE(EXCLUDED.locale, waitlist.locale),
             created_at             = NOW()
    `;
  } catch (e) {
    console.error("[waitlist:signup] insert failed", e);
    return { ok: false, error: "Something went wrong. Please try again in a minute." };
  }

  const slackText =
    `:mailbox_with_mail: *Waitlist signup* — ${name} <${email}>\n` +
    `• Device: \`${installDevice}\` (${installDeviceIsSlug ? "detected" : "typed"})\n` +
    `• Native: \`${nativeLanguages.join(", ")}\` → Target: \`${targetLanguage}\`\n` +
    `• Pain: ${biggestPain ?? "—"}`;
  await postMessage(process.env.SLACK_CHANNEL_GTM ?? "", slackText);

  return { ok: true };
}
