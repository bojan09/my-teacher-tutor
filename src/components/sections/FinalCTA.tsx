import Reveal from "@/components/animations/Reveal";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-brand-deep p-12 md:p-20 text-center">
          {/* Subtle decorative background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--color-brand-light)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <Reveal direction="up">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-action mb-6">
                Ready to Begin?
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-white mb-8">
                Your journey to fluency <br />
                <span className="italic text-brand-action">
                  starts with a conversation.
                </span>
              </h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">
                Book a free 20-minute consultation to discuss your goals, assess
                your level, and build your personalized learning roadmap.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-10 py-4 bg-brand-action text-white rounded-lg font-bold uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-xl shadow-black/20">
                  Book Free Consultation
                </button>
                <button className="px-10 py-4 border border-white/20 text-white rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-brand-deep transition-all">
                  View Pricing
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
