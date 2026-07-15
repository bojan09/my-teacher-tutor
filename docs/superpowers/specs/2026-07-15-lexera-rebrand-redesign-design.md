# Lexera Rebrand & Redesign — Design

Status: Approved
Date: 2026-07-15

## Context

Sub-project 5 of the platform build (per [2026-07-14-foundation-auth-backend-design.md](2026-07-14-foundation-auth-backend-design.md)'s decomposition), pulled forward ahead of the AI Tutor/Lessons sub-projects at the user's request: the site should feel professional and make someone want to learn *now*, on top of the existing landing page + the Foundation sub-project's bare-bones `/dashboard`.

Audit findings this design addresses (from the original repo audit):
- Brand mismatch: UI says "FluentEdge", page `<title>` says "Premium English Tutoring".
- Two conflicting Tailwind color configs (`globals.css` CSS vars vs. dead `tailwind.config.ts` palette).
- Placeholder copy (`[Your Origin]` in AboutMe.tsx).
- Broken apostrophe escaping bug in Methodology.tsx.
- Dead CTAs ("Book a Class", "Explore Course", etc.) with no `onClick`/`href`.
- Nav links to non-existent routes (`/courses`, `/methodology`, `/about`, `/pricing`, `/blog`).
- No shared `Logo` component (duplicated inline markup in Navbar/Footer).
- Dashboard page (built in Foundation sub-project) is a bare "Welcome, {email}" placeholder.

## Decisions (from visual brainstorming session)

- **Brand name**: Lexera (was FluentEdge/"Premium English Tutoring").
- **Color palette**: "Ink & Amber" — deep ink-navy primary (`#101425`), warm amber accent (`#F4B740`), soft off-white surface (`#F7F8FA`).
- **Typography**: All Roboto (headline + body + UI), replacing the current Inter/Playfair Display pairing.
- **Logo**: Open Book + Spark icon (book shape = learning, spark = AI-powered), paired with "Lexera" wordmark.
- **Landing hero**: Live AI Chat Preview — headline/CTA on the left, a static/scripted mini chat demo (student message with an error → AI correction bubble) on the right. This proves the product's value in the first few seconds. The demo is **scripted, not a real AI call** — the AI Tutor sub-project hasn't been built yet; this is a fixed example conversation, not a live API integration.
- **Dashboard layout**: "Continue" First, Stats Second — one unmissable dark hero card ("Continue where you left off" + progress bar), streak pill in the header, smaller stat cards below (vocabulary, speaking sessions). Since the Lessons/Progress data models don't exist yet, stats render **realistic placeholder content** (not live data), but the components are built to accept real data via props so a later sub-project can wire them up without a rewrite.

## Scope

**In scope:**
1. Design system: Ink & Amber color tokens (single source of truth, replacing both current conflicting token sets), Roboto font, spacing/radius conventions kept from existing `--radius` token.
2. Shared `Logo` component (Open Book + Spark SVG + wordmark).
3. Landing page restyle in place (not a rewrite): existing sections (`Hero`, `Navbar`, `Footer`, `AboutMe`, `Methodology`, `ClassesOverview`, `Testimonials`, `TrustBar`, `FinalCTA`) get the new palette/typography/logo, plus every bug found in the audit fixed:
   - Nav links trimmed to routes that actually exist (`/`, `/sign-in`, `/sign-up`, in-page anchors) — no more 404 links to `/courses`, `/methodology` (as a route), `/about`, `/pricing`, `/blog`.
   - All CTAs get real destinations: primary CTAs ("Book a Free Trial", "Start learning", etc.) → `/sign-up`; secondary CTAs that had no real target get removed or repointed to an in-page anchor, not left dead.
   - `[Your Origin]` placeholder text replaced with genuine (if generic) copy.
   - Apostrophe escaping bug in Methodology.tsx fixed.
   - Footer social links: left as `href="#"` is not acceptable to ship; either remove the icons or point them at real (or omitted) targets — decision: **remove social icons** rather than fabricate fake URLs, since no real social accounts exist yet.
   - Hardcoded footer copyright year fixed to read the current year dynamically.
4. Dashboard rebuild: `ContinueCard` + `StatCard` components, new dashboard layout, placeholder content clearly structured for future real-data wiring.
5. Metadata fix: page `<title>`/`description` updated to match "Lexera" branding, basic Open Graph tags added.

**Out of scope (deferred to later sub-projects):**
- Real AI chat functionality (hero demo is static/scripted).
- Real lesson/quiz/progress data (dashboard stats are placeholder).
- New page routes beyond what exists today (no new `/courses`, `/pricing` pages built — those nav links are removed, not filled in, until a later sub-project actually builds that content).
- Gamification logic (only the streak pill's visual design, no actual streak-tracking logic).
- Booking/calendar system (the unused `calendar.tsx`/`popover.tsx` shadcn components stay unused for now — no booking flow built).

## Architecture

- Tailwind v4 CSS-first `@theme` block in `globals.css` remains the single source of color tokens. The legacy `tailwind.config.ts` color palette (unused, conflicting) is deleted from that file — keep `tailwind.config.ts` only for the parts Tailwind v4 still needs (if any; content globs need fixing regardless, since they reference a nonexistent `src/pages`).
- `Logo` becomes a real shared component (`src/components/Logo.tsx`) imported by both `Navbar` and `Footer`, replacing duplicated inline markup — this is a targeted fix to existing duplication encountered while doing this work, in line with "improve code you're touching."
- Dashboard components live under `src/components/dashboard/` (new directory), separate from the marketing `src/components/sections/`.

## Components

| File | Change |
|---|---|
| `src/app/globals.css` | Replace color tokens with Ink & Amber palette (light + dark variants); swap font imports to Roboto |
| `src/app/layout.tsx` | Swap `Inter`/`Playfair_Display` font loading for `Roboto`; update `metadata` title/description to Lexera branding + basic OG tags |
| `tailwind.config.ts` | Remove dead/conflicting `brand.*` color extension and the nonexistent `src/pages` content glob |
| `src/components/Logo.tsx` | New — Open Book + Spark SVG + "Lexera" wordmark, sized via props |
| `src/components/layout/Navbar.tsx` | Use `Logo`; fix nav links to real routes/anchors only; fix CTA to link to `/sign-up` |
| `src/components/layout/Footer.tsx` | Use `Logo`; remove placeholder `href="#"` social icons and dead link columns; dynamic copyright year |
| `src/components/sections/Hero.tsx` | New layout: headline/CTA left, scripted chat-preview mockup right; CTA links to `/sign-up` |
| `src/components/sections/AboutMe.tsx` | Replace `[Your Origin]` placeholder copy; restyle to new tokens |
| `src/components/sections/Methodology.tsx` | Fix apostrophe escaping bug; restyle |
| `src/components/sections/ClassesOverview.tsx`, `Testimonials.tsx`, `TrustBar.tsx`, `FinalCTA.tsx` | Restyle to new tokens; fix any dead CTAs found (link to `/sign-up` or remove) |
| `src/components/dashboard/ContinueCard.tsx` | New — dark hero card, "Continue where you left off" + progress bar, accepts `{ lessonTitle, progressPercent }` props with sensible placeholder defaults |
| `src/components/dashboard/StatCard.tsx` | New — small stat card (label + value), accepts `{ label, value }` props |
| `src/app/dashboard/page.tsx` | Rebuilt using `ContinueCard`/`StatCard` with placeholder data; keeps existing `getOrCreateProfile` call and error-fallback behavior from the Foundation sub-project unchanged |

## Data flow

No new data flow — this sub-project is presentation-layer only. The dashboard page still calls `getOrCreateProfile` exactly as built in Foundation; the new components just render around that existing call. Placeholder stat values are hardcoded constants in `dashboard/page.tsx`, passed as props — not fetched from anywhere, since no lesson/progress backend exists yet.

## Error handling

No new error paths introduced. Existing dashboard error fallback (from Foundation sub-project) is preserved unchanged.

## Testing (manual QA — no automated test framework, consistent with Foundation sub-project's approach)

1. Visit `/` — verify Lexera branding (logo, name) appears in Navbar and Footer, new Ink & Amber colors applied, Roboto font rendering.
2. Click every nav link and CTA on the landing page — verify none 404 and none are dead (`href="#"` or no handler).
3. Verify hero chat-preview mockup renders (static content, not a live API call — no network request should fire for it).
4. Verify AboutMe section has no `[Your Origin]` placeholder text.
5. Verify Methodology section's apostrophe renders correctly (no stray backticks/entities).
6. Verify footer shows the current year, not a hardcoded stale one.
7. Visit `/dashboard` (requires being signed in, per Foundation sub-project's middleware) — verify "Continue" card and stat cards render with placeholder content, layout matches the approved mockup direction.
8. Resize to mobile width — verify landing page and dashboard don't break (no horizontal scroll, readable text, tappable CTAs).
9. Run `npx tsc --noEmit` — no new type errors beyond the one pre-existing unrelated error already tracked (`Hero.tsx` missing image module — expected to be resolved as part of this redesign since Hero.tsx is being rebuilt anyway).

## Open items requiring user action (not Claude)

- None — this sub-project doesn't require third-party credentials, unlike Foundation. Fully buildable now.
