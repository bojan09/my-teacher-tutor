import Reveal from "@/components/animations/Reveal";
import { CheckCircle2, Award, BookOpen, Globe } from "lucide-react";

const credentials = [
  { icon: <Award className="w-4 h-4" />, text: "Cambridge CELTA Certified" },
  { icon: <Globe className="w-4 h-4" />, text: "10+ Years International Exp." },
  { icon: <BookOpen className="w-4 h-4" />, text: "IELTS & TOEFL Specialist" },
];

export default function AboutMe() {
  return (
    <section
      id="about"
      className="py-24 bg-brand-light dark:bg-white/[0.01] transition-colors duration-500"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Side: Editorial Content */}
          <div className="lg:col-span-7">
            <Reveal direction="up">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-action mb-6">
                Meet Your Instructor
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-foreground mb-8">
                Helping you find your <br />
                <span className="italic">professional voice.</span>
              </h2>

              <div className="space-y-6 text-brand-slate text-lg leading-relaxed">
                <p>
                  Hello! I&apos;m Jane, a dedicated English language coach
                  specializing in helping non-native speakers navigate the
                  complexities of global communication. My journey started in
                  Lisbon, Portugal, and over the last decade, I&apos;ve had
                  the privilege of teaching students from over 30 countries.
                </p>
                <p>
                  I don&apos;t just teach grammar; I teach{" "}
                  <strong>confidence</strong>. My philosophy is built on the
                  belief that language is a tool for connection, not a set of
                  rules to be memorized. Whether you&apos;re preparing for a
                  boardroom presentation or a university entrance exam, I&apos;m
                  here to bridge the gap.
                </p>
              </div>

              {/* Quick Values List */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Adaptive Learning",
                  "Industry-Specific Vocab",
                  "Accent Neutralization",
                  "Cultural Nuance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-action" />
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Side: Credentials Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Reveal direction="left" delay={0.2}>
              <div className="p-8 rounded-2xl bg-white dark:bg-card border border-border shadow-xl shadow-brand-deep/5">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-slate mb-8 border-b border-border pb-4">
                  Professional Credentials
                </h4>

                <div className="space-y-8">
                  {credentials.map((cred, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 p-2 rounded-lg bg-brand-mint/50 dark:bg-brand-action/10 text-brand-action">
                        {cred.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold tracking-tight text-foreground">
                          {cred.text}
                        </div>
                        <div className="text-xs text-brand-slate mt-1 opacity-70 uppercase tracking-widest font-medium">
                          Verified Partner
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs italic text-brand-slate leading-relaxed">
                    &quot;My mission is to eliminate the &apos;language
                    barrier&apos; and help you unlock global opportunities
                    through precise communication.&quot;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
