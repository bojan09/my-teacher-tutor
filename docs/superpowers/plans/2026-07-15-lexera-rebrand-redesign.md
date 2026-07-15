# Lexera Rebrand & Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the landing page from "FluentEdge"/"Premium English Tutoring" to "Lexera" with a new Ink & Amber design system and Roboto typography, fix every dead link/CTA/bug found in the original audit, rebuild the hero with a scripted AI-chat-preview, and rebuild the placeholder dashboard into a "Continue First" layout.

**Architecture:** Presentation-layer only — no new data flow. Color tokens and fonts are centralized in `globals.css`/`tailwind.config.ts` (single source of truth), a new shared `Logo` component replaces duplicated inline markup, and two new small dashboard components (`ContinueCard`, `StatCard`) render around the existing `getOrCreateProfile` call unchanged.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (CSS-first `@theme`), TypeScript, `lucide-react` icons, `next/font/google`.

**No automated test framework exists in this repo.** Consistent with the Foundation sub-project, this plan uses `npx tsc --noEmit` per task plus a final manual QA task — no unit tests are introduced (YAGNI, matches the approved spec).

---

### Task 1: Ink & Amber design tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the full file content**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-brand-deep: var(--brand-deep);
  --color-brand-light: var(--brand-light);
  --color-brand-action: var(--brand-action);
  --color-brand-action-foreground: var(--brand-action-foreground);
  --color-brand-slate: var(--brand-slate);
  --color-brand-mint: var(--brand-mint);
  --color-ink: var(--ink);
  --color-paper: var(--paper);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
  --font-serif: var(--font-roboto);
  --font-sans: var(--font-roboto);
}

:root {
  /* Constants: always ink-dark / always paper-light, regardless of theme.
     Used for elements (like the dashboard "continue" card) that are
     intentionally a fixed dark surface in both light and dark mode. */
  --ink: #101425;
  --paper: #f7f8fa;

  /* LIGHT MODE - Ink & Amber */
  --brand-deep: #101425;
  --brand-light: #f7f8fa;
  --brand-mint: #eceef2;
  --brand-action: #f4b740;
  --brand-action-foreground: #101425;
  --brand-slate: #4b5160;

  --background: var(--brand-light);
  --foreground: var(--brand-deep);
  --primary: var(--brand-deep);
  --primary-foreground: #ffffff;
  --border: #e3e6ea;
  --radius: 0.75rem;
}

/* DARK MODE - Ink & Amber (inverted) */
.dark {
  --brand-deep: #f7f8fa; /* Off-white text on dark surfaces */
  --brand-light: #0b0e1a; /* Near-black ink base */
  --brand-mint: #161b2e; /* Elevated dark surface */
  --brand-action: #f4b740; /* Amber stays constant across modes */
  --brand-action-foreground: #101425; /* Always dark ink on amber, for contrast */
  --brand-slate: #a7adbb;

  --background: var(--brand-light);
  --foreground: var(--brand-deep);
  --primary: var(--brand-action);
  --primary-foreground: #101425;
  --border: #262b3d;
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    @apply antialiased transition-colors duration-500;
  }
  button {
    cursor: pointer !important;
  }
  .reveal-item {
    opacity: 0;
  }
}
```

Note on `--brand-action-foreground`: the amber accent (`#f4b740`) is light in both modes, so text on top of it must always be dark ink for WCAG contrast — that's why this token is a fixed value, not remapped per-theme like the others. Every existing `bg-brand-action text-white` button pattern in the codebase is switched to `bg-brand-action text-brand-action-foreground` in later tasks — `text-white` on amber fails contrast and must not survive this redesign.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: same pre-existing error as before (`Hero.tsx` missing image module — will be fixed in Task 7) and no new errors. CSS isn't type-checked by `tsc`, so also start the dev server briefly to confirm no CSS parse errors:

Run: `npm run dev` (in background/separate terminal), then `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` — expected `200`. Stop the dev server after.

- [ ] **Step 3: Stage (DO NOT COMMIT — repo owner manages git manually)**

```bash
git add src/app/globals.css
```

---

### Task 2: Clean up tailwind.config.ts

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the full file content**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-roboto)", "sans-serif"],
        sans: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

