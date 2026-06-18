#!/usr/bin/env node
// Pricing drift guard. The ONLY source of truth for prices is SUBSCRIPTIONS in
// src/constants/iap-subscriptions.ts (generated from backend/app/iap/subscriptions_list.py).
// tiers.ts already derives from it; but prose prices live in translated copy (messages/*.json)
// and legal text (terms), which can't derive. This fails the commit if any "$NN(.NN)" amount in
// messages/ or src/ isn't one of the canonical IAP prices (plus $0 for the free tier) — so a stale
// price like $12.99 can never ship again.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const iap = readFileSync(new URL("../../src/constants/iap-subscriptions.ts", import.meta.url), "utf8");
// $0 = free tier; $100 = the legal liability cap in terms (a statutory figure, not a subscription price).
const allowed = new Set(["0", "100"]);
for (const m of iap.matchAll(/targetUsdPrice:\s*"([0-9.]+)"/g)) allowed.add(m[1]);

const grep = execSync("git grep -nIE '[$][0-9]+([.][0-9]{2})?' -- messages src || true", {
  encoding: "utf8",
});

const bad = [];
for (const line of grep.split("\n").filter(Boolean)) {
  // The generated SSoT itself stores prices without a $, so it never matches; skip defensively anyway.
  if (line.startsWith("src/constants/iap-subscriptions.ts")) continue;
  for (const m of line.matchAll(/[$]([0-9]+(?:[.][0-9]{2})?)/g)) {
    if (!allowed.has(m[1])) {
      const where = line.split(":").slice(0, 2).join(":");
      bad.push(`  ${where}  ->  $${m[1]}`);
    }
  }
}

if (bad.length) {
  const ok = [...allowed].map((a) => `$${a}`).join(", ");
  console.error(`[check-pricing] DRIFT: these $-amounts aren't canonical (allowed: ${ok}).`);
  console.error("Source of truth: src/constants/iap-subscriptions.ts (regen from backend).");
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log("[check-pricing] OK");
