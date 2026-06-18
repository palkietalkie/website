import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MailLink } from "@/components/MailLink";
import styles from "./support.module.css";

type SupportItem = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("support");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function SupportPage() {
  const t = useTranslations();
  const items = t.raw("support.items") as SupportItem[];
  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
              Palkie&nbsp;Talkie
            </Link>
            <LanguageSwitcher />
          </nav>
          <div className={styles.intro}>
            <span className="eyebrow">{t("support.eyebrow")}</span>
            <h1>{t("support.title")}</h1>
            <p className={styles.lede}>
              {t("support.ledeBefore")}
              <MailLink subject="Support request" />
              {t("support.ledeAfter")}
            </p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.cards}>
            <MailLink className={styles.card} subject="Support request">
              <h2>{t("support.cards.emailTitle")}</h2>
              <p>{t("support.cards.emailBody")}</p>
            </MailLink>

            <a
              className={styles.card}
              href="https://support.apple.com/en-us/HT202039"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>{t("support.cards.subscriptionTitle")}</h2>
              <p>{t("support.cards.subscriptionBody")}</p>
            </a>

            <Link className={styles.card} href="/faq">
              <h2>{t("support.cards.faqTitle")}</h2>
              <p>{t("support.cards.faqBody")}</p>
            </Link>

            <Link className={styles.card} href="/privacy">
              <h2>{t("support.cards.privacyTitle")}</h2>
              <p>{t("support.cards.privacyBody")}</p>
            </Link>
          </div>

          <div className={styles.faq}>
            <h2>{t("support.quickAnswers")}</h2>
            {items.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
