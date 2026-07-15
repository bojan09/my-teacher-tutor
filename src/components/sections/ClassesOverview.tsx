import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { BookOpen, Users, GraduationCap, School } from "lucide-react";

const classes = [
  {
    title: "Kids English",
    description:
      "Gamified learning and storytelling to build a natural foundation.",
    icon: <School className="w-8 h-8" />,
  },
  {
    title: "Teens English",
    description: "Academic support and conversational fluency for students.",
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    title: "Adult / ESL",
    description:
      "Practical English for the workplace, travel, and social confidence.",
    icon: <Users className="w-8 h-8" />,
  },
  {
    title: "Exam Prep",
    description: "Intensive coaching for IELTS, TOEFL, and Cambridge exams.",
    icon: <GraduationCap className="w-8 h-8" />,
  },
];

export default function ClassesOverview() {
  return (
    <section className="py-24 bg-brand-mint/40 dark:bg-white/[0.02] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <Reveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {/* Academic Style: Semi-bold, tight tracking */}
            <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-foreground mb-4">
              Our Specialized Programs
            </h2>
            {/* Label Style: Wide tracking, uppercase sub-element if needed */}
            <p className="text-brand-slate text-lg leading-relaxed">
              Every student is unique. We offer structured pathways tailored to
              different age groups and professional goals.
            </p>
          </div>
        </Reveal>

        <Reveal cascade direction="up">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {classes.map((cls, index) => (
              <div
                key={index}
                className="reveal-item p-8 rounded-2xl border border-white/50 dark:border-white/5 bg-white/90 dark:bg-white/[0.03] backdrop-blur-sm hover:border-brand-action/40 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="mb-6 inline-block p-3 rounded-xl bg-brand-action/10 text-brand-action group-hover:bg-brand-action group-hover:text-white transition-colors duration-300">
                  {cls.icon}
                </div>
                {/* Minimalist Bold Title */}
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                  {cls.title}
                </h3>
                <p className="text-brand-slate leading-relaxed mb-6 text-sm">
                  {cls.description}
                </p>

                {/* Action Link: Wide tracking for the label */}
                <Link
                  href="/sign-up"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-action flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  Explore Course <span className="text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
