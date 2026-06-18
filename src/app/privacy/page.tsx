import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MailLink } from "@/components/MailLink";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Palkie Talkie",
  description:
    "What we collect, how we use it, and how you can delete it. Privacy policy for the Palkie Talkie iOS app and palkietalkie.com.",
};

export default function PrivacyPage() {
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
            <h1>Privacy Policy</h1>
            <p className={styles.lede}>Last updated: June 17, 2026.</p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.prose}>
            <h2>Who we are</h2>
            <p>
              Palkie Talkie (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is a voice
              language-learning app, operated from San Francisco, CA. This policy covers data
              collected through the Palkie Talkie iOS app and the palkietalkie.com website. For any
              privacy or data-rights request, contact us (see Contact below).
            </p>

            <h2>What we collect</h2>
            <p>The minimum required to run the product:</p>
            <ul>
              <li>
                <strong>Account info</strong>: your email address and, optionally, the name
                you&apos;d like the tutor to call you.
              </li>
              <li>
                <strong>Voice recordings</strong>: the audio you speak during conversations,
                streamed to our AI voice provider for real-time processing. We keep this audio for
                up to 30 days to debug and improve quality, then delete it automatically. The text
                transcript of each turn is kept longer (see retention below).
              </li>
              <li>
                <strong>Conversation transcripts</strong>: text of what you said and what the AI
                replied, stored under your account so future sessions feel personal.
              </li>
              <li>
                <strong>Profile preferences</strong>: native languages, the language you&apos;re
                learning, target accents, proficiency level, tutor speaking speed, and goals.
              </li>
              <li>
                <strong>Knowledge graph</strong>: people, places, projects, and interests we
                extracted from your conversations (so the AI can refer back to them).
              </li>
              <li>
                <strong>Location</strong>: city-level only, used to set the AI&apos;s sense of place
                and time. We do not store your precise GPS coordinates.
              </li>
              <li>
                <strong>Purchase state</strong>: whether you are on the Free, Individual, or Family
                plan, and when your subscription renews. Card numbers and payment instruments are
                handled exclusively by Apple StoreKit and Stripe; we never see them.
              </li>
              <li>
                <strong>Usage events</strong>: cold-start timings, conversation counts, and
                performance metrics. Used to find bugs and measure performance.
              </li>
              <li>
                <strong>Diagnostics</strong>: anonymous crash reports.
              </li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>
                <strong>To run the app</strong>: the AI cannot have a real conversation with you
                without storing what you said before.
              </li>
              <li>
                <strong>To personalize</strong>: callbacks to past conversations, knowledge-graph
                entities, your proficiency level.
              </li>
              <li>
                <strong>To improve the product</strong> (if you opted in on the consent screen): we
                use conversation content to tune prompts, fix bugs, and train future versions of our
                models. You can revoke this in More → Privacy &amp; Data at any time.
              </li>
              <li>
                <strong>To bill you</strong>: only the subscription-state fields above. We do not
                use any other category for billing.
              </li>
            </ul>

            <h2>What we do not do</h2>
            <ul>
              <li>We do not sell your data to anyone.</li>
              <li>We do not run ads or share your data with advertising networks.</li>
              <li>We do not track you across apps and websites owned by other companies.</li>
              <li>We do not anonymize and resell your data.</li>
            </ul>

            <h2>Who we share it with</h2>
            <p>We use the following third-party providers to run the service:</p>
            <ul>
              <li>
                <strong>OpenAI</strong>: real-time AI voice processing.
              </li>
              <li>
                <strong>Clerk</strong>: authentication and identity.
              </li>
              <li>
                <strong>Neon</strong>: database for your account, profile, and transcripts.
              </li>
              <li>
                <strong>Pinecone</strong>: semantic recall of past conversations.
              </li>
              <li>
                <strong>Neo4j</strong>: knowledge-graph storage.
              </li>
              <li>
                <strong>Stripe</strong>: web subscription processing.
              </li>
              <li>
                <strong>Apple</strong>: in-app purchases and App Store delivery.
              </li>
              <li>
                <strong>Fly.io</strong>: backend hosting.
              </li>
              <li>
                <strong>Google AI Studio</strong>: post-session analysis (mistake and phrase
                detection).
              </li>
              <li>
                <strong>Open-Meteo</strong>: weather by approximate location.
              </li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Session audio is kept up to 30 days to debug quality, then deleted automatically.
              Transcripts and profile data are kept while your account is active. When you delete
              your account (More → Privacy &amp; Data → Delete my account), we deactivate it and
              stop using your data to provide the service; we retain a minimal record for security
              and accounting. Backups are retained for 30 days for disaster recovery.
            </p>

            <h2>Your rights</h2>
            <ul>
              <li>
                <strong>Export</strong>: email us and we will send a copy of your data (profile,
                knowledge graph, transcripts, likes, and any custom personas).
              </li>
              <li>
                <strong>Delete</strong>: in the app, More → Privacy &amp; Data → Delete my account.
                This removes your account and signs you out.
              </li>
              <li>
                <strong>Opt out of training</strong>: toggle off &quot;Product improvement&quot; in
                More → Privacy &amp; Data. Personalization stays on; we stop using new conversations
                to improve our models.
              </li>
              <li>
                <strong>Opt out of personalization</strong>: toggle off &quot;Personalization
                (memory)&quot; in the same screen. Every conversation will start cold without
                callbacks.
              </li>
            </ul>

            <h2>Kids</h2>
            <p>
              The app is not directed at children under 13. We do not knowingly collect data from
              anyone under 13. If you believe we have, email us at{" "}
              <MailLink subject="Under-13 account deletion" /> and we will delete the account.
            </p>

            <h2>Changes</h2>
            <p>
              We may update this policy from time to time. The &quot;Last updated&quot; date above
              reflects the current version, so please review it periodically.
            </p>

            <h2>Contact</h2>
            <p>
              Email <MailLink subject="Privacy / data-rights request" /> for any privacy question or
              data-rights request. We respond within 7 business days.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
