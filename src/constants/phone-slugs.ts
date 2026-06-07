// Pure constants — importable from both Server and Client Components. Keep next/headers out of this file so it can ship in client bundles.
//
// Phone buckets — slug → label. ORDER matters: this is the order shown in the waitlist <select>.
// PURPOSE: granularity here is what lets us decide later whether to backport the iOS app to an older OS. Each iOS major version that's still common in the wild gets its own bucket; lumping them hides the data we'd actually use.
// Android is less granular today — we have no Android app, so a single per-version split is enough to count signups. If we ship Android later, split further then.
// Bump the "_or_older" tail when the oldest broken-out slug stops being common in real UA logs.
// iOS jumped from 18 (Sep 2024) to 26 (Sep 2025) when Apple switched to year-based versioning at WWDC 2025. iOS 19–25 never publicly shipped under those names. So the iOS list goes 26, 18, 17, ...
export const PHONE_SLUGS = [
  "iphone_ios_26",
  "iphone_ios_18",
  "iphone_ios_17",
  "iphone_ios_16_or_older",
  "ipad",
  "android_16",
  "android_15",
  "android_14",
  "android_13",
  "android_12_or_older",
  "other",
] as const;
export type PhoneSlug = (typeof PHONE_SLUGS)[number];
export const PHONE_SLUG_SET = new Set<string>(PHONE_SLUGS);
