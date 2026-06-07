import { headers } from "next/headers";
import type { PhoneSlug } from "@/constants/phone-slugs";

/** UA → one of PHONE_SLUGS, or "" if no match. The slug is what we autofill the <select> with. */
export async function visitorPhoneSlug(): Promise<PhoneSlug | ""> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  if (/iPad/i.test(ua)) return "ipad";
  if (/iPhone|iPod/i.test(ua)) {
    const m = ua.match(/iPhone OS (\d+)_/);
    const major = m ? Number(m[1]) : 0;
    // iOS 19–25 don't exist (Apple renamed to year-based at WWDC 2025 — Sept 2025 release shipped as "iOS 26"). Anything in that range maps to iOS 26 since it's a UA bug or test-only oddity rather than a real device.
    if (major >= 19) return "iphone_ios_26";
    if (major === 18) return "iphone_ios_18";
    if (major === 17) return "iphone_ios_17";
    return "iphone_ios_16_or_older";
  }
  if (/Android/i.test(ua)) {
    const m = ua.match(/Android (\d+)/);
    const major = m ? Number(m[1]) : 0;
    if (major >= 16) return "android_16";
    if (major === 15) return "android_15";
    if (major === 14) return "android_14";
    if (major === 13) return "android_13";
    return "android_12_or_older";
  }
  return "";
}
