import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Stripe from "stripe";
import { AppStoreButton } from "@/components/AppStoreButton";
import styles from "./success.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("success");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

type Search = Promise<{ session_id?: string }>;

type Verified = {
  ok: boolean;
  email?: string | null;
  tier?: string | null;
  reason?: string;
};

async function verifySession(sessionId: string | undefined): Promise<Verified> {
  if (!sessionId) return { ok: false, reason: "Missing session_id" };
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, reason: "Stripe not configured" };

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid =
      session.payment_status === "paid" || session.payment_status === "no_payment_required";
    return {
      ok: paid && session.status === "complete",
      email: session.customer_details?.email ?? session.customer_email ?? null,
      tier: (session.metadata?.tier as string | undefined) ?? null,
      reason: paid ? undefined : `payment_status=${session.payment_status}`,
    };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Unknown" };
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const verified = await verifySession(sp.session_id);
  return (
    <main className={styles.wrap}>
      <SuccessCard verified={verified} />
    </main>
  );
}

function SuccessCard({ verified }: { verified: Verified }) {
  const t = useTranslations("success");
  return (
    <div className={styles.card}>
      {verified.ok ? (
        <>
          <div className={styles.check} aria-hidden="true">
            ✓
          </div>
          <span className="eyebrow">{t("eyebrowOk")}</span>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>

          <div className={styles.ctaBlock}>
            <AppStoreButton size="lg" />
          </div>

          <div className={styles.instructions}>
            <strong>{t("instructions")}</strong>
            {verified.email && <span className={styles.email}>{verified.email}</span>}
            <span className={styles.note}>{t("note")}</span>
          </div>
        </>
      ) : (
        <>
          <span className="eyebrow">{t("eyebrowError")}</span>
          <h1 className={styles.title}>{t("errorTitle")}</h1>
          <p className={styles.lead}>{verified.reason ?? t("errorFallback")}</p>
          <div className={styles.ctaBlock}>
            <Link href="/signup" className={styles.linkBtn}>
              {t("backToSignup")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
