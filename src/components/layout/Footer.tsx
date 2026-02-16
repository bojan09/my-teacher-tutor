import { GraduationCap, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-light dark:bg-white/[0.02] border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-serif text-2xl font-bold text-foreground mb-6">
              <GraduationCap className="w-8 h-8 text-brand-action" />
              <span>FluentEdge</span>
            </div>
            <p className="text-brand-slate text-sm leading-relaxed mb-6">
              Professional English coaching for the next generation of global
              leaders. Bridging the gap between knowledge and confidence.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="p-2 rounded-full bg-foreground/5 hover:text-brand-action transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-foreground/5 hover:text-brand-action transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-foreground/5 hover:text-brand-action transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Nav Links - Using wide tracking labels */}
          {[
            {
              title: "Navigation",
              links: ["Courses", "Methodology", "About Me", "Pricing"],
            },
            {
              title: "Resources",
              links: ["Free E-Books", "Vocabulary Tips", "IELTS Guide", "Blog"],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy",
                "Terms of Service",
                "Cookies",
                "Contact",
              ],
            },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground mb-8">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-brand-slate hover:text-brand-action transition-colors font-medium tracking-tight"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-60">
            &copy; 2026 FluentEdge Education. All rights reserved.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-60">
            Design by FluentEdge
          </p>
        </div>
      </div>
    </footer>
  );
}
