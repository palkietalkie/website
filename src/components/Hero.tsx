import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppStoreButton } from "./AppStoreButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Hero.module.css";
import { Screenshot } from "./Screenshot";

type Props = {
  /** True when the visitor is in waitlist mode (pre-launch OR non-iOS). The page resolves this server-side via `shouldShowWaitlist()` and passes it down. Default false so tests rendering <Hero /> synchronously get post-launch UI. */
  waitlist?: boolean;
  /** Free-plan caps fetched server-side from the backend, passed in so the "X min/day, Y min/week" smallprint stays in sync with whatever the backend enforces. Defaults to the current production values so tests rendering <Hero /> synchronously don't need to mock. */
  planLimits?: { freeMinutesPerDay: number; freeMinutesPerWeek: number };
};

export function Hero({
  waitlist = false,
  planLimits = { freeMinutesPerDay: 10, freeMinutesPerWeek: 30 },
}: Props) {
  const t = useTranslations();
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.inner}`}>
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

        <div className={styles.copy}>
          <h1 className={styles.headline}>{t("meta.tagline")}</h1>
          <p className={styles.subhead}>{t("meta.description")}</p>

          <div className={styles.ctas}>
            <AppStoreButton size="lg" />
          </div>

          <p className={styles.smallprint}>
            {t("hero.smallprint", {
              day: planLimits.freeMinutesPerDay,
              week: planLimits.freeMinutesPerWeek,
            })}
          </p>
        </div>

        <Screenshot
          src="/screens/01-talk.png"
          alt={t("meta.description")}
          className={styles.heroVisual}
          priority
        />
      </div>
    </header>
  );
}
