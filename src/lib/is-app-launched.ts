// Set NEXT_PUBLIC_APP_LAUNCHED=true once the iOS app is live on the App Store with a real bundle id. Default false (waitlist mode).
export function isAppLaunched(): boolean {
  return process.env.NEXT_PUBLIC_APP_LAUNCHED === "true";
}