This removes the dead/conflicting `brand.navy/cream/accent/sky/slate` color palette (never consumed anywhere — the actual site uses the CSS-variable tokens from `globals.css`) and the `./src/pages/**/*` content glob (that directory doesn't exist in this App-Router-only project).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Stage**

```bash
git add tailwind.config.ts
```

---

### Task 3: Roboto font + Lexera metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the full file content**

```tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Lexera — AI-Powered English Tutoring",
  description:
    "Personalized AI English lessons that adapt to how you actually learn.",
  openGraph: {
    title: "Lexera — AI-Powered English Tutoring",
    description:
      "Personalized AI English lessons that adapt to how you actually learn.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${roboto.variable} font-sans overflow-x-hidden w-full antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Stage**

```bash
git add src/app/layout.tsx
```

---

### Task 4: Shared Logo component

**Files:**
- Create: `src/components/Logo.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/Logo.tsx
interface LogoProps {
  className?: string;
  iconSize?: number;
}

export default function Logo({ className = "", iconSize = 32 }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path
          d="M6 10 C6 8 8 6 12 6 L18 6 L18 32 L12 32 C8 32 6 30 6 28 Z"
          fill="var(--brand-action)"
        />
        <path
          d="M34 10 C34 8 32 6 28 6 L22 6 L22 32 L28 32 C32 32 34 30 34 28 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M20 4 L22 9 L27 9 L23 12 L24.5 17 L20 14 L15.5 17 L17 12 L13 9 L18 9 Z"
          fill="var(--brand-action)"
        />
      </svg>
      <span className="font-bold text-2xl tracking-tight">Lexera</span>
    </span>
  );
}
```

The book's left leaf uses the amber accent, the right leaf uses `currentColor` (so it inherits whatever text color the parent sets — dark ink on light backgrounds, off-white on dark backgrounds, matching how `Navbar`/`Footer` already color their logo text), and the spark stays amber in both leaves' context.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Stage**

```bash
git add src/components/Logo.tsx
```

---

### Task 5: Navbar rebrand + link fixes

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Replace the full file content**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return <div className="h-20" aria-hidden="true" />;

  // Every link here points at a section that actually exists on the page
  // (in-page anchors) or a real route (/sign-in). No links to unbuilt pages.
  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Methodology", href: "#methodology" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "bg-background/95 backdrop-blur-md border-b py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-foreground z-50"
          >
            <Logo />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-8 font-medium text-foreground/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-brand-action transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors z-50"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-brand-action" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              href="/sign-in"
              className="hidden sm:block text-sm font-medium text-foreground/80 hover:text-brand-action transition-colors"
            >
              Sign In
            </Link>

            {/* Desktop CTA */}
            <Link
              href="/sign-up"
              className="hidden sm:block px-5 py-2.5 bg-brand-action text-brand-action-foreground rounded-lg font-bold hover:brightness-110 shadow-md"
            >
              Start Learning
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden p-2 text-foreground z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-transform duration-500 lg:hidden ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-brand-action transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/sign-in"
            onClick={() => setMobileMenuOpen(false)}
            className="text-foreground hover:text-brand-action transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 px-8 py-4 bg-brand-action text-brand-action-foreground rounded-xl font-bold text-lg"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Stage**

```bash
git add src/components/layout/Navbar.tsx
```

---

### Task 6: Footer rebrand + remove fabricated links

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace the full file content**

```tsx
import Link from "next/link";
import Logo from "@/components/Logo";

