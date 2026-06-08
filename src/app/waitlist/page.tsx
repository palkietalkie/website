import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getLocale } from "@/i18n/get-locale";
import { visitorPhoneSlug } from "@/lib/visitor-phone-slug";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./waitlist.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("waitlist");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function WaitlistPage() {
  const t = await getTranslations("waitlist");
  const phoneAutofill = await visitorPhoneSlug();
  const currentLocale = await getLocale();

  return (
    <>
      <main className={styles.wrap}>
        <div className={styles.shell}>
          <div className={styles.top}>
            <Link href="/" className={styles.brand}>
              Palkie&nbsp;Talkie
            </Link>
            <LanguageSwitcher />
          </div>

          <div className={styles.card}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.lead}>{t("lead")}</p>
            <WaitlistForm phoneAutofill={phoneAutofill} nativeDefault={currentLocale} />
          </div>
        </div>
      </main>
      <Footer hideClosingCta />
    </>
  );
}
