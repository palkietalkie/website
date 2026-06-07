import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppStoreButton } from "./AppStoreButton";
import styles from "./PricingCard.module.css";

type Props = {
  name: string;
  monthly: string;
  yearly: string;
  includes: string[];
  cta: string;
  href: string;
  featured?: boolean;
  /** Whether this is the Free tier. Skips the price line + yearly line and renders the AppStoreButton (which itself swaps to waitlist when the app isn't launched). */
  isFree?: boolean;
};

export function PricingCard({
  name,
  monthly,
  yearly,
  includes,
  cta,
  href,
  featured,
  isFree,
}: Props) {
  const t = useTranslations("pricing");
  return (
    <div className={`${styles.card} ${featured ? styles.featured : ""}`}>
      {featured && <span className={styles.badge}>{t("mostPopular")}</span>}
      <h3 className={styles.name}>{name}</h3>
      {isFree ? (
        <div className={styles.price}>
          <span className={styles.amount}>{t("tiers.free.name")}</span>
        </div>
      ) : (
        <>
          <div className={styles.price}>
            <span className={styles.amount}>{monthly}</span>
            <span className={styles.per}>{t("perMonth")}</span>
          </div>
          <div className={styles.yearly}>{t("orPerYear", { yearly })}</div>
        </>
      )}

      <ul className={styles.list}>
        {includes.map((item) => (
          <li key={item}>
            <Check className={styles.check} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className={styles.cta}>
        {isFree ? (
          <AppStoreButton />
        ) : (
          <Link
            href={href}
            className={`${styles.btn} ${featured ? styles.btnFeatured : ""} tap-target`}
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
