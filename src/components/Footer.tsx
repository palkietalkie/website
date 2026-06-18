import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppStoreButton } from "./AppStoreButton";
import { MailLink } from "./MailLink";
import styles from "./Footer.module.css";

type Props = {
  /** Suppress the closing CTA block (headline + AppStoreButton). Use on pages where the page body IS the conversion action (e.g. /waitlist — its form is the CTA; rendering another waitlist button below it loops back to the same page). */
  hideClosingCta?: boolean;
  /** Free-plan caps from the backend; defaults match production so untouched tests still pass. */
  planLimits?: { freeMinutesPerDay: number; freeMinutesPerWeek: number };
};

export function Footer({
  hideClosingCta,
  planLimits = { freeMinutesPerDay: 10, freeMinutesPerWeek: 30 },
}: Props = {}) {
  const t = useTranslations();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {!hideClosingCta && (
          <div className={styles.cta}>
            <div>
              <h2 className={styles.ctaTitle}>{t("footer.ctaTitle")}</h2>
              <p className={styles.ctaLead}>
                {t("footer.ctaLead", {
                  day: planLimits.freeMinutesPerDay,
                  week: planLimits.freeMinutesPerWeek,
                })}
              </p>
            </div>
            <AppStoreButton size="lg" />
          </div>
        )}

        <div className={styles.bottom}>
          <div className={styles.brand}>Palkie&nbsp;Talkie</div>
          <nav className={styles.links}>
            <Link href="/" className="tap-target">
              {t("footer.home")}
            </Link>
            <Link href="/pricing" className="tap-target">
              {t("nav.pricing")}
            </Link>
            <Link href="/faq" className="tap-target">
              {t("footer.faq")}
            </Link>
            <Link href="/support" className="tap-target">
              {t("footer.support")}
            </Link>
            <Link href="/privacy" className="tap-target">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="tap-target">
              {t("footer.terms")}
            </Link>
            <MailLink className="tap-target" newWindow subject="palkietalkie.com — Contact">
              {t("footer.contact")}
            </MailLink>
          </nav>
          <div className={styles.copy}>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
}
