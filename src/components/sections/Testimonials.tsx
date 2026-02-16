import Reveal from "@/components/animations/Reveal";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The personalized roadmap was a game-changer. I went from struggling with meeting participation to leading international presentations in just three months.",
    author: "Elena Rodriguez",
    role: "Marketing Director",
    tag: "Business English",
  },
  {
    quote:
      "I needed a 7.5 on the IELTS for my visa. Thanks to the intensive prep and specific strategies, I achieved an 8.0 on my first attempt.",
    author: "Marco Chen",
    role: "Postgraduate Student",
    tag: "Exam Prep",
  },
  {
    quote:
      "As a non-native speaker in tech, I lacked the &apos;professional voice&apos; needed for leadership. These lessons gave me the vocabulary and the confidence.",
    author: "Sarah Jenkins",
    role: "Senior Developer",
    tag: "Professional Fluency",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-background transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <Reveal direction="up">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-action mb-4">
              Student Success
            </div>
            <h2 className="text-4xl font-serif font-semibold tracking-tight text-foreground mb-6">
              Real stories from <br />
              <span className="italic">students.</span>
            </h2>
          </Reveal>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <Reveal key={index} direction="up" delay={index * 0.1}>
              <div className="relative p-10 rounded-2xl bg-brand-mint/20 dark:bg-white/[0.02] border border-foreground/5 hover:border-brand-action/20 transition-all duration-500 group">
                <Quote className="absolute top-6 right-8 w-10 h-10 text-brand-action/10 group-hover:text-brand-action/20 transition-colors" />

                <p className="text-brand-slate leading-relaxed mb-8 relative z-10 italic">
                  &quot;{t.quote}&quot;
                </p>

                <div className="mt-auto">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-action mb-2">
                    {t.tag}
                  </div>
                  <div className="text-base font-semibold tracking-tight text-foreground">
                    {t.author}
                  </div>
                  <div className="text-xs text-brand-slate opacity-70">
                    {t.role}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
