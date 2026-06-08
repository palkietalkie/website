# Palkie Talkie — Website

Marketing site repo. Shared product positioning, ICP, GTM, business model, and team/fundraising live in the parent `../CLAUDE.md`.

## #1 Design Principle: Page Speed

Marketing site must load fast. First Contentful Paint under 1s on broadband, under 2s on 4G. SSG/ISR over SSR where possible. Static assets only on the critical path. Lazy-load anything below the fold.

## Architecture

Marketing pages + an optional web subscription path. Primary funnel is mobile-first (most users → App Store → install → trial → IAP). Secondary path: desktop / web-first users can subscribe directly via Stripe + Clerk before downloading.

```text
GitHub push to main → GitHub Actions → Vercel CLI → Vercel (CDN edge)
```

User flow (primary, mobile-first):

1. Marketing channels (DM / content / search) → `palkietalkie.com` (mobile).
2. "Download on the App Store" CTA → App Store deep link.
3. App Store page → Install.
4. In-app: signs in via Clerk, lands on the Free plan (10 min/day + 30 min/week — see parent `../CLAUDE.md` Business Model).
5. User gets obsessed → hits the Free-plan limit.
6. Subscribes via in-app IAP.
7. Recommends to family.

User flow (secondary, web-first / desktop):

1. Marketing → `palkietalkie.com` (desktop) → "Subscribe" CTA.
2. Clerk sign-up → Stripe Checkout → Success page.
3. Success page → "Download on the App Store" CTA → user installs iOS app.
4. App: Clerk sign-in with the same identity → premium entitlement already active (no trial gate).

## Development Notes

- UI language: default = browser locale via `Accept-Language`; user can override via in-page selector. No device-locale lock-in.
- All product-level positioning copy lives in the parent `../CLAUDE.md` (`Public-Facing Copy` section). Don't drift the website from that source of truth.
- Vercel deploys via GitHub Actions on push to main (see `.github/workflows/deploy.yml`). Requires `VERCEL_TOKEN` GitHub secret.

## Setup (once per clone)

```bash
cp .env.local.example .env.local
# Fill in values per .env.local.example.
npm install
npm run dev
```

Open <http://localhost:3030>.

For Vercel deploy: set the `VERCEL_TOKEN` GitHub secret (Settings → Secrets → Actions).

## One-time external account setup

Stripe products + prices already exist (`Palkie Talkie Individual` / `Palkie Talkie Family` with current prices — see root `/CLAUDE.md` Business Model + Infrastructure accounts). New environments only need to copy the `price_…` IDs into `STRIPE_PRICE_INDIVIDUAL_MONTHLY` / `_ANNUAL` and `STRIPE_PRICE_FAMILY_MONTHLY` / `_ANNUAL`.

Stripe webhook endpoint (`/api/stripe/webhook`) for subscription → `users.premium` sync: not implemented yet. Add `STRIPE_WEBHOOK_SECRET` when wired.

Clerk: app already exists. New environments enable Apple + Google + Email magic link as auth methods (matches the iOS app so identities carry over) and set sign-in / sign-up paths to `/sign-in` / `/sign-up` (redirect fallback `/signup`).

## Marketing copy source of truth

All product-level positioning, taglines, problem statements, features, prices, and competitor benchmarks live in the parent `/CLAUDE.md`. Mirrored into `src/lib/content.ts`. Edit the parent first, then propagate. `APP_STORE_URL` in `content.ts` is a placeholder until the app ships.

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
