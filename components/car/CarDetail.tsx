"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import type { Car } from "@/data/cars";
import CarViewer from "@/components/car/CarViewer";
import BookingCard from "@/components/car/BookingCard";
import { formatNumber } from "@/lib/format";
import { IconArrow } from "@/components/ui/Icons";

/** Client wrapper so the viewer and the booking card share the selected color. */
export default function CarDetail({ car, children }: { car: Car; children: ReactNode }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const card = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // On phones the booking card sits below the details: hide the bottom bar once it is on screen.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCardVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function goToCard() {
    const el = card.current;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -88 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => el.querySelector<HTMLElement>("select, input")?.focus({ preventScroll: true }), 700);
  }

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div className="min-w-0">
          <CarViewer car={car} colorIndex={colorIndex} onColorChange={setColorIndex} />
          {children}
        </div>
        <aside ref={card} id="reserver-carte" className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start" aria-label="Réserver cette voiture">
          <Suspense fallback={<div className="h-[34rem] animate-pulse rounded-[3px] border border-line bg-coal" />}>
            <BookingCard car={car} color={car.colors[colorIndex].name} />
          </Suspense>
        </aside>
      </div>

      {/* Phone-only bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-night/95 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-premium)] lg:hidden ${
          cardVisible ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden={cardVisible}
        inert={cardVisible}
      >
        <div className="flex items-center justify-between gap-4 py-3 pl-5 pr-[5.5rem]">
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mute">{car.name}</p>
            <p className="mt-0.5">
              <span className="font-display text-2xl font-semibold leading-none">{formatNumber(car.pricePerDay)}</span>
              <span className="ml-1 font-mono text-[0.62rem] uppercase text-mute">DA / jour</span>
            </p>
          </div>
          <button type="button" onClick={goToCard} className="btn btn-primary h-11 shrink-0 px-5">
            Réserver <IconArrow />
          </button>
        </div>
      </div>
    </>
  );
}
