<!-- markdownlint-disable MD034 -->

# Palkie Talkie

AI-powered English conversation tutor with persistent memory, character personas, and scenario-based practice.

## Vision

Erase the disadvantage of being born outside the English-speaking world.

## Problem

### Speaking still sucks

Japanese expats in the US are already functional in English but not fluent.

### No time

At work, you're working — you can't train speaking. The rest is fragments: commute, shower, grocery runs. I want to use them but can't.

Cambly needs reservation and sit-down. English conversation schools obviously need in-person. Duolingo is a game — unexpectedly demands attention and isn't really for speaking.

### Plenty of apps, none fun

Plenty of English apps exist — Duolingo, ChatGPT voice mode, schools — but none of them work.

AI apps lack memory and personality; human tutors require scheduling and camera-on; gamified apps drill basics they've long since mastered.

Speaking should be inherently fun, but nothing is as painful as a boring conversation. Duolingo and schools all have problems. ChatGPT, Gemini, Grok voice modes are close — but their purpose is answering questions, and they keep asking "how can I help you today?" or "if there's anything..." — just annoying.

(See [Competitors](#competitors) for per-rival breakdown.)

## ICP (Ideal Customer Profile)

Wedge (laser focus, primary): Japanese expats in the US (25–45) who didn't get their education in the States or at an international school. Already functional in English but not fluent. Miss jokes in meetings, sound formal in casual settings, can't follow native-speed group conversations, dread phone calls.

Secondary (welcome, not the focus): Americans interested in Japan, and Japanese Americans living in SF/LA. They benefit from the product but aren't the GTM target. Channels that mostly serve secondary audiences (e.g., JAS-SoCal, JACCC, Japan Foundation LA) are lower priority.

Why not founders, even though I am one? I know founder pain firsthand, but I didn't pick founders as the wedge — founders are fewer and have less money. Expats have more pain, and more money because their company might want to support them. (Hypothesis to validate.)

Why Japanese first: I'm Japanese. Japanese English speaking sucks (on average), despite one of the best education systems in the world. We miss so much opportunity — jobs, partnerships, friendships, ideas — just because we can't speak fluently. The pain is biggest here.

Expansion path:

1. Japanese expats in the US (wedge)
2. - Chinese + Korean
3. - Asian
4. Global

## Real Examples

My brother, Naoto Nishio. Engine engineer at Kawasaki Heavy Industries, stationed in the UK. Company is in a fairly rural area, so it's a 1-hour drive from home. Work is normally busy, kids are young, mornings are early — and he ends up getting through work without having to speak much. So there's a real sense of crisis: just living in the UK isn't improving his speaking as much as he expected. He wants the app for himself AND his wife — the wife in particular has zero opportunities to improve. Kids are too young to speak yet, so probably out of scope, but family-mode would be even better.

Yuki Kishimoto, my friend and junior colleague from a previous job. Shy — doesn't even speak much to us in Japanese. Spent 2 years in LA and his English didn't improve at all. We knew it would happen, because he didn't speak English. Works at Daiso LA — had native-speaker coworkers right there to practice with, but didn't have the confidence to do it. Software engineer — understandable, but still terrible. He wanted to improve but had no courage. He just gave up because he couldn't speak English well.

## Solution

Palkie Talkie is an iOS app: an AI conversation tutor that runs entirely on-device.

1. Natural voice — instant start, instant stop, distinguishes pauses from turn completion, no "are you there?" or "let me know" filler.
2. Memory is non-negotiable — remembers every session, tracks vocab you know vs. don't, spaced repetition of new words/idioms.
3. Make conversations fun, not robotic or scripted — pick a persona (real people like Jimmy Carr, or role-play like prosecutor / politician), get proactive topic suggestions (real news, job interviews, debates).

## Public-Facing Copy

Internal positioning (founder's pain, ICP, on-device architecture) does NOT leak into user-facing copy. Users care what the product does for them.

### Tagline

English through real voice conversation.

### Instagram bio (150 char limit)

Real English voice conversations, on your time.
AI tutor for iPhone.
No scheduling, no camera.
Talk anywhere, anytime.

### X (Twitter) bio (160 char limit)

AI voice conversation tutor for English. iOS app. Talk to characters in any free moment — commute, shower, grocery. No scheduling, no camera.

### YouTube channel description

Palkie Talkie is an AI voice conversation tutor for iPhone. For people who already get by in English but stall short of fluent. Talk to AI characters about anything, in any free moment of your day. No scheduling, no camera-on, no scripted lessons.

### GitHub org description (200 char limit)

AI voice conversation tutor for English fluency. iOS app. Talk to AI characters anywhere, anytime — no scheduling.

### Website / App Store description

Palkie Talkie helps you become fluent in English through real voice conversation. An AI tutor for iPhone — no scheduling, no camera-on.

Talk to AI characters in any free moment: commute, shower, grocery runs. Pick a personality (Jimmy Carr, prosecutor, politician) or choose from real-news scenarios (FOMC decisions, debates, job interviews). The app remembers every conversation, tracks the words you know, and adapts to where you are.

For people who already get by in English but stall short of fluent.

## Competitors

Ordered from direct to far. Pain points are first-person from the founder.

| Name                         | URL                                    | Description                                                                       | What's not good for me                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Speak                        | speak.com                              | AI English conversation app with roleplay scenarios                               | UI is in Japanese because I'm in Japan even though my iPhone is in English; have to tap every time to end my speech; character voice sounds dead; doesn't feel like anyone real; no memory across sessions — reset every time; couldn't try free speech without subscribing (had to subscribe just to research); free speech blocks free response by default                                       |
| Praktika / Loora / Univerbal | praktika.ai, loora.ai, univerbal.app   | AI voice conversation tutors                                                      | Cloud-based → latency; no persistent memory of the individual learner; generic "AI tutor" persona, not real personalities                                                                                                                                                                                                                                                                          |
| ChatGPT voice mode           | chatgpt.com                            | General-purpose AI voice chat                                                     | Verifies "are you there?" before I can start — irritating; says "let me know..." filler — disgusting; keeps talking after I start speaking; doesn't start responding when I finish; interrupts when I'm just pausing mid-thought; pauses when I nod or background noise hits and can't resume; no memory of our conversations at all                                                               |
| Airlearn                     | airlearn.com                           | AI language app (saw it on a YouTube Short by my favorite Russian female creator) | Forced me to pick a mother tongue at signup with no English option; I had to pick Japanese; entire UI then in Japanese — uninstalled                                                                                                                                                                                                                                                               |
| Cambly                       | cambly.com                             | On-demand 1:1 video lessons with human tutors                                     | Reserving slots is a burden and stressful every time; tutor no-shows are frustrating; my own no-shows lost me credits — painful; requires camera on, so unusable for commute / walk / bath — have to sit down; most tutors don't prepare lessons and just ask "how can I help you today?" — that's not a service; the few with a template stop suggesting once I propose anything; quit eventually |
| ELSA Speak                   | elsaspeak.com                          | AI pronunciation scoring                                                          | Drill-based, not real conversation; narrow scope (pronunciation only)                                                                                                                                                                                                                                                                                                                              |
| Duolingo                     | duolingo.com                           | Gamified tap-and-translate language drills                                        | Voice mode is slow and sluggish; speaking isn't their main service; no real conversation; no memory of _me_                                                                                                                                                                                                                                                                                        |
| Babbel / Memrise / LingoDeer | babbel.com, memrise.com, lingodeer.com | Structured language lessons                                                       | Same category as Duolingo — vocabulary apps, not speaking partners                                                                                                                                                                                                                                                                                                                                 |
| Berlitz                      | berlitz.com                            | In-person language school (went at 22, sponsored by Barclays)                     | Same model as Phoenix below — in-person only, fixed schedule, expensive, not on-demand                                                                                                                                                                                                                                                                                                             |
| Phoenix Associates           | phoenix-academy.co.jp                  | In-person language school (went at 22, sponsored by Barclays)                     | Professional teachers, heavy textbook homework, in-person speaking/listening drills — rigorous but in-person only and high commitment                                                                                                                                                                                                                                                              |
| Nichibei Eigo Gakuin         | nichibei.ac.jp                         | In-person English school in Japan (went at 22, paid myself)                       | More casual and relaxed — not serious enough for real progress; in-person only                                                                                                                                                                                                                                                                                                                     |

## Business Model

### Palkie Talkie tiers

| Tier       | Monthly | Annual | Includes                            |
| ---------- | ------- | ------ | ----------------------------------- |
| Free       | $0      | $0     | 5–10 min/day, 1 persona, memory off |
| Individual | $12.99  | $89    | One user                            |
| Family     | $14.99  | $119   | Up to 6 users                       |

Positioned just below Duolingo Super ($13.99/mo, $95.99/yr) and Duolingo Super Family ($119.99/yr). New brand, no proof yet — undercutting beats premium pricing.

### Competitor benchmarks (2026)

| App      | Plan                          | Monthly        | Annual                      | Notes                                |
| -------- | ----------------------------- | -------------- | --------------------------- | ------------------------------------ |
| Duolingo | Free                          | $0             | $0                          | Ads, gamified drills                 |
| Duolingo | Super                         | $13.99         | $95.99 (~$8/mo, ~7× mo)     | Ad-free, unlimited hearts            |
| Duolingo | Super Family                  | —              | $119.99 (~$20/user/yr)      | Up to 6 users                        |
| Duolingo | Max                           | $29.99         | $167.99 (~$14/mo, ~5.6× mo) | + Video Call, Roleplay (AI)          |
| Duolingo | Max Family                    | —              | $239.99 (~$40/user/yr)      | Up to 6 users                        |
| Speak    | Free trial                    | $0             | —                           | Limited duration                     |
| Speak    | Premium                       | $17.99         | $83.99 (~$7/mo, ~4.7× mo)   | Core lessons + AI tutor              |
| Speak    | Premium Plus                  | $39.99         | $164.99 (~$14/mo, ~4.1× mo) | + Unlimited custom lessons           |
| Cambly   | Cheapest (1 × 30min/wk, 12mo) | ~$22/mo        | —                           | Per-lesson model, 50% off vs monthly |
| Cambly   | 2 × 30min/wk, monthly         | $85/mo         | —                           | Private+                             |
| Cambly   | Unlimited / Pro               | up to ~$159/mo | —                           | Top tier, structured lessons         |

Note: industry annual discount is ~5–7× monthly (not 10×). Speak in particular runs ~4.7× monthly for Premium — very aggressive lock-in.

## GTM (Go-to-Market)

Goal: first 10 paying customers — to measure CAC (ideally) and CVR per channel. Zero ad spend. Personal asks to my network are warm-ups, not counted as the 10.

### Geography

- In-person events (GTM B): SF Bay Area only. ~20,400 registered Japanese nationals in the SF metro (Japanese MOFA, Oct 2023). SF picked because of two ICP-specific orgs that meet here — Keizai (Japanese tech professionals; tech is a subset of our ICP, not the whole) and SVJETS / SF JETs (speaking-improvement clubs, industry-agnostic).
- Cold outreach (GTM A): SF Bay Area first to compound with in-person events (same network talks, word of mouth carries). Open to any US city / any industry if SF saturates.
- LA has more raw expats (Torrance is the corporate hub) but I haven't found a Keizai/JETS-equivalent meeting cadence there. If one exists, the in-person side flips to LA. Cold outreach is unaffected either way.

### Top picks

- Keizai Silicon Valley — https://keizai.org/ — networking nonprofit for Japanese tech professionals in SV/SF. Events: Shinnenkai, Summer mixer, Oktoberfest, regular happy hours.
- JETS (Silicon Valley Japanese-English Toastmasters / SVJETS) — https://svjets.wordpress.com/ — bilingual public-speaking club. Meets 1st/3rd Thursday 7–8:30pm PT, online + San Jose. Chartered 1990. Self-identified ICP — already raised their hand to improve speaking.
- SF JETs (San Francisco Japanese-English Toastmasters) — https://sfjets.toastmastersclubs.org/ — meets 2nd/4th Friday at Peace Plaza East Mall. ~25 members, ~half native JP / half native EN. Founded 1988.
  - SF JETs Facebook group — https://www.facebook.com/groups/sfjets/

### Backup channels (also subscribed)

- Consulate-General of Japan in San Francisco (CGJSF) — https://www.facebook.com/cgjsf1/followers — huge follower base of Japanese-in-SF (visa/passport/event news); passive but high-density ICP
- Japan Society of Northern California — https://www.usajapan.org/
- JCCCNC (Japanese Cultural and Community Center of NorCal) — https://www.jcccnc.org/
- Japanese Chamber of Commerce of NorCal — https://www.jccnc.org/
- JACL San Francisco — https://www.facebook.com/JACLNational/ (more JA than expats; lower priority)
- JETAANC (JET program alumni in NorCal) — https://www.jetaanc.org/
- Toastmasters International (Facebook) — https://www.facebook.com/ToastmastersInternationalOfficialFanPage/ — parent org of all Toastmasters clubs; broad speaking-focused audience, partial ICP overlap
- Toastmasters International (LinkedIn) — https://www.linkedin.com/company/toastmasters-international/ — same parent org, more professional audience

### How each org delivers ICP

Each org gives me two distinct prospect surfaces — both important, neither sufficient on its own:

| Surface                             | What it is            | Why it matters                                                                                                 |
| ----------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Newsletter / event calendar         | RSVP-able meetups     | In-person events = highest-bandwidth 1-on-1, but rare (monthly/quarterly) and SF-bound                         |
| SNS account followers (LI / FB / X) | Public follower lists | Followers self-identified as Japanese-expat-adjacent — the real prospect pool, mineable any time, geo-agnostic |

In-person events alone are too slow and too narrow to hit 10 paying customers. The SNS follower graph is where the volume comes from.

### Four GTMs (run in parallel)

GTM A — Cold DM (digital direct outreach)

Focus: SF Bay Area first (compounds with in-person events; same network talks). Open to any US city if SF saturates. Filter org SNS follower lists by Japanese name + US-based job (LinkedIn search). Personalized DM in Japanese referencing the org we both follow. Target: 20–50 DMs/week.

GTM B — In-person events (physical direct outreach, SF only)

Keizai mixers, JETS meetings. Highest conversion per contact but capped by event frequency and geography. Target: 1–2 events/month.

GTM C — Public engagement (inbound, passive)

Thoughtful comments on Keizai / JETS / CGJSF posts. Builds my visibility to their entire follower base before any DM. Continuous.

GTM D — Own content (inbound, passive)

LI / X / note.com posts in Japanese about the expat speaking-plateau, using my real story (brother, Yuki). Tag the orgs. Their followers see it via reshares. Target: 1–2 posts/week.

Excluded from the 10: warm network (Naoto, his wife, Yuki, friends) — feedback and testimonials only.

### Success criteria

- 10 paying customers, zero ad spend
- Per-flow data: which one earns the next 100
- Identify the one flow that scales

## Team

Solo: Wes Nishio (founder). Technical. Based in SF. Looking for one technical co-founder.

### Criteria (mandatory)

- Non-Japanese.
- Personal empathy with the problem — has lived the English-fluency disadvantage themselves (non-native English speaker who hit the same plateau). Otherwise they'll question why we're doing this and can't feel the pain users describe.
- Ideally a user of the product themselves — still in the plateau, would actually use the app daily. Hard to sympathize with users if you don't share their problem.
- Technical and a fast learner. iOS / ML / audio depth NOT required upfront — smart person with sense can pick it up.
- Younger is better. More energy, more time, lower opportunity cost of equity over salary.

### Terms

- Equity, not salary. Joins BEFORE MRR.
- Equity range: TBD (typical solo founder + first co-founder split lands somewhere in 30–50% to the co-founder, depending on stage and contribution).

### Where / how to find

YC co-founder matching app: https://www.startupschool.org/cofounder-matching

## Fundraising

- Amount targeted: $500K
- Valuation: $8M post-money
- Use of funds — founder / GTM
- Milestones to hit before next round: TBD

## #1 Design Principle: Page Speed

Marketing site must load fast. First Contentful Paint under 1s on broadband, under 2s on 4G. SSG/ISR over SSR where possible. Static assets only on the critical path. Lazy-load anything below the fold.

## Tech Stack

| Layer        | Choice                          | Notes                            |
| ------------ | ------------------------------- | -------------------------------- |
| Framework    | Next.js (latest, App Router)    | React Server Components default  |
| Language     | TypeScript                      | strict mode                      |
| Bundler      | Turbopack                       | Next.js default                  |
| Styling      | Pure CSS / CSS Modules          | no Tailwind                      |
| Lint         | ESLint (Next.js config)         | enforced via pre-commit          |
| Hosting      | Vercel                          | Hobby plan to start              |
| CI           | GitHub Actions                  | `.github/workflows/deploy.yml`   |

## Architecture

Static-first marketing site. Pages are React Server Components rendered at build time (or revalidated on demand). Client components only where needed (interactivity).

```
GitHub push to main → GitHub Actions → Vercel CLI → Vercel (CDN edge)
```

No API routes for now (no backend, no auth). Forms (e.g., waitlist signup) can post to Vercel serverless functions later.

## Project Structure

```
website/
├── src/
│   └── app/
│       ├── layout.tsx       # root layout (HTML shell, metadata)
│       ├── page.tsx         # home page
│       └── globals.css      # global styles
├── public/                  # static assets (images, fonts, favicon)
├── .github/workflows/
│   └── deploy.yml           # Vercel deploy on push to main
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

## Development Notes

- Founder background: Wes is strong in TypeScript / JavaScript, Python, PostgreSQL. Fast learner; explain library-specific patterns in chat, not in source-file comments.
- Comment policy: comments explain WHY (intent, hidden constraint, non-obvious reason), never WHAT (mechanics, syntax, what code does). Well-named identifiers cover WHAT.
- UI language: default = browser locale via `Accept-Language`; user can override via in-page selector. No device-locale lock-in.
- All product-level positioning copy lives in [`Public-Facing Copy`](#public-facing-copy). Don't drift the website from that source of truth.
- Vercel deploys via GitHub Actions on push to main (see `.github/workflows/deploy.yml`). Requires `VERCEL_TOKEN` GitHub secret.

## Setup (once per clone)

```
npm install
npm run dev
```

Open http://localhost:5000.

For deploy to work, set the `VERCEL_TOKEN` secret in GitHub repo settings (Settings → Secrets → Actions).

## LGTM Workflow

CRITICAL: NEVER start without explicit user request. PR must be clean — don't ignore failures.

1. `git fetch origin main && git merge origin/main`
2. `git commit -m "<one-liner subject>"` — user has already run `git add` before saying "lgtm"
   - Pre-commit hook (when added) runs `eslint`, `prettier`, type-check, build sanity.
   - One-liner subject only. No body paragraphs. PR body carries long-form context.
   - NO co-author lines, NO `[skip ci]`
   - If hook fails: fix, re-stage, commit again. Don't stage other sessions' files.
3. Check for existing PR: `gh pr list --head $(git branch --show-current) --state open` — if exists, STOP and ask
4. `git push`
5. `gh pr create --title "<technical, descriptive title>" --body "" --assignee @me` — title is enough; no body until product launches.
