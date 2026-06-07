import { Apple, MailPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { APP_STORE_URL } from "@/constants/app-store-url";
import { shouldShowWaitlist } from "@/lib/should-show-waitlist";
import styles from "./AppStoreButton.module.css";

type Props = {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
};

// Server component. When the app isn't on the App Store yet (NEXT_PUBLIC_APP_LAUNCHED=false) or the visitor is on Android, this renders a waitlist CTA pointing at /waitlist instead of the App Store deep link. Once the app is live AND the visitor is on iOS, it renders the real App Store button.
export async function AppStoreButton({ variant = "primary", size = "md" }: Props) {
  const t = await getTranslations("appStore");
  const waitlist = await shouldShowWaitlist();

  if (waitlist) {
    return (
      <Link
        className={`${styles.btn} ${styles.waitlist} ${styles[size]} tap-target`}
        href="/waitlist"
        aria-label={t("waitlistLabel")}
      >
        <MailPlus className={styles.icon} aria-hidden="true" />
        <span className={styles.labelStack}>
          <span className={styles.big}>{t("waitlistLabel")}</span>
        </span>
      </Link>
    );
  }

  return (
    <a
      className={`${styles.btn} ${styles[variant]} ${styles[size]} tap-target`}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
    >
      <Apple className={styles.icon} aria-hidden="true" />
      <span className={styles.labelStack}>
        <span className={styles.big}>{t("label")}</span>
      </span>
    </a>
  );
}
