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
