"use client";

import { useRef } from "react";
import BookingWidget from "@/components/BookingWidget";
import HeroBackground from "@/components/home/HeroBackground";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-line > span", { yPercent: 115, duration: 1.4, stagger: 0.09 })
          .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, "-=1")
          .from(".hero-widget", { y: 40, autoAlpha: 0, duration: 1.2 }, "-=0.9");
        gsap.to(bg.current, {
          yPercent: 14,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <HeroBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/20 to-night" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/20 to-transparent" aria-hidden="true" />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-28 md:pb-12">
        <p className="hero-fade eyebrow flex items-center gap-3 text-bone/70">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Location premium · Constantine · Alger · Oran
        </p>
        <h1 id="hero-title" className="mt-6 font-display text-[clamp(3.6rem,13vw,10.5rem)] font-semibold uppercase leading-[0.86] tracking-[0.005em]">
          <span className="hero-line block overflow-hidden pb-[0.04em]">
            <span className="block">Conduire</span>
          </span>
          <span className="hero-line block overflow-hidden pb-[0.04em]">
            <span className="block">
              l&apos;exception<span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-bone/75 md:text-lg">
          Berlines, SUV et vans haut de gamme, livrés à l&apos;aéroport ou à votre porte. Annulation gratuite, assistance 24/7 et prix tout compris en dinars.
        </p>
        <div className="hero-widget mt-10">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
