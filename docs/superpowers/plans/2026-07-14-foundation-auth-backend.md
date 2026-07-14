# Foundation: Auth + Backend Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Clerk auth and an Appwrite-backed `profiles` collection into the existing Next.js landing page, producing a working protected `/dashboard` route that lazily provisions an Appwrite profile document for each signed-in Clerk user.

**Architecture:** Clerk owns authentication (provider, middleware, hosted sign-in/up pages). Appwrite (server SDK only, via a server-only API key) owns the `profiles` collection. All Appwrite access happens in server-side code (Server Components), never in the browser. `middleware.ts` protects `/dashboard/*`.

**Tech Stack:** Next.js 16 (App Router), React 19, `@clerk/nextjs` (already a dependency), `node-appwrite` (server SDK, to be added), TypeScript.

**No automated test framework exists in this repo yet** (confirmed during audit). Per the approved spec, this phase uses manual QA, not unit tests. Each task ends with a concrete manual verification step instead of a test-runner step. Do not introduce a test framework as part of this plan — that's a separate decision, out of scope here (YAGNI).

---

## Prerequisites (user-supplied, blocks live verification but not code-writing)

The engineer executing this plan can write and lint all code without live credentials. Tasks that require actually running the app against real Clerk/Appwrite (Task 6 onward's manual QA) are blocked until the user supplies:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (from clerk.com)
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` (from cloud.appwrite.io)

If these are not yet available, complete all tasks through Task 5, then stop and report that Task 6+ (setup script run + manual QA) needs credentials before it can be verified live.

---

### Task 1: Add Appwrite server SDK dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the Appwrite Node (server) SDK**

Run: `npm install node-appwrite`

Expected: `package.json` and `package-lock.json` gain a `node-appwrite` entry, install succeeds with no errors.

- [ ] **Step 2: Verify install**

Run: `npm ls node-appwrite`

Expected output: shows `node-appwrite@<version>` with no `UNMET DEPENDENCY` warning.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add node-appwrite server SDK dependency"
```

---

### Task 2: Environment variable scaffolding with fail-fast validation

**Files:**
- Create: `.env.local.example`
- Create: `src/lib/env.ts`

- [ ] **Step 1: Create the example env file (documents required vars, no real values)**

```
# Clerk (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Appwrite (https://cloud.appwrite.io)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=english-tutor
APPWRITE_PROFILES_COLLECTION_ID=profiles
```

- [ ] **Step 2: Create a fail-fast env accessor**

```typescript
// src/lib/env.ts
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  clerkPublishableKey: () => requireEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: () => requireEnv("CLERK_SECRET_KEY"),
  appwriteEndpoint: () => requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"),
  appwriteProjectId: () => requireEnv("APPWRITE_PROJECT_ID"),
  appwriteApiKey: () => requireEnv("APPWRITE_API_KEY"),
  appwriteDatabaseId: () => requireEnv("APPWRITE_DATABASE_ID"),
  appwriteProfilesCollectionId: () =>
    requireEnv("APPWRITE_PROFILES_COLLECTION_ID"),
};
```

Note: `requireEnv` throws lazily (called at point of use, not at module load), so importing `env` never crashes a route that doesn't need a particular var yet — but any route that calls e.g. `env.appwriteApiKey()` without it set fails immediately and loudly instead of silently receiving `undefined`.

- [ ] **Step 3: Add `.env.local` to `.gitignore` if not already present**

Check `.gitignore` for a `.env*` or `.env.local` entry. Standard Next.js `.gitignore` (from `create-next-app`) already includes `.env*`. Verify with:

Run: `grep -n "env" .gitignore`

Expected: a line matching `.env*` is present. If absent, add it.

- [ ] **Step 4: Manual verification**

Run: `node -e "require('./src/lib/env.ts')"` will fail (TS not transpiled directly) — instead verify by TypeScript compilation:

Run: `npx tsc --noEmit`

Expected: no type errors introduced by `src/lib/env.ts`.

- [ ] **Step 5: Commit**

```bash
git add .env.local.example src/lib/env.ts .gitignore
git commit -m "feat: add env var scaffolding with fail-fast validation"
```

---

### Task 3: Wire Clerk provider and middleware

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/middleware.ts`

- [ ] **Step 1: Read current layout to preserve existing structure**

Read `src/app/layout.tsx` in full before editing (it currently sets up fonts, `ThemeProvider`, metadata — do not remove any of that).

- [ ] **Step 2: Wrap the app in `<ClerkProvider>`**

Edit `src/app/layout.tsx`: add `import { ClerkProvider } from "@clerk/nextjs";` at the top, and wrap the existing `<html>` return value with `<ClerkProvider>` as the outermost element. Example shape (adapt to the existing JSX exactly as found — do not restructure fonts/ThemeProvider):

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* existing <body> with fonts/ThemeProvider/children exactly as before */}
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 3: Create Clerk middleware protecting `/dashboard`**

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- [ ] **Step 4: Manual verification**

Run: `npx tsc --noEmit`

Expected: no type errors. (Live behavior — redirect to sign-in — is verified in Task 7 once credentials exist.)

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/middleware.ts
git commit -m "feat: wire Clerk provider and route protection middleware"
```

---

### Task 4: Clerk sign-in / sign-up pages

**Files:**
- Create: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `src/app/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Create sign-in page**

```tsx
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

- [ ] **Step 2: Create sign-up page**

```tsx
// src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npx tsc --noEmit`

Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/sign-in" "src/app/sign-up"
git commit -m "feat: add Clerk sign-in and sign-up pages"
```

---

### Task 5: Appwrite server client and profile lazy-upsert

**Files:**
- Create: `src/lib/appwrite/client.ts`
- Create: `src/lib/appwrite/profiles.ts`

- [ ] **Step 1: Create the server-only Appwrite client**

```typescript
// src/lib/appwrite/client.ts
import "server-only";
import { Client, Databases } from "node-appwrite";
import { env } from "@/lib/env";

export function getAppwriteClient(): Client {
  return new Client()
    .setEndpoint(env.appwriteEndpoint())
    .setProject(env.appwriteProjectId())
    .setKey(env.appwriteApiKey());
}

export function getDatabases(): Databases {
  return new Databases(getAppwriteClient());
}
```

The `server-only` import throws a build-time error if this module is ever imported
from client-side code, which is the enforcement mechanism for "Appwrite API key
never reaches the browser." Add `server-only` as a dependency if not already
present: run `npm install server-only` before this step if `npm ls server-only`
shows it missing.

- [ ] **Step 2: Create the profile type and lazy-upsert function**

```typescript
// src/lib/appwrite/profiles.ts
import { ID, Query } from "node-appwrite";
import { getDatabases } from "@/lib/appwrite/client";
import { env } from "@/lib/env";

export interface Profile {
  $id: string;
  clerkUserId: string;
  email: string;
  createdAt: string;
}

export async function getOrCreateProfile(
  clerkUserId: string,
  email: string,
): Promise<Profile> {
  const databases = getDatabases();
  const databaseId = env.appwriteDatabaseId();
  const collectionId = env.appwriteProfilesCollectionId();

  const existing = await databases.listDocuments(databaseId, collectionId, [
    Query.equal("clerkUserId", clerkUserId),
  ]);

  if (existing.documents.length > 0) {
    return existing.documents[0] as unknown as Profile;
  }

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      clerkUserId,
      email,
      createdAt: new Date().toISOString(),
    },
  );

  return created as unknown as Profile;
}
```

- [ ] **Step 3: Manual verification**

Run: `npx tsc --noEmit`

Expected: no type errors. Live behavior (actual Appwrite round-trip) is verified in Task 7 once credentials and the collection exist.

- [ ] **Step 4: Commit**

```bash
git add src/lib/appwrite
git commit -m "feat: add server-only Appwrite client and profile lazy-upsert"
```

---

### Task 6: Appwrite database/collection setup script

**Files:**
- Create: `scripts/setup-appwrite.ts`
- Modify: `package.json` (add script entry)

This script is what actually creates the `english-tutor` database and `profiles`
collection in Appwrite. It's idempotent (safe to re-run) — it checks for existence
before creating.

- [ ] **Step 1: Write the setup script**

```typescript
// scripts/setup-appwrite.ts
import { Client, Databases, IndexType, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID ?? "english-tutor";
const collectionId = process.env.APPWRITE_PROFILES_COLLECTION_ID ?? "profiles";

if (!endpoint || !projectId || !apiKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY in environment",
  );
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function ensureDatabase() {
  try {
    await databases.get(databaseId);
    console.log(`Database "${databaseId}" already exists.`);
  } catch {
    await databases.create(databaseId, "English Tutor");
    console.log(`Created database "${databaseId}".`);
  }
}

async function ensureProfilesCollection() {
  try {
    await databases.getCollection(databaseId, collectionId);
    console.log(`Collection "${collectionId}" already exists.`);
    return;
  } catch {
    // fall through to create
  }

  await databases.createCollection(
    databaseId,
    collectionId,
    "Profiles",
    [Permission.read(Role.any()), Permission.write(Role.any())],
  );
  await databases.createStringAttribute(databaseId, collectionId, "clerkUserId", 255, true);
  await databases.createStringAttribute(databaseId, collectionId, "email", 320, true);
  await databases.createDatetimeAttribute(databaseId, collectionId, "createdAt", true);
  console.log(`Created collection "${collectionId}" with attributes.`);

  // Attributes must finish provisioning before an index can reference them;
  // Appwrite attribute creation is async server-side.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await databases.createIndex(
    databaseId,
    collectionId,
    "clerkUserId_unique",
    IndexType.Unique,
    ["clerkUserId"],
  );
  console.log("Created unique index on clerkUserId.");
}

