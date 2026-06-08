import { isAndroidVisitor } from "./is-android-visitor";
import { isAppLaunched } from "./is-app-launched";

// Whether the App Store button should fall back to the waitlist CTA. True if the app isn't launched yet, OR if the visitor is on Android (no Android app yet even post-launch).
export async function shouldShowWaitlist(): Promise<boolean> {
  if (!isAppLaunched()) return true;
  return await isAndroidVisitor();
}
