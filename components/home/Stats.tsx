"use client";

import { useRef } from "react";
import { stats } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const counter = { v: 0 };
          el.textContent = "0";
          gsap.to(counter, {
            v: end,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = formatNumber(counter.v);
            },
          });
        });
        gsap.from(".stat-rule", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="container-x py-24 md:py-32" aria-label="Chiffres clés">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <span className="stat-rule block h-px w-full bg-line" aria-hidden="true">
              <span className="block h-px w-10 bg-accent" />
            </span>
            <p className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-none tracking-tight">
              <span data-count={s.value}>{formatNumber(s.value)}</span>
              <span className="text-accent">{s.suffix}</span>
            </p>
            <p className="eyebrow mt-3">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
