# Palkie Talkie — Website

Marketing site repo. Shared product positioning, ICP, GTM, business model, and team/fundraising live in the parent `../CLAUDE.md`.

## #1 Design Principle: Page Speed

Marketing site must load fast. First Contentful Paint under 1s on broadband, under 2s on 4G. SSG/ISR over SSR where possible. Static assets only on the critical path. Lazy-load anything below the fold.

## Tech Stack

| Layer       | Choice                            | Notes                                                    |
| ----------- | --------------------------------- | -------------------------------------------------------- |
| Framework   | Next.js (latest, App Router)      | React Server Components default                          |
| Language    | TypeScript                        | strict mode                                              |
| Bundler     | Turbopack                         | Next.js default                                          |
| Styling     | Pure CSS / CSS Modules            | no Tailwind                                              |
| Lint        | ESLint (Next.js config)           | enforced via pre-commit                                  |
| Hosting     | Vercel                            | Hobby plan to start                                      |
| CI          | GitHub Actions                    | `.github/workflows/deploy.yml`                           |
| Analytics   | Plausible / Umami / similar (TBD) | track visitors → App Store click CTR                     |
| Auth        | Clerk Next.js SDK                 | clerk.com (web subscription path, secondary to iOS IAP)  |
| Payments    | Stripe Checkout                   | stripe.com (web subscription path, secondary to iOS IAP) |
| Backend API | FastAPI server                    | see `../backend/`                                        |

## Architecture

Marketing pages + an optional web subscription path. Primary funnel is mobile-first (most users → App Store → install → trial → IAP). Secondary path: desktop / web-first users can subscribe directly via Stripe + Clerk before downloading.

```text
GitHub push to main → GitHub Actions → Vercel CLI → Vercel (CDN edge)
```

User flow (primary, mobile-first):

1. Marketing channels (DM / content / search) → `palkietalkie.com` (mobile).
2. "Download on the App Store" CTA → App Store deep link.
3. App Store page → Install.
4. In-app: signs in via Clerk, lands on the Free plan (10 min/day — see parent `../CLAUDE.md` Business Model).
5. User gets obsessed → hits the Free-plan limit.
6. Subscribes via in-app IAP.
7. Recommends to family.

User flow (secondary, web-first / desktop):

1. Marketing → `palkietalkie.com` (desktop) → "Subscribe" CTA.
2. Clerk sign-up → Stripe Checkout → Success page.
3. Success page → "Download on the App Store" CTA → user installs iOS app.
4. App: Clerk sign-in with the same identity → premium entitlement already active (no trial gate).

## Project Structure

```text
website/
├── src/
│   └── app/
│       ├── layout.tsx         # root layout (HTML shell, metadata)
│       ├── page.tsx           # landing (mobile-optimized, App Store CTA)
│       ├── pricing/page.tsx   # pricing vs Duolingo / Speak (App Store CTA + Subscribe CTA)
│       ├── signup/page.tsx    # secondary path: Clerk sign-up + Stripe Checkout
│       ├── success/page.tsx   # post-checkout, "Download iOS app" CTA
│       ├── (auth)/            # Clerk-managed routes
│       └── globals.css
├── public/                    # static assets
├── .github/workflows/
│   └── deploy.yml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

## Development Notes

- Founder background: Wes is strong in TypeScript / JavaScript, Python, PostgreSQL. Fast learner; explain library-specific patterns in chat, not in source-file comments.
- Comment policy: comments explain WHY (intent, hidden constraint, non-obvious reason), never WHAT (mechanics, syntax, what code does). Well-named identifiers cover WHAT.
- UI language: default = browser locale via `Accept-Language`; user can override via in-page selector. No device-locale lock-in.
- All product-level positioning copy lives in the parent `../CLAUDE.md` (`Public-Facing Copy` section). Don't drift the website from that source of truth.
- Vercel deploys via GitHub Actions on push to main (see `.github/workflows/deploy.yml`). Requires `VERCEL_TOKEN` GitHub secret.

## Setup (once per clone)

```node
npm install
npm run dev
```

Open http://localhost:5000.

For deploy to work, set the `VERCEL_TOKEN` secret in GitHub repo settings (Settings → Secrets → Actions).

## LGTM Workflow

CRITICAL: NEVER start without explicit user request. PR must be clean, don't ignore failures.

1. `git fetch origin main && git merge origin/main`
2. `git commit -m "<one-liner subject>"`, user has already run `git add` before saying "lgtm"
   - Pre-commit hook (when added) runs `eslint`, `prettier`, type-check, build sanity.
   - One-liner subject only. No body paragraphs. PR body carries long-form context.
   - NO co-author lines, NO `[skip ci]`
   - If hook fails: fix, re-stage, commit again. Don't stage other sessions' files.
3. Check for existing PR: `gh pr list --head $(git branch --show-current) --state open`, if exists, STOP and ask
4. `git push`
5. `gh pr create --title "<technical, descriptive title>" --body "" --assignee @me`, title is enough; no body until product launches.
