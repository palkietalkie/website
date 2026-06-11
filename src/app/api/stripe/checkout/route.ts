import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { normalizeTier } from "@/lib/stripe/normalizeTier";

async function readTier(req: NextRequest): Promise<string | null> {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { tier?: string };
    return body.tier ?? null;
  }
  return new URL(req.url).searchParams.get("tier");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tier = normalizeTier(await readTier(req));
  if (!tier) {
    return NextResponse.json(
      { error: "Missing or invalid tier. Use 'individual' or 'family'." },
      { status: 400 },
    );
  }

  try {
    const email = await getCurrentUserEmail();
    const session = await createCheckoutSession({
      tier,
      userId,
      email,
      origin: req.nextUrl.origin,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 500 });
    }
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
