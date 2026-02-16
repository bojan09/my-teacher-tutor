import Reveal from "@/components/animations/Reveal";

export default function TrustBar() {
  const stats = [
    { label: "Students Taught", value: "500+" },
    { label: "Success Rate", value: "98%" },
    { label: "Years Experience", value: "5+" },
  ];

  const certifications = [
    "CELTA Cambridge",
    "TEFL Accredited",
    "IELTS Specialist",
  ];

  return (
    <section className="py-10 bg-brand-mint/20 dark:bg-white/[0.02] border-y border-foreground/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Stats Column - Minimalist Academic Style */}
          <div className="grid grid-cols-3 gap-12 md:gap-20">
            {stats.map((stat) => (
              <Reveal key={stat.label} direction="up" delay={0.1}>
                <div className="text-center lg:text-left">
                  {/* Font weight 600, tight tracking for that modern school look */}
                  <div className="text-3xl md:text-4xl font-sans font-semibold tracking-tighter text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-60">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Minimalist Divider */}
          <div className="hidden lg:block h-8 w-px bg-foreground/10" />

          {/* Certifications - Clean & Bold Minimalist Labels */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {certifications.map((cert) => (
              <Reveal key={cert} direction="up" delay={0.3}>
                <div className="flex items-center gap-2 group cursor-default">
                  {/* Subtle dot indicator often seen in premium school branding */}
                  <span className="h-1 w-1 rounded-full bg-brand-action opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70 group-hover:text-brand-action transition-colors">
                    {cert}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
