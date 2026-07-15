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
