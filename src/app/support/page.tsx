import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MailLink } from "@/components/MailLink";
import styles from "./support.module.css";

export const metadata: Metadata = {
  title: "Support — Palkie Talkie",
  description:
    "Get help with Palkie Talkie. Email support, subscription management, account deletion, and common questions.",
};

export default function SupportPage() {
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
            <span className="eyebrow">Support</span>
            <h1>We&apos;re here to help.</h1>
            <p className={styles.lede}>
              Real human responses, usually within 24 hours. Send your question to{" "}
              <MailLink subject="Support request" /> or use one of the shortcuts below.
            </p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.cards}>
            <MailLink className={styles.card} subject="Support request">
              <h2>Email us</h2>
              <p>hello@palkietalkie.com — fastest path to a human reply.</p>
            </MailLink>

            <a
              className={styles.card}
              href="https://support.apple.com/en-us/HT202039"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>Manage your subscription</h2>
              <p>
                iPhone Settings → tap your name → Subscriptions → Palkie Talkie. Apple controls the
                renewal, cancellation, and refund flow for in-app purchases.
              </p>
            </a>

            <Link className={styles.card} href="/faq">
              <h2>FAQ</h2>
              <p>
                Common answers: pricing, free-tier limits, supported languages, what the AI
                remembers, privacy.
              </p>
            </Link>

            <Link className={styles.card} href="/privacy">
              <h2>Privacy &amp; data deletion</h2>
              <p>
                Export or delete your data any time from More → Privacy &amp; Data inside the app.
                Read our full privacy policy.
              </p>
            </Link>
          </div>

          <div className={styles.faq}>
            <h2>Quick answers</h2>

            <details className={styles.item}>
              <summary>How do I cancel my subscription?</summary>
              <p>
                On iPhone: open Settings → tap your name at the top → Subscriptions → Palkie Talkie
                → Cancel Subscription. Apple processes the cancellation; your premium access
                continues until the end of the current period.
              </p>
            </details>

            <details className={styles.item}>
              <summary>How do I get a refund?</summary>
              <p>
                For in-app purchases: request a refund through{" "}
                <a
                  href="https://reportaproblem.apple.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  reportaproblem.apple.com
                </a>{" "}
                — Apple makes the final decision. For web subscriptions: email us and we&apos;ll
                refund through Stripe.
              </p>
            </details>

            <details className={styles.item}>
              <summary>The app crashes or audio doesn&apos;t work.</summary>
              <p>
                Check that you granted microphone permission in iPhone Settings → Palkie Talkie →
                Microphone. If the AI plays but you don&apos;t hear it, check the volume side switch
                and that Silent Mode is off. If the issue persists, email us with your iOS version
                and a description of what happens.
              </p>
            </details>

            <details className={styles.item}>
              <summary>I want to delete my account.</summary>
              <p>
                Open the app → More → Privacy &amp; Data → Delete my account. This removes your
                account and signs you out. If you can&apos;t reach the screen, email us and
                we&apos;ll do it for you.
              </p>
            </details>

            <details className={styles.item}>
              <summary>The AI is talking too much / not stopping when I do.</summary>
              <p>
                You can interrupt mid-sentence by speaking; the AI&apos;s audio will yield. If a
                specific persona keeps overriding pace or saying the same phrase, switch personas
                from the Persona tab, or email us — we tune persona prompts based on real reports.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
