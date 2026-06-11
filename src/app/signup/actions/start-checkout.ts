"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { LOCAL_DEV_ORIGIN } from "@/constants/local-dev-origin";
import { Tier } from "@/constants/tiers";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";

async function resolveOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : LOCAL_DEV_ORIGIN;
}

export async function startCheckout(tier: Tier): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in?redirect_url=/signup");

  const email = await getCurrentUserEmail();
  const origin = await resolveOrigin();

  const session = await createCheckoutSession({
    tier,
    userId,
    email,
    origin,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}