const navigationLinks = [
  { name: "About", href: "#about" },
  { name: "Methodology", href: "#methodology" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-light dark:bg-white/[0.02] border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="text-foreground mb-6">
              <Logo />
            </div>
            <p className="text-brand-slate text-sm leading-relaxed mb-6 max-w-sm">
              Personalized AI English lessons that adapt to how you actually
              learn. Bridging the gap between knowledge and confidence.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground mb-8">
              Navigation
            </h4>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-slate hover:text-brand-action transition-colors font-medium tracking-tight"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-60">
            &copy; {year} Lexera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

This removes the "Resources" and "Legal" columns (all `href="#"`, pointing at pages that don't exist — `/blog`, privacy policy, terms, etc. are not built) and the social media icons (also all `href="#"`, no real social accounts exist). Per the approved spec, fabricated destinations are removed rather than shipped as dead links. The "Navigation" column now matches the same real in-page anchors as `Navbar`.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors. (The `GraduationCap`, `Instagram`, `Linkedin`, `Twitter` imports are gone — confirm no unused-import lint error either: run `npx eslint src/components/layout/Footer.tsx` if you want, but `tsc` is the required gate here.)

- [ ] **Step 3: Stage**

```bash
git add src/components/layout/Footer.tsx
```

---

### Task 7: Hero rebuild — live AI chat preview

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Files no longer used by this component after this task** (do not delete them — they may still be referenced by unrelated code, this task only stops importing them from Hero): `public/imgs/teacher_img.png` (was already a broken/missing-module import causing the pre-existing `tsc` error — this task removes that import, resolving the error).

- [ ] **Step 1: Replace the full file content**

```tsx
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden py-24 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-brand-mint),transparent_60%)] opacity-50 dark:opacity-20" />

      <div className="container mx-auto px-6 pl-10 lg:pl-16 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="max-w-xl">
          <Reveal direction="up" cascade>
            <div className="reveal-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-action/10 text-brand-action text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-brand-action/20">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-action animate-pulse" />
              AI-Powered English Tutoring
            </div>

            <h1 className="reveal-item text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Speak English <br />
              <span className="text-brand-action">with confidence.</span>
            </h1>

            <p className="reveal-item text-base lg:text-lg text-brand-slate mb-10 leading-relaxed max-w-md">
              Personalized AI lessons that adapt to how you actually learn —
              real-time corrections, real conversations, real progress.
            </p>

            <div className="reveal-item flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="px-7 py-4 bg-brand-action text-brand-action-foreground rounded-lg font-bold uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-lg shadow-brand-action/20 active:scale-95 text-center"
              >
                Start Learning
              </Link>
              <a
                href="#methodology"
                className="px-7 py-4 border border-foreground/20 text-foreground rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-foreground hover:text-background transition-all active:scale-95 text-center"
              >
                See How It Works
              </a>
            </div>
          </Reveal>
        </div>

        {/* CHAT PREVIEW MOCKUP — static/scripted example, not a live AI call */}
        <Reveal direction="left" delay={0.4}>
          <div className="relative w-full max-w-[420px] mx-auto lg:ml-auto">
            <div className="absolute inset-0 bg-brand-mint translate-x-4 translate-y-4 rounded-2xl z-0" />

            <div className="relative rounded-2xl border-2 border-white/10 shadow-2xl z-10 bg-ink p-5">
              <div className="flex items-center gap-2 mb-4 text-paper/50 text-xs font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-brand-action" />
                Lexera AI Tutor
              </div>

              <div className="flex flex-col gap-3">
                <div className="self-start max-w-[80%] bg-white/10 text-paper text-sm rounded-2xl rounded-bl-sm px-4 py-3">
                  I goed to the store yesterday
                </div>
                <div className="self-end max-w-[85%] bg-brand-action text-brand-action-foreground text-sm font-semibold rounded-2xl rounded-br-sm px-4 py-3">
                  Almost! Try &quot;went&quot; — it&apos;s an irregular past
                  tense. ✓
                </div>
                <div className="self-start max-w-[80%] bg-white/10 text-paper text-sm rounded-2xl rounded-bl-sm px-4 py-3">
                  I went to the store yesterday!
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: **zero errors** — this task removes the `teacher_img` import that was the source of the one pre-existing known error, so the full project should now be clean.

- [ ] **Step 3: Stage**

```bash
git add src/components/sections/Hero.tsx
```

---

### Task 8: AboutMe copy fix + dead CTA removal

**Files:**
- Modify: `src/components/sections/AboutMe.tsx`

- [ ] **Step 1: Fix the placeholder copy**

Find this text (around line 32-36):

```tsx
                <p>
                  Hello! I&apos;m Jane, a dedicated English language coach
                  specializing in helping non-native speakers navigate the
                  complexities of global communication. My journey started in
                  [Your Origin], and over the last decade, I&apos;ve had the
                  privilege of teaching students from over 30 countries.
                </p>
```

Replace with:

```tsx
                <p>
                  Hello! I&apos;m Jane, a dedicated English language coach
                  specializing in helping non-native speakers navigate the
                  complexities of global communication. My journey started in
                  Lisbon, Portugal, and over the last decade, I&apos;ve had
                  the privilege of teaching students from over 30 countries.
                </p>
```

- [ ] **Step 2: Remove the dead "View Full Resume" CTA**

Find this block (around lines 93-102):

```tsx
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs italic text-brand-slate leading-relaxed mb-6">
                    &quot;My mission is to eliminate the &apos;language
                    barrier&apos; and help you unlock global opportunities
                    through precise communication.&quot;
                  </p>
                  <button className="w-full py-4 bg-foreground text-background rounded-lg font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity">
                    View Full Resume
                  </button>
                </div>
```

Replace with (drop the dead button — no resume page exists to link to):

```tsx
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs italic text-brand-slate leading-relaxed">
                    &quot;My mission is to eliminate the &apos;language
                    barrier&apos; and help you unlock global opportunities
                    through precise communication.&quot;
                  </p>
                </div>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors (still zero total, per Task 7).

- [ ] **Step 4: Stage**

```bash
git add src/components/sections/AboutMe.tsx
```

---

### Task 9: Methodology bug fixes + dead CTA removal

**Files:**
- Modify: `src/components/sections/Methodology.tsx`

- [ ] **Step 1: Fix the broken apostrophe escaping**

Find this line (around line 46):

```tsx
                I believe fluency isn`&apos;`t about how many words you know,
```

Replace with:

```tsx
                I believe fluency isn&apos;t about how many words you know,
```

- [ ] **Step 2: Remove the dead "Deep Dive into My Method" CTA**

Find this block (around lines 45-52):

```tsx
              <p className="text-brand-slate leading-relaxed mb-8">
                I believe fluency isn&apos;t about how many words you know,
                but how effectively you can use them. My methodology is rooted
                in three core pillars.
              </p>
              <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b-2 border-brand-action pb-1 hover:text-brand-action transition-colors">
                Deep Dive into My Method
              </button>
```

Replace with (drop the button — it had no destination and the section it would "deep dive" into is this same section):

```tsx
              <p className="text-brand-slate leading-relaxed">
                I believe fluency isn&apos;t about how many words you know,
                but how effectively you can use them. My methodology is rooted
                in three core pillars.
              </p>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Stage**

```bash
git add src/components/sections/Methodology.tsx
```

---

### Task 10: ClassesOverview — wire "Explore Course" to sign-up

**Files:**
- Modify: `src/components/sections/ClassesOverview.tsx`

- [ ] **Step 1: Add the Link import**

Find:

```tsx
import Reveal from "@/components/animations/Reveal";
import { BookOpen, Users, GraduationCap, School } from "lucide-react";
```

Replace with:

```tsx
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { BookOpen, Users, GraduationCap, School } from "lucide-react";
```

- [ ] **Step 2: Replace the dead button with a real link**

Find (around lines 66-68):

```tsx
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-action flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Explore Course <span className="text-lg">→</span>
                </button>
```

Replace with:

```tsx
                <Link
                  href="/sign-up"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-action flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  Explore Course <span className="text-lg">→</span>
                </Link>
```

No dedicated per-course pages exist yet (that's a later sub-project), so every card's CTA drives the same real, working destination — starting the sign-up flow — rather than a dead button.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Stage**

```bash
git add src/components/sections/ClassesOverview.tsx
```

---

### Task 11: Testimonials — fix unescaped-entity string bug

**Files:**
- Modify: `src/components/sections/Testimonials.tsx`

- [ ] **Step 1: Fix the literal `&apos;` bug**

This string is a **plain JS string inside an array literal, not JSX text** — so `&apos;` is never HTML-decoded and renders as the literal characters `&apos;` on the page. Find (around line 21):

```tsx
      "As a non-native speaker in tech, I lacked the &apos;professional voice&apos; needed for leadership. These lessons gave me the vocabulary and the confidence.",
```

Replace with:

```tsx
      "As a non-native speaker in tech, I lacked the 'professional voice' needed for leadership. These lessons gave me the vocabulary and the confidence.",
```

(Straight single quotes are safe here since the string itself is delimited with double quotes.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Stage**

```bash
git add src/components/sections/Testimonials.tsx
```

---

### Task 12: FinalCTA — wire/remove dead buttons

**Files:**
- Modify: `src/components/sections/FinalCTA.tsx`

- [ ] **Step 1: Add the Link import**

Find:

```tsx
import Reveal from "@/components/animations/Reveal";
```

Replace with:

```tsx
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
```

- [ ] **Step 2: Replace the button pair**

Find (around lines 26-33):

```tsx
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-10 py-4 bg-brand-action text-white rounded-lg font-bold uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-xl shadow-black/20">
                  Book Free Consultation
                </button>
                <button className="px-10 py-4 border border-white/20 text-white rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-brand-deep transition-all">
                  View Pricing
                </button>
              </div>
```

Replace with (single real CTA to sign-up; "View Pricing" is dropped since no pricing page exists yet — not fabricated):

```tsx
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="px-10 py-4 bg-brand-action text-brand-action-foreground rounded-lg font-bold uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-xl shadow-black/20"
                >
                  Start Learning Free
                </Link>
              </div>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Stage**

```bash
git add src/components/sections/FinalCTA.tsx
```

---

### Task 13: Dashboard components — ContinueCard and StatCard

**Files:**
- Create: `src/components/dashboard/ContinueCard.tsx`
- Create: `src/components/dashboard/StatCard.tsx`

- [ ] **Step 1: Create ContinueCard**

```tsx
// src/components/dashboard/ContinueCard.tsx
interface ContinueCardProps {
  lessonTitle: string;
  progressPercent: number;
}

export default function ContinueCard({
  lessonTitle,
  progressPercent,
}: ContinueCardProps) {
  return (
    <div className="rounded-2xl bg-ink text-paper p-6 md:p-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-action mb-2">
        Continue where you left off
      </div>
      <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
        {lessonTitle}
      </h3>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-action"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-xs mt-2 text-paper/60">
        {progressPercent}% complete
      </div>
    </div>
  );
}
```

`bg-ink`/`text-paper` are the fixed (non-theme-flipping) tokens added in Task 1 — this card is intentionally always a dark surface, regardless of light/dark site theme, matching the approved mockup direction.

- [ ] **Step 2: Create StatCard**

```tsx
// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-70 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Stage**

```bash
git add src/components/dashboard
```

---

### Task 14: Dashboard page rebuild

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Replace the full file content**

```tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "@/lib/appwrite/profiles";
import ContinueCard from "@/components/dashboard/ContinueCard";
import StatCard from "@/components/dashboard/StatCard";

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
    <div className="min-h-screen bg-background px-6 py-24 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-70">
            Welcome back
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {profile.email}
          </h1>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-ink text-paper px-3 py-1 text-xs font-bold">
          🔥 0 day streak
        </div>
      </div>

      <ContinueCard lessonTitle="Lesson 1: Getting Started" progressPercent={0} />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Vocabulary" value="0 words" />
        <StatCard label="Speaking sessions" value="0 sessions" />
      </div>
    </div>
  );
}
```

All stat/progress values (`0 day streak`, "Lesson 1: Getting Started", `0%`, `0 words`, `0 sessions`) are hardcoded placeholders, per the approved spec — no lesson/progress backend exists yet. They're passed as props so a later sub-project can replace the hardcoded values with real data without touching `ContinueCard`/`StatCard` themselves. The existing `getOrCreateProfile` call, error handling, and Clerk auth check from the Foundation sub-project are unchanged.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: **zero errors** (full project clean, per Task 7's fix).

- [ ] **Step 3: Stage**

```bash
git add src/app/dashboard/page.tsx
```

---

### Task 15: Full manual QA

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Landing page branding**

Visit `/`. Verify: Logo (open book + spark icon) and "Lexera" wordmark appear in Navbar and Footer. Page background/text uses the Ink & Amber palette (dark ink headings, amber accent buttons/highlights, off-white background in light mode). Text renders in Roboto (not the old serif Playfair Display anywhere).

- [ ] **Step 3: No dead links or CTAs**

Click every nav link (About, Methodology, Testimonials) — verify each scrolls to its matching section. Click every CTA button/link on the page (Navbar "Start Learning", Hero "Start Learning" and "See How It Works", each ClassesOverview card's "Explore Course", FinalCTA's "Start Learning Free") — verify each either scrolls to a real section or navigates to `/sign-up` (which will show the Clerk sign-up page, or an error if Clerk credentials aren't configured yet — that's expected and not a bug in this task's scope, it's the Foundation sub-project's prerequisite). Confirm there are no plain `<button>` elements left with no `onClick`/navigation anywhere on the page.

- [ ] **Step 4: Hero chat preview**

Confirm the hero's right-side chat preview renders three static message bubbles (a mistake, a correction, a fixed retry). Open browser dev tools Network tab — confirm no network request fires for this content (it's static JSX, not a live API call).

- [ ] **Step 5: Copy and bug fixes**

Confirm AboutMe's bio text reads "...My journey started in Lisbon, Portugal..." with no `[Your Origin]` placeholder anywhere on the page. Confirm Methodology's paragraph reads "...fluency isn't about how many words..." with no stray backticks. Confirm Testimonials' third quote reads "...I lacked the 'professional voice' needed..." with no literal `&apos;` text visible.

- [ ] **Step 6: Footer**

Confirm the footer shows the actual current year (not a hardcoded old one) and has no social icons or "Resources"/"Legal" link columns (only Brand info + Navigation).

- [ ] **Step 7: Dashboard**

This step requires a signed-in session, which requires Clerk credentials from the Foundation sub-project. If credentials aren't configured yet, skip this step and note it as blocked (same as Foundation's Task 8) rather than failing the whole QA pass. If credentials are available: sign in, visit `/dashboard`, verify the dark "Continue where you left off" card renders with the amber progress bar, the streak pill shows in the header, and two stat cards (Vocabulary, Speaking sessions) render below.

- [ ] **Step 8: Mobile responsiveness**

Resize the browser to a mobile width (e.g. 375px). Verify: no horizontal scroll on `/` or `/dashboard`, the mobile hamburger menu opens/closes and shows the same nav links + Sign In + Start Learning, all text stays readable, all CTAs stay tappable (not clipped or overlapping).

- [ ] **Step 9: Full type-check**

Run: `npx tsc --noEmit`
Expected: **zero errors** — every task in this plan should have kept this clean, and Task 7 specifically resolved the one pre-existing error from the original audit.

- [ ] **Step 10: Report results**

If any step fails, treat it as a bug: diagnose root cause, fix, re-run this task's steps from the start. Do not mark this task complete until all applicable checks pass (Step 7 may remain explicitly blocked-on-credentials rather than passed, same convention as the Foundation plan).

---

## Plan self-review notes

- **Spec coverage:** Design system (Task 1, 2, 3) ✅. Logo component (Task 4) ✅. Navbar/Footer rebrand + link fixes (Task 5, 6) ✅. Hero rebuild with scripted chat preview (Task 7) ✅. Every audit-found bug — `[Your Origin]` (Task 8), apostrophe escaping (Task 9), dead CTAs across AboutMe/Methodology/ClassesOverview/FinalCTA (Tasks 8, 9, 10, 12), footer social/dead-link columns (Task 6), hardcoded copyright year (Task 6), and the newly-found Testimonials literal-entity bug (Task 11) — all covered. Dashboard rebuild (Task 13, 14) ✅. Manual QA (Task 15) mirrors every item in the spec's testing section exactly, plus the credentials-blocked caveat consistent with the Foundation plan's convention.
- **Placeholder scan:** none found — every step has complete code, exact find/replace text, or exact commands.
- **Type consistency:** `Logo` component's `LogoProps` (`className?`, `iconSize?`) matches its only call sites (Navbar, Footer — both called with no props, using defaults, which is valid). `ContinueCard`'s `ContinueCardProps` (`lessonTitle: string`, `progressPercent: number`) matches its call site in Task 14's `dashboard/page.tsx`. `StatCard`'s `StatCardProps` (`label: string`, `value: string`) matches its two call sites in the same file. The `--color-ink`/`--color-paper` tokens defined in Task 1 are consumed as `bg-ink`/`text-paper`/`text-paper/60` in Task 7 (Hero) and Task 13 (ContinueCard) — consistent naming throughout. `--brand-action-foreground` defined in Task 1 is consumed as `text-brand-action-foreground` in Task 5 (Navbar), Task 7 (Hero), Task 10 is unaffected (link color stays `text-brand-action`, not a filled button), and Task 12 (FinalCTA) — consistent.
