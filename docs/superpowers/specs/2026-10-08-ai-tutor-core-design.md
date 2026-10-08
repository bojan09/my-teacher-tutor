# AI Tutor Core — Design

Status: Approved
Date: 2026-10-08

## Context

Sub-project 2 of the Lexera platform build (Foundation and Lexera rebrand are done and committed). Adds the first real AI feature: a conversational English tutor that corrects the student's mistakes inline, matching the promise made by the landing-page hero demo.

## Decisions

- **Provider:** Anthropic Claude via the official TypeScript SDK (`@anthropic-ai/sdk`). Model is configurable via `ANTHROPIC_MODEL`, default `claude-sonnet-5`.
- **Mode:** free conversation with inline corrections. Scenarios, lessons, quizzes are later sub-projects.
- **Level:** student picks a CEFR level (A1–C2), stored on their Appwrite profile (`cefrLevel`, default `B1`), injected into the system prompt.
- **Corrections transport:** one streaming Claude call per turn. The model streams its conversational reply as text, then calls a `report_corrections` tool with structured corrections. No fenced-JSON parsing, no second API call.
- **Tests:** add Vitest (minimal config) for pure functions only: prompt builder, correction parsing/validation, rate limiter. Everything else is manual QA + `tsc`.
- **Commits:** none by the assistant. The repo owner manages git.

## Architecture

- `POST /api/tutor/chat` (Next route handler):
  1. Clerk auth (reject 401 if no `userId`).
  2. Validate body: `{ message: string }`, 1–1000 chars after trim.
  3. Rate limit per `userId` (in-memory sliding window, 20 messages / 10 minutes).
  4. `getOrCreateProfile` for level, `listRecentMessages` (last 20) for context.
  5. Call Claude with streaming, `report_corrections` tool, system prompt from `buildSystemPrompt(level)`.
  6. Forward text deltas to the client as a newline-delimited JSON event stream (`{type:"text",delta}`, `{type:"corrections",items}`, `{type:"done"}`, `{type:"error",message}`).
  7. After the stream ends, persist the user message (with corrections) and the assistant message.
- `ANTHROPIC_API_KEY` is server-only, read through `src/lib/env.ts`.
- All Appwrite access stays server-side, same as Foundation.

## Data model (Appwrite, database `english-tutor`)

`profiles` (existing): add attribute `cefrLevel` string(2), not required, default `B1`.

`messages` (new):

| Field | Type | Notes |
|---|---|---|
| `profileId` | string(36), required | Appwrite profile document `$id` |
| `role` | string(16), required | `user` or `assistant` |
| `content` | string(4000), required | Message text |
| `corrections` | string(8000), optional | JSON-encoded `Correction[]`, only on `user` messages |
| `createdAt` | datetime, required | |

Index: key index `profile_created` on (`profileId`, `createdAt`).

`Correction` shape: `{ original: string, corrected: string, explanation: string, category: "grammar"|"vocabulary"|"spelling"|"word-order"|"other" }`.

## Components

| File | Purpose |
|---|---|
| `src/lib/env.ts` | Add `anthropicApiKey()`, `anthropicModel()` (optional, default), `appwriteMessagesCollectionId()` |
| `src/lib/tutor/types.ts` | `Correction`, `TutorMessage`, `StreamEvent`, `CefrLevel` types |
| `src/lib/tutor/prompt.ts` | `buildSystemPrompt(level)` — teacher persona, level-aware, always correct gently, explain why, end with a follow-up question, concise |
| `src/lib/tutor/corrections.ts` | `REPORT_CORRECTIONS_TOOL` schema, `parseCorrections(input: unknown): Correction[]` (validates, drops malformed items) |
| `src/lib/tutor/rate-limit.ts` | `createRateLimiter({limit, windowMs})` returning `check(key): boolean` |
| `src/lib/tutor/claude.ts` | `streamTutorReply({system, history, message})` async generator yielding `StreamEvent`s |
| `src/lib/appwrite/messages.ts` | `listRecentMessages(profileId, limit)`, `saveMessages(profileId, [...])` |
| `src/lib/appwrite/profiles.ts` | Add `cefrLevel` to `Profile`, `updateCefrLevel(profileId, level)` |
| `src/app/api/tutor/chat/route.ts` | The route handler above |
| `src/app/api/tutor/level/route.ts` | `PATCH` to update the student's CEFR level (validated against the 6 levels) |
| `src/app/dashboard/tutor/page.tsx` | Protected server page: loads profile + recent messages, renders `ChatWindow` |
| `src/components/tutor/ChatWindow.tsx` | Client component: message list, input, streaming state, retry on error |
| `src/components/tutor/MessageBubble.tsx` | Student/tutor bubbles in Ink & Amber (same look as hero demo) |
| `src/components/tutor/CorrectionCard.tsx` | Shows original -> corrected + explanation under a student bubble |
| `src/components/tutor/LevelSelect.tsx` | CEFR dropdown calling the level route |
| `src/app/dashboard/page.tsx` | `ContinueCard` gets a "Talk to your tutor" link to `/dashboard/tutor` |
| `scripts/setup-appwrite.ts` | Extend (idempotently): `cefrLevel` attribute on `profiles`, `messages` collection + attributes + index |
| `vitest.config.ts`, `package.json` | Minimal Vitest setup, `npm test` script |
| `.env.local.example` | Document `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `APPWRITE_MESSAGES_COLLECTION_ID` |

## Error handling

- Missing env vars fail fast through `requireEnv`.
- Claude/Appwrite failure mid-request: route emits `{type:"error"}`; client shows an inline retry bubble. Nothing is persisted for a failed turn.
- Rate limit exceeded: 429 with a friendly message; client shows it inline.
- Malformed tool output: `parseCorrections` drops invalid items; if none valid, the turn proceeds with zero corrections.
- Client never receives raw stack traces or provider error bodies.

## Testing

Unit (Vitest): `buildSystemPrompt` includes the level and persona rules; `parseCorrections` accepts valid input, drops malformed items, handles non-array input; rate limiter allows `limit` calls then blocks, and resets after the window.

Manual QA (blocked until Clerk, Appwrite, and Anthropic keys exist): send a message with a deliberate mistake, verify streamed reply + correction card, reload and confirm history persists, change level and confirm tone shifts, send while signed out (401), exceed rate limit, simulate API failure (bad key) and verify retry UI, check mobile layout.

## Out of scope

Voice/pronunciation, scenarios, lessons and quizzes, vocabulary tracking, long-term learner memory/summaries, billing/usage dashboards, multi-conversation threads (single rolling conversation per student).

## Open items for the user

Create an Anthropic API key and set `ANTHROPIC_API_KEY` in `.env.local`, alongside the still-pending Clerk and Appwrite credentials.
