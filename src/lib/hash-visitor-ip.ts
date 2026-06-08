import { createHash } from "node:crypto";
import { headers } from "next/headers";

// Lets the waitlist spot duplicates from one IP without persisting the raw address. Reads `x-forwarded-for` off Vercel's edge headers, not cryptographic-strength.
export async function hashVisitorIp(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return createHash("sha256").update(`palkietalkie-waitlist|${ip}`).digest("hex").slice(0, 32);
}
