"use client";

import { useRef } from "react";
import { steps } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".how-line", {
          scaleX: 0,
          transformOrigin: "left",
          ease: "none",
          scrollTrigger: { trigger: ".how-list", start: "top 75%", end: "bottom 60%", scrub: true },
        });
        gsap.from(".how-step", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".how-list", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="border-t border-line bg-coal/40 py-24 md:py-36" aria-labelledby="how-title">
      <div className="container-x">
        <SectionHeading eyebrow="Comment ça marche" title={<span id="how-title">Trois étapes, zéro paperasse.</span>} />
        <div className="relative mt-16 md:mt-24">
          <span className="how-line absolute left-0 right-0 top-[2.1rem] hidden h-px bg-accent/70 md:block" aria-hidden="true" />
          <ol className="how-list grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((s, i) => (
              <li key={s.title} className="how-step relative">
                <span className="relative z-10 inline-grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full border border-line bg-night font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold uppercase leading-none">{s.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-mute">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
