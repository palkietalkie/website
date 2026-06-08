import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Placeholder } from "@/components/Placeholder";
import { TIER_PRICE } from "@/constants/tiers";
import { fetchPlanLimits } from "@/lib/fetch-plan-limits";
import { shouldShowWaitlist } from "@/lib/should-show-waitlist";
import styles from "./page.module.css";

type ProblemItem = { title: string; body: string };
type FeatureItem = { title: string; body: string; visual?: { label: string; spec: string } };
type AbsenceItem = { title: string; body: string };
type FaqItem = { q: string; a: string };

export default async function Home() {
  const t = await getTranslations();
  const waitlist = await shouldShowWaitlist();
  const planLimits = await fetchPlanLimits();
  const problems = t.raw("problems.items") as ProblemItem[];
  const features = t.raw("features.items") as FeatureItem[];
  const absences = t.raw("absence.items") as AbsenceItem[];
  const faqs = t.raw("faq.items") as FaqItem[];
  const homeFaqs = faqs.slice(0, 4);

  return (
    <>
      <Hero waitlist={waitlist} planLimits={planLimits} />

      <section className={`section ${styles.problems}`} id="problem">
        <div className="container">
          <span className="eyebrow">{t("problems.eyebrow")}</span>
          <h2 className="section-title">{t("problems.title")}</h2>
          <p className="section-lead">{t("problems.lead")}</p>

          <div className={styles.problemGrid}>
            {problems.map((p) => (
              <div key={p.title} className={styles.problemCard}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.demo}`} id="hear-it">
        <div className="container">
          <span className="eyebrow">{t("demo.eyebrow")}</span>
          <h2 className="section-title">{t("demo.title")}</h2>
          <p className="section-lead">{t("demo.lead")}</p>
          <Placeholder
            shape="audio"
            label={t("hero.audioSample.label")}
            spec={t("hero.audioSample.spec")}
          />
        </div>
      </section>

      <section className={`section ${styles.features}`} id="how-it-works">
        <div className="container">
          <span className="eyebrow">{t("features.eyebrow")}</span>
          <h2 className="section-title">{t("features.title")}</h2>
          <p className="section-lead">{t("features.lead")}</p>

          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                n={i + 1}
                title={f.title}
                body={f.body}
                visual={f.visual}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.absence}`} id="what-it-isnt">
        <div className="container">
          <span className="eyebrow">{t("absence.eyebrow")}</span>
          <h2 className="section-title">{t("absence.title")}</h2>
          <p className="section-lead">{t("absence.lead")}</p>

          <div className={styles.absenceGrid}>
            {absences.map((a) => (
              <div key={a.title} className={styles.absenceCard}>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.video}`} id="see-it">
        <div className="container">
          <span className="eyebrow">{t("video.eyebrow")}</span>
          <h2 className="section-title">{t("video.title")}</h2>
          <Placeholder
            shape="portrait"
            label={t("video.videoPlaceholder.label")}
            spec={t("video.videoPlaceholder.spec")}
          />
        </div>
      </section>

      <section className={`section ${styles.trust}`} id="why-us">
        <div className="container">
          <span className="eyebrow">{t("trust.eyebrow")}</span>
          <h2 className="section-title">{t("trust.title")}</h2>
          <p className="section-lead">{t("trust.body")}</p>
        </div>
      </section>

      <section className={`section ${styles.pricing}`} id="pricing-teaser">
        <div className="container">
          <span className="eyebrow">{t("pricing.eyebrow")}</span>
          <h2 className="section-title">{t("pricing.teaserTitle")}</h2>

          <div className={styles.priceRow}>
            <PriceTeaser
              name={t("pricing.tiers.free.name")}
              amount={t("pricing.tiers.free.name")}
              sub={t("pricing.teaserFree", {
                day: planLimits.freeMinutesPerDay,
                week: planLimits.freeMinutesPerWeek,
              })}
            />
            <PriceTeaser
              name={t("pricing.tiers.individual.name")}
              amount={TIER_PRICE.individual.monthly}
              sub={t("pricing.teaserPaidLine", {
                monthly: TIER_PRICE.individual.monthly,
                yearly: TIER_PRICE.individual.yearly,
              })}
              featured
            />
            <PriceTeaser
              name={t("pricing.tiers.family.name")}
              amount={TIER_PRICE.family.monthly}
              sub={t("pricing.teaserFamilyLine", {
                monthly: TIER_PRICE.family.monthly,
                yearly: TIER_PRICE.family.yearly,
                seats: 6,
              })}
            />
          </div>

          <div className={styles.pricingCta}>
            <Link href="/pricing" className={`${styles.linkArrow} tap-target`}>
              {t("pricing.compareCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className={`section ${styles.faq}`} id="faq">
        <div className="container">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h2 className="section-title">{t("faq.title")}</h2>

          <div className={styles.faqList}>
            {homeFaqs.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className={styles.pricingCta}>
            <Link href="/faq" className={`${styles.linkArrow} tap-target`}>
              {t("faq.viewAllCta")}
            </Link>
          </div>
        </div>
      </section>

      <Footer planLimits={planLimits} />
    </>
  );
}

function PriceTeaser({
  name,
  amount,
  sub,
  featured,
}: {
  name: string;
  amount: string;
  sub: string;
  featured?: boolean;
}) {
  return (
    <div className={`${styles.priceTeaser} ${featured ? styles.priceFeatured : ""}`}>
      <div className={styles.priceName}>{name}</div>
      <div className={styles.priceAmount}>{amount}</div>
      <div className={styles.priceSub}>{sub}</div>
    </div>
  );
}
