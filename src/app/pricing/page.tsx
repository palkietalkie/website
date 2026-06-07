import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AppStoreButton } from "@/components/AppStoreButton";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PricingCard } from "@/components/PricingCard";
import { TIER_KEYS, TIER_META, TierKey } from "@/constants/tiers";
import { fetchPlanLimits } from "@/lib/fetch-plan-limits";
import { shouldShowWaitlist } from "@/lib/should-show-waitlist";
import styles from "./pricing.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return {
    title: t("eyebrow"),
    description: t("pageLead"),
  };
}

export default async function PricingPage() {
  const t = await getTranslations();
  // Same logic as Hero: pre-launch / non-iOS visitors can't subscribe; hide the dead-end Subscribe nav link in waitlist mode.
  const waitlist = await shouldShowWaitlist();
  const planLimits = await fetchPlanLimits();
  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
              Palkie&nbsp;Talkie
            </Link>
            <div className={styles.navLinks}>
              <Link href="/pricing" className="tap-target">
                {t("nav.pricing")}
              </Link>
              {!waitlist && (
                <Link href="/signup" className={`${styles.navCta} tap-target`}>
                  {t("nav.subscribe")}
                </Link>
              )}
              <LanguageSwitcher />
            </div>
          </nav>

          <div className={styles.intro}>
            <span className="eyebrow">{t("pricing.eyebrow")}</span>
            <h1>{t("pricing.pageTitle")}</h1>
            <p className={styles.lead}>
              {t("pricing.pageLead", {
                day: planLimits.freeMinutesPerDay,
                week: planLimits.freeMinutesPerWeek,
              })}
            </p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.tiers}`}>
        <div className="container">
          <div className={styles.tierGrid}>
            {TIER_KEYS.map((key: TierKey) => {
              const meta = TIER_META[key];
              return (
                <PricingCard
                  key={key}
                  name={t(`pricing.tiers.${key}.name`)}
                  monthly={meta.monthly}
                  yearly={meta.yearly}
                  includes={(t.raw(`pricing.tiers.${key}.includes`) as string[]).map((line) =>
                    line
                      .replace(/\{day\}/g, String(planLimits.freeMinutesPerDay))
                      .replace(/\{week\}/g, String(planLimits.freeMinutesPerWeek)),
                  )}
                  cta={t(`pricing.tiers.${key}.cta`)}
                  href={meta.href}
                  featured={meta.featured}
                  isFree={key === "free"}
                />
              );
            })}
          </div>

          <div className={styles.dualCta}>
            <AppStoreButton size="lg" />
            {!waitlist && (
              <Link href="/signup" className={styles.webBtn}>
                {t("pricing.tiers.individual.cta")}
              </Link>
            )}
          </div>
          {!waitlist && <p className={styles.dualCtaNote}>{t("pricing.dualCtaNote")}</p>}
        </div>
      </section>

      <Footer planLimits={planLimits} />
    </>
  );
}
