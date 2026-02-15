import Image from "next/image";
import Reveal from "@/components/animations/Reveal";

import teacher_img from "../../../public/imgs/teacher_img.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-brand-mint),transparent_60%)] opacity-50 dark:opacity-20" />

      <div className="container mx-auto px-6 pl-10 lg:pl-16 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="max-w-xl">
          <Reveal direction="up" cascade>
            <div className="reveal-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-action/10 text-brand-action text-xs font-bold mb-6 border border-brand-action/20">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-action animate-pulse" />
              Expert Online English Tutoring
            </div>

            <h1 className="reveal-item text-4xl lg:text-6xl font-serif text-foreground leading-tight mb-6">
              Empowering Your <br />
              <span className="text-brand-action italic">Future Fluency</span>
            </h1>

            <p className="reveal-item text-base lg:text-lg text-brand-slate mb-8 leading-relaxed max-w-md">
              Personalized 1-on-1 coaching designed to help professionals and
              students excel in a global world.
            </p>

            <div className="reveal-item flex flex-col sm:flex-row gap-4">
              <button className="px-7 py-3.5 bg-brand-action text-white dark:text-brand-light rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-action/20 active:scale-95 text-base">
                Book a Free Trial
              </button>
              <button className="px-7 py-3.5 border border-foreground/20 text-foreground rounded-lg font-bold hover:bg-foreground hover:text-background transition-all active:scale-95 text-base">
                Browse Classes
              </button>
            </div>
          </Reveal>
        </div>

        {/* IMAGE SECTION */}
        <Reveal direction="left" delay={0.4}>
          <div className="relative aspect-[4/5] w-full max-w-[450px] mx-auto lg:ml-auto">
            {/* Background Decorative Frame */}
            <div className="absolute inset-0 bg-brand-mint translate-x-4 translate-y-4 rounded-2xl z-0" />

            <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl z-10 bg-brand-mint/50 backdrop-blur-sm">
              <Image
                src={teacher_img}
                alt="Professional English Tutor"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
