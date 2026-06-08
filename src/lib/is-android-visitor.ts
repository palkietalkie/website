import { headers } from "next/headers";

export async function isAndroidVisitor(): Promise<boolean> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return /android/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua);
}
