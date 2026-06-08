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
            <p className={styles.lede}>
              Last updated: June 3, 2026. We are starting in English; translations of this policy
              will be added as we ship in each locale.
            </p>
          </div>
        </div>
      </header>

      <section className={`section ${styles.body}`}>
        <div className="container">
          <div className={styles.prose}>
            <h2>Who we are</h2>
            <p>
              Palkie Talkie (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is a voice
              language-learning app. This policy covers data collected via the iOS app (bundle ID{" "}
              <code>com.palkietalkie.app</code>) and the palkietalkie.com website. Before
              incorporation, the data controller is Wes Nishio, San Francisco, CA; after
              incorporation, Palkie Talkie, Inc. (Delaware C-Corp).
            </p>

            <h2>What we collect</h2>
            <p>The minimum required to run the product:</p>
            <ul>
              <li>
                <strong>Account info</strong>: email address, optional phone number, optional name.
                Sourced from Clerk when you sign in.
              </li>
              <li>
                <strong>Voice recordings</strong>: audio you speak during conversations. Streamed to
                OpenAI&apos;s Realtime API (paid users) or OpenAI&apos;s Realtime mini (free users)
                for real-time AI processing. We do not retain raw audio on our servers; we retain
                the text transcript of each turn.
              </li>
              <li>
                <strong>Conversation transcripts</strong>: text of what you said and what the AI
                replied, stored under your account so future sessions feel personal.
              </li>
              <li>
                <strong>Profile preferences</strong>: native language, target language, proficiency
                level, tutor speaking speed, goals.
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
                <strong>Usage events</strong>: cold-start timings, session counts, sign-in events,
                mic-tap latency. Used to find bugs and measure performance.
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
              <li>
                We do not anonymize and resell aggregated behavior. Voice is biometric; transcripts
                contain personal facts. We will not pretend a guarantee we can&apos;t actually
                deliver.
              </li>
            </ul>

            <h2>Who has access</h2>
            <p>
              Your data is accessible to a small engineering team (currently just the founder;
              future hires will be listed here when added) for debugging and product improvement.
              Subprocessors we share data with:
            </p>
            <ul>
              <li>
                <strong>OpenAI</strong>: realtime audio inference. Receives raw audio in real time
                and returns the AI&apos;s audio + text. See OpenAI&apos;s data usage terms.
              </li>
              <li>
                <strong>Modal</strong>: alternative inference plane for the PersonaPlex model path
                (NVIDIA-developed voice model running on our infrastructure).
              </li>
              <li>
                <strong>Clerk</strong>: authentication and identity.
              </li>
              <li>
                <strong>Neon</strong>: managed Postgres holding your account, profile, and
                transcripts.
              </li>
              <li>
                <strong>Pinecone</strong>: vector database for semantic recall of past
                conversations.
              </li>
              <li>
                <strong>Neo4j AuraDB</strong>: knowledge graph store.
              </li>
              <li>
                <strong>Stripe</strong>: web subscription processing.
              </li>
              <li>
                <strong>Apple</strong>: in-app purchase processing and App Store delivery.
              </li>
              <li>
                <strong>Fly.io</strong>: backend hosting.
              </li>
              <li>
                <strong>Google AI Studio</strong>: post-session NLP pipelines (mistake detection,
                phrase extraction).
              </li>
              <li>
                <strong>Open-Meteo</strong>: weather lookup by approximate location.
              </li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Transcripts and profile data are kept until you delete your account or trigger a soft
              delete from More → Privacy &amp; Data. Soft deletion has a 30-day grace period in case
              you change your mind, after which we hard-delete the rows in our DB plus the vectors
              in Pinecone and the nodes in Neo4j. Backups are retained for 30 days for disaster
              recovery.
            </p>

            <h2>Your rights</h2>
            <ul>
              <li>
                <strong>Export</strong>: from the app, More → Privacy &amp; Data → Export my data.
                We return a JSON bundle of profile, knowledge graph, transcripts, likes, and any
                custom personas.
              </li>
              <li>
                <strong>Delete</strong>: same place, &quot;Delete all my conversation history&quot;
                (soft delete) or &quot;Delete my account&quot; (hard delete with cascade).
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
              When we change this policy materially we will notify active users in the app and
              update the &quot;Last updated&quot; date above. Continued use after a change means
              acceptance of the revised policy.
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
