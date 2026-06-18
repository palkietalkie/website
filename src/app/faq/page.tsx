import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AppStoreButton } from "@/components/AppStoreButton";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import styles from "./faq.module.css";

type FaqItem = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  return { title: t("title") };
}

export default function FaqPage() {
  const t = useTranslations();
  const items = t.raw("faq.items") as FaqItem[];
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
            <span className="eyebrow">{t("faq.eyebrow")}</span>
            <h1>{t("faq.title")}</h1>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.list}>
            {items.map((f) => (
              <details key={f.q} className={styles.item}>
                <summary className="tap-target">{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className={styles.cta}>
            <AppStoreButton />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
