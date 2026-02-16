import Reveal from "@/components/animations/Reveal";
import { Target, Zap, MessageSquare } from "lucide-react";

const pillars = [
  {
    tag: "Approach",
    title: "The Communicative Method",
    description:
      "Language is for speaking, not just studying. My lessons focus 70% on active production to build immediate confidence.",
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    tag: "Strategy",
    title: "Personalized Roadmap",
    description:
      "No generic textbooks. We build a curriculum around your specific professional industry or academic goals.",
    icon: <Target className="w-6 h-6" />,
  },
  {
    tag: "Efficiency",
    title: "Spaced Repetition",
    description:
      "Using cognitive science to ensure you never forget new vocabulary. We optimize your long-term memory.",
    icon: <Zap className="w-6 h-6" />,
  },
];

export default function Methodology() {
  return (
    <section
      id="methodology"
      className="py-24 bg-background transition-colors duration-500"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Header Section */}
          <div className="lg:col-span-1">
            <Reveal direction="up">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-action mb-4">
                The Philosophy
              </div>
              <h2 className="text-4xl font-serif font-semibold tracking-tight text-foreground mb-6 leading-tight">
                Beyond Standard <br /> Teaching
              </h2>
              <p className="text-brand-slate leading-relaxed mb-8">
                I believe fluency isn`&apos;`t about how many words you know,
                but how effectively you can use them. My methodology is rooted
                in three core pillars.
              </p>
              <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b-2 border-brand-action pb-1 hover:text-brand-action transition-colors">
                Deep Dive into My Method
              </button>
            </Reveal>
          </div>

          {/* Pillars Section */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} direction="up" delay={index * 0.1}>
                <div className="group">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-brand-mint/50 dark:bg-white/[0.05] text-brand-action group-hover:scale-110 transition-transform duration-300">
                      {pillar.icon}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-60">
                      {pillar.tag}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-brand-slate leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
