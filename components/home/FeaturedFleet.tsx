"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Car } from "@/data/cars";
import CarCard from "@/components/CarCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { IconArrow } from "@/components/ui/Icons";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FeaturedFleet({ cars }: { cars: Car[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Pinned horizontal scroll only on large screens with motion allowed.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden border-y border-line bg-coal/40 py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="fleet-title">
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="La sélection" title={<span id="fleet-title">Prêtes à partir.</span>} />
        <Link href="/fleet" className="btn btn-ghost self-start md:self-end">
          Toute la flotte <IconArrow />
        </Link>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:px-8 lg:mt-14 lg:snap-none lg:overflow-visible lg:px-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))] lg:will-change-transform"
        tabIndex={0}
        aria-label="Voitures en vedette, faites défiler horizontalement"
      >
        {cars.map((car) => (
          <CarCard key={car.slug} car={car} className="w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[min(30vw,460px)]" />
        ))}
        <Link
          href="/fleet"
          className="group flex w-[60vw] shrink-0 snap-start flex-col justify-end rounded-[3px] border border-dashed border-line p-8 transition-colors hover:border-accent sm:w-[40vw] lg:w-[min(22vw,340px)]"
        >
          <span className="font-display text-4xl font-semibold uppercase leading-none">
            Voir toute la flotte
          </span>
          <span className="mt-6 grid h-12 w-12 place-items-center rounded-full border border-line text-xl transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            <IconArrow />
          </span>
        </Link>
      </div>

      <div className="container-x mt-10 hidden lg:block" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <span ref={bar} className="block h-px origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </section>
  );
}
