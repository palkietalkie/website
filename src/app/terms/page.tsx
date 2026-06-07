import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MailLink } from "@/components/MailLink";
import { fetchPlanLimits } from "@/lib/fetch-plan-limits";
import styles from "./terms.module.css";

export const metadata: Metadata = {
  title: "Terms of Service — Palkie Talkie",
  description: "Terms governing your use of Palkie Talkie.",
};

export default async function TermsPage() {
  const planLimits = await fetchPlanLimits();
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
            <span className="eyebrow">Legal</span>
            <h1>Terms of Service</h1>
            <p className={styles.lede}>Last updated: June 3, 2026.</p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.prose}>
            <h2>1. Acceptance</h2>
            <p>
              By creating an account or using the Palkie Talkie iOS app or website, you agree to
              these Terms and to our <Link href="/privacy">Privacy Policy</Link>. If you do not
              agree, do not use the service.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 13 years old. If you are between 13 and the age of majority in
              your jurisdiction, you must have parental or guardian consent. The service is not
              intended for users under 13.
            </p>

            <h2>3. Account</h2>
            <p>
              You are responsible for safeguarding your login credentials and for all activity under
              your account. Notify us at <MailLink subject="Account security concern" /> if you
              suspect unauthorized access.
            </p>

            <h2>4. Subscriptions, billing, and cancellation</h2>
            <ul>
              <li>
                The Free plan provides up to {planLimits.freeMinutesPerDay} minutes of voice
                conversation per day (reset at local midnight) and {planLimits.freeMinutesPerWeek}{" "}
                minutes per week (reset Monday). Whichever limit is reached first stops you for the
                rest of the window.
              </li>
              <li>
                Paid plans (Individual $17.99/month or $83.99/year; Family $19.99/month or
                $112.99/year for up to 6 users) are auto-renewing subscriptions billed by Apple via
                in-app purchase or by Stripe via web checkout.
              </li>
              <li>
                Paid plans auto-renew at the end of each period unless cancelled at least 24 hours
                before the period ends. Manage iOS subscriptions in Settings → [your Apple ID] →
                Subscriptions. Manage web subscriptions from your account page on palkietalkie.com.
              </li>
              <li>
                Refunds are at our discretion and subject to the policies of Apple (for IAP) and
                Stripe (for web). Refund requests can be sent to{" "}
                <MailLink subject="Refund request" />.
              </li>
              <li>
                We may change prices with at least 30 days&apos; notice to active subscribers.
                Existing renewals at the old price continue until the next renewal.
              </li>
            </ul>

            <h2>5. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for illegal purposes or to violate anyone&apos;s rights.</li>
              <li>
                Reverse-engineer, scrape, or attempt to extract our model weights or system prompts.
              </li>
              <li>
                Resell, sublicense, or share your account credentials with anyone outside your
                Family-plan members.
              </li>
              <li>Use automated agents to consume the service at scale.</li>
              <li>
                Submit content that infringes third-party intellectual property or contains harmful
                material.
              </li>
            </ul>

            <h2>6. Voice and content</h2>
            <p>
              When you speak to the app, your audio is streamed to third-party inference providers
              (currently OpenAI and, on the alternative path, our PersonaPlex deployment on Modal)
              for real-time processing. We retain text transcripts of conversations under your
              account to power personalization. You retain ownership of your own voice and content;
              you grant us a limited license to process them solely to deliver and improve the
              service. See our <Link href="/privacy">Privacy Policy</Link> for details.
            </p>

            <h2>7. Intellectual property</h2>
            <p>
              The app, the personas, the voice library, the prompts, the website, and all related
              code, designs, and text are our intellectual property or licensed to us. You may use
              them only as part of using the service.
            </p>

            <h2>8. Third-party services</h2>
            <p>
              The app depends on OpenAI, Stripe, Apple, Clerk, Neon, Pinecone, Neo4j AuraDB, Fly.io,
              Modal, NewsAPI, Open-Meteo, and Google AI Studio. Their availability and policies are
              outside our control.
            </p>

            <h2>9. Disclaimer of warranties</h2>
            <p>
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We
              do not warrant that the service will be error-free, uninterrupted, or that the
              AI&apos;s output will be accurate, useful, or appropriate for every context.
            </p>

            <h2>10. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, our aggregate liability arising out of or
              related to the service is limited to the amount you paid us in the 12 months preceding
              the claim, or $100, whichever is greater. We are not liable for indirect, incidental,
              special, consequential, or punitive damages.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from claims arising out of your use of the
              service or your violation of these Terms.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may suspend or terminate your account if you breach these Terms or use the service
              in a way that could harm us, other users, or third parties. You can terminate at any
              time by deleting your account from the More tab. Termination does not refund any paid
              period in progress unless required by law.
            </p>

            <h2>13. Governing law and dispute resolution</h2>
            <p>
              These Terms are governed by the laws of the State of California, without regard to
              conflict-of-law principles. Any dispute will be resolved exclusively in the state or
              federal courts located in San Francisco, California, and you consent to that
              jurisdiction.
            </p>

            <h2>14. Changes</h2>
            <p>
              We may update these Terms. When we do, we will update the &quot;Last updated&quot;
              date above and, for material changes, notify active users in the app. Continued use
              after a change means acceptance.
            </p>

            <h2>15. Contact</h2>
            <p>
              Questions? Email <MailLink subject="Terms of Service question" />.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
