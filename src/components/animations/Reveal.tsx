"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  cascade?: boolean;
}

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1.2,
  cascade = false,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const offsets = {
      up: { y: 40, x: 0 },
      down: { y: -40, x: 0 },
      left: { y: 0, x: 40 },
      right: { y: 0, x: -40 },
    };

    const ctx = gsap.context(() => {
      // We use fromTo to guarantee the animation lands on opacity: 1
      gsap.fromTo(
        cascade ? ".reveal-item" : element,
        {
          opacity: 0,
          y: offsets[direction].y,
          x: offsets[direction].x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: duration,
          delay: delay,
          ease: "power3.out",
          stagger: cascade ? 0.15 : 0,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [direction, delay, duration, cascade]);

  return <div ref={root}>{children}</div>;
}
