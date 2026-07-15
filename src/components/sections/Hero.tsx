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