async function main() {
  await ensureDatabase();
  await ensureProfilesCollection();
  console.log("Appwrite setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Note on permissions: `Permission.read(Role.any())`/`write(Role.any())` at the
collection level is intentionally permissive for this foundation phase because all
writes go through the server-only API key (Task 5's `getDatabases()`), not
end-user sessions — the API key bypasses document-level permissions entirely. If a
later phase adds client-side Appwrite session access, tighten this to
per-document ownership permissions at that point.

- [ ] **Step 2: Add an npm script to run it**

Modify `package.json` `"scripts"` block, add:

```json
"setup:appwrite": "tsx scripts/setup-appwrite.ts"
```

Install `tsx` if not present: run `npm install --save-dev tsx` and check with `npm ls tsx`.

- [ ] **Step 3: Manual verification (requires credentials — see Prerequisites)**

Once the user has supplied Appwrite credentials in `.env.local`:

Run: `npm run setup:appwrite`

Expected output ends with `Appwrite setup complete.` and no thrown error. Verify in
the Appwrite Cloud console that database `english-tutor` and collection `profiles`
exist with `clerkUserId` (string, unique index), `email` (string), `createdAt`
(datetime) attributes.

If credentials are not yet available, stop here and report this task is written
but not yet run.

- [ ] **Step 4: Commit**

```bash
git add scripts/setup-appwrite.ts package.json package-lock.json
git commit -m "feat: add idempotent Appwrite database/collection setup script"
```

---

### Task 7: Protected dashboard page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Write the dashboard page**

```tsx
// src/app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "@/lib/appwrite/profiles";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    // Middleware should already block this, but keep the page safe standalone.
    return null;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "unknown";

  let profileError = false;
  let profile;
  try {
    profile = await getOrCreateProfile(userId, email);
  } catch (err) {
    console.error("Failed to load/create profile:", err);
    profileError = true;
  }

  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>We couldn&apos;t load your profile. Please try again shortly.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Welcome, {profile.email}</p>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `npx tsc --noEmit`

Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard
git commit -m "feat: add protected dashboard page with profile lazy-upsert"
```

---

### Task 8: End-to-end manual QA (requires credentials — see Prerequisites)

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Fresh sign-up flow**

In a browser, visit `/sign-up`, create a new account. Expect redirect behavior
leads to `/dashboard` (Clerk's default post-sign-up redirect, or navigate there
manually if not auto-redirected) showing "Welcome, {email}".

- [ ] **Step 3: Verify Appwrite profile created**

In the Appwrite Cloud console, open the `profiles` collection. Confirm exactly one
document exists with `clerkUserId` matching the new user and the correct `email`.

- [ ] **Step 4: Sign out and back in — no duplicate**

Sign out, sign back in with the same account, revisit `/dashboard`. Confirm it
still shows "Welcome, {email}" and the Appwrite console still shows exactly one
document for that `clerkUserId` (no duplicate created).

- [ ] **Step 5: Unauthenticated redirect**

Sign out. Visit `/dashboard` directly. Confirm redirect to `/sign-in` (not a 500
error or blank page).

- [ ] **Step 6: Check browser console and network tab**

Confirm no uncaught errors in the browser console during the whole flow, and no
failed (4xx/5xx) network requests unrelated to expected auth redirects.

- [ ] **Step 7: Report results**

If any step fails, treat it as a bug: diagnose root cause (per systematic-debugging
skill if non-obvious), fix, re-run this task's steps 2-6 from the start. Do not
mark this task complete until all six checks pass.

---

## Plan self-review notes

- **Spec coverage:** Architecture ✅ (Task 3, 5), Components table ✅ (every file in
  the spec's component table has a corresponding task), Data model ✅ (Task 6),
  Data flow ✅ (Task 7 implements steps 1-5 of spec's data flow), Error handling ✅
  (Task 2 fail-fast env, Task 7 try/catch + fallback UI), Testing ✅ (Task 8 mirrors
  spec's manual QA list exactly).
- **Placeholder scan:** none found — all steps have complete code or exact
  commands.
- **Type consistency:** `Profile` interface (Task 5) fields (`clerkUserId`,
  `email`, `createdAt`, `$id`) match the Appwrite attributes created in Task 6 and
  the object shape written in `getOrCreateProfile`'s `createDocument` call.
  `getOrCreateProfile(clerkUserId, email)` signature matches its call site in Task
  7's `dashboard/page.tsx`.
