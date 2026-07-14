# Foundation: Auth + Backend Wiring — Design

Status: Approved
Date: 2026-07-14

## Context

`my-english-tutor` (repo: my-teacher-tutor) is currently a static Next.js marketing
landing page with no backend, no auth, no AI, and no lesson/quiz functionality.
This is sub-project 1 of a larger platform build:

1. **Foundation** (this spec) — auth + backend wiring
2. AI Tutor core (chat)
3. Lessons/Exercises/Quiz engine
4. Progress/Gamification
5. Redesign/branding pass

Each sub-project gets its own spec → plan → build cycle. This spec covers only
Foundation.

## Decisions

- **Auth provider**: Clerk (already an installed, unused dependency).
- **Backend/data provider**: Appwrite (database + storage). Not used for auth.
- **Appwrite instance**: does not exist yet — Appwrite Cloud project must be created.
- **Clerk instance**: does not exist yet — Clerk application must be created.
- **Profile sync strategy**: lazy upsert on first authenticated request (no webhook).

Both third-party account creations are user actions (sign-up flows Claude cannot
perform on the user's behalf). The user creates the accounts and supplies credentials
via `.env.local`.

## Architecture

- Clerk owns authentication: `<ClerkProvider>`, `middleware.ts` route protection,
  Clerk-hosted sign-in/sign-up pages.
- Appwrite owns data: a `profiles` collection now; `lessons`, `progress`, etc. in
  later sub-projects.
- All Appwrite access goes through server-side code (API routes / Server Components)
  using a server-only Appwrite API key. No client-side Appwrite SDK usage with
  end-user credentials in this phase — keeps the API key off the client and gives a
  single enforcement point for authorization.
- `middleware.ts` (Clerk) protects `/dashboard/*`, redirecting unauthenticated
  requests to `/sign-in`.

## Components

| File | Purpose |
|---|---|
| `src/middleware.ts` | Clerk middleware protecting `/dashboard/*` |
| `src/app/layout.tsx` | Wrap app in `<ClerkProvider>` |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Clerk hosted sign-in |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Clerk hosted sign-up |
| `src/lib/appwrite/client.ts` | Server-only Appwrite SDK client (Client + Databases, built from API key) |
| `src/lib/appwrite/profiles.ts` | `getOrCreateProfile(clerkUserId, email)` — lazy upsert |
| `src/app/dashboard/page.tsx` | Protected Server Component; calls `getOrCreateProfile`, renders profile |
| `.env.local.example` | Documents required env vars (not committed with real values) |

## Data model

Appwrite database `english-tutor`, collection `profiles`:

| Field | Type | Notes |
|---|---|---|
| `clerkUserId` | string, indexed/unique | Links to Clerk user |
| `email` | string | From Clerk |
| `createdAt` | datetime | Set on creation |

## Data flow

1. User signs up/in via Clerk-hosted pages → session cookie set.
2. Request to `/dashboard` passes Clerk middleware (authenticated) or is redirected
   to `/sign-in` (unauthenticated).
3. `dashboard/page.tsx` (Server Component) reads `auth()` → `userId`, and Clerk user
   email.
4. Calls `getOrCreateProfile(userId, email)`:
   - Query `profiles` where `clerkUserId == userId`.
   - If found, return it.
   - If not found, create `{ clerkUserId, email, createdAt: now }`, return it.
5. Page renders "Welcome, {email}".

## Error handling

- Missing/invalid required env vars (Clerk keys, Appwrite endpoint/project/API
  key/DB/collection IDs) → fail fast at startup with a clear thrown error, not a
  silent `undefined` access later.
- Appwrite query/create failure in `getOrCreateProfile` → caught and logged
  server-side; dashboard renders a generic "couldn't load your profile" fallback
  state instead of an unhandled exception/stack trace.
- Clerk unconfigured → middleware blocks all protected routes by construction; the
  env var docs make the required setup explicit.

## Testing (manual QA, per project workflow — no automated test framework exists yet)

1. Sign up as a new user → redirected to `/dashboard`.
2. Appwrite console shows a new `profiles` document for that user.
3. Sign out, sign back in → `/dashboard` loads, no duplicate profile document
   created.
4. Visit `/dashboard` while signed out → redirected to `/sign-in`.
5. Visit `/sign-in` while already signed in → Clerk's default behavior (redirect to
   dashboard) — verify it doesn't loop or error.

## Out of scope (deferred to later sub-projects)

- AI chat/tutor functionality.
- Lessons, exercises, quizzes, progress tracking data models.
- Gamification.
- Visual redesign/branding (landing page bugs are fixed separately, outside this
  spec, as low-risk cleanup).
- Clerk webhook-based sync (lazy upsert chosen instead).
- Automated tests.

## Open items requiring user action (not Claude)

- Create Appwrite Cloud project → obtain endpoint, project ID, API key.
- Create Appwrite database + `profiles` collection (or Claude scripts this via
  Appwrite server SDK once API key is supplied).
- Create Clerk application → obtain publishable key + secret key.
- Supply all of the above as environment variables in `.env.local`.
