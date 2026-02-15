"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, GraduationCap } from "lucide-react";
import Link from "next/link"; // Standard Next.js linking

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return <div className="h-20" aria-hidden="true" />;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo as a Link */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          <GraduationCap className="w-8 h-8 text-brand-action" />
          <span>FluentEdge</span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Expanded Nav Links */}
          <div className="hidden lg:flex gap-8 font-medium text-foreground/80">
            <Link
              href="/courses"
              className="hover:text-brand-action transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/methodology"
              className="hover:text-brand-action transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/about"
              className="hover:text-brand-action transition-colors"
            >
              About Me
            </Link>
            <Link
              href="/pricing"
              className="hover:text-brand-action transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="hover:text-brand-action transition-colors"
            >
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button className="hidden sm:block px-5 py-2.5 bg-brand-action text-white dark:text-brand-light rounded-lg font-bold hover:brightness-110 transition-all shadow-md active:scale-95">
              Book a Class
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
