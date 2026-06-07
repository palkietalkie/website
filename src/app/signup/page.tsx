import { SignUp, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { coerceTier } from "@/lib/coerce-tier";
import { TIER_PRICE, type Tier } from "@/constants/tiers";
import { startCheckout } from "./actions/start-checkout";
import styles from "./signup.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("signup");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Search = Promise<{ tier?: string; canceled?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tier = coerceTier(sp.tier);
  const canceled = sp.canceled === "1";

  const { userId } = await auth();
  const signedIn = Boolean(userId);

  const onCheckout = async () => {
    "use server";
    await startCheckout(tier);
  };

  return (
    <main className={styles.wrap}>
      <SignupShell tier={tier} canceled={canceled} signedIn={signedIn} onCheckout={onCheckout} />
    </main>
  );
}

function SignupShell({
  tier,
  canceled,
  signedIn,
  onCheckout,
}: {
  tier: Tier;
  canceled: boolean;
  signedIn: boolean;
  onCheckout: () => Promise<void>;
}) {
  const t = useTranslations();
  const price = TIER_PRICE[tier];
  const tierName = t(`pricing.tiers.${tier}.name`);
  const perks = t.raw(`pricing.tiers.${tier}.includes`) as string[];
  const perMonth = t("signup.perMonth", { amount: price.monthly });
  const perYear = t("signup.perYear", { amount: price.yearly });
  return (
    <div className={styles.shell}>
      <div className={styles.shellTop}>
        <Link href="/" className={styles.brand}>
          Palkie&nbsp;Talkie
        </Link>
        <LanguageSwitcher />
      </div>

      <div className={styles.grid}>
        <aside className={styles.summary}>
          <span className="eyebrow">{t("signup.youPicked")}</span>
          <h1 className={styles.tierName}>{tierName}</h1>
          <div className={styles.price}>{perMonth}</div>
          <div className={styles.yearly}>{perYear}</div>
          <ul className={styles.perks}>
            {perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className={styles.switch}>
            {tier === "individual" ? (
              <Link href="/signup?tier=family">{t("signup.switchToFamily")}</Link>
            ) : (
              <Link href="/signup?tier=individual">{t("signup.switchToIndividual")}</Link>
            )}
          </div>
          {canceled && <p className={styles.canceled}>{t("signup.canceled")}</p>}
        </aside>

        <section className={styles.form}>
          {signedIn ? (
            <>
              <div className={styles.signedHeader}>
                <h2 className={styles.formTitle}>{t("signup.step2Title")}</h2>
                <UserButton />
              </div>
              <p className={styles.formLead}>{t("signup.step2Lead")}</p>
              <form action={onCheckout}>
                <button type="submit" className={styles.payBtn}>
                  {t("signup.checkoutCta", { price: perMonth })}
                </button>
              </form>
              <p className={styles.smallprint}>{t("signup.cancelNote")}</p>
            </>
          ) : (
            <div className={styles.clerkSlot}>
              {/* Clerk's <SignUp> ships its own H1 ("Create your account") + lead — stacking our step heading on top of it produced two identical headings. Letting Clerk's UI stand alone is the cleanest fix. */}
              <SignUp
                routing="hash"
                signInUrl="/sign-in"
                fallbackRedirectUrl={`/signup?tier=${tier}`}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
// TODO: Clerk SDK has its own `<SignUp>` chrome which stays in English regardless of next-intl locale. Wire `<ClerkProvider localization={jaJP}>` in layout.tsx (conditional on getLocale()) when we ship Japanese signup. For now, the Clerk dialog reads in English even on JA pages.
