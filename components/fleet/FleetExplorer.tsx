"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, PRICE_MAX, PRICE_MIN, cars, type Category, type Transmission } from "@/data/cars";
import { cities, cityName } from "@/data/site";
import CarCard from "@/components/CarCard";
import BookingWidget from "@/components/BookingWidget";
import { Flip, gsap, useGSAP } from "@/lib/gsap";
import { formatDZD, formatDate, parseISODate } from "@/lib/format";
import { rentalDays } from "@/lib/pricing";

type Sort = "price-asc" | "price-desc" | "power";

const SORTS: { id: Sort; label: string }[] = [
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "power", label: "Puissance" },
];

const STEP = 1000;
const roundUp = (n: number) => Math.ceil(n / STEP) * STEP;

export default function FleetExplorer() {
  const params = useSearchParams();
  const initialCat = params.get("cat");
  const city = params.get("city") ?? "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const datesOk = Boolean(parseISODate(from) && parseISODate(to));
  const days = datesOk ? rentalDays(from, "10:00", to, "10:00") : 0;
  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (cities.some((c) => c.id === city)) q.set("city", city);
    if (days > 0) {
      q.set("from", from);
      q.set("to", to);
    }
    return q.toString();
  }, [city, from, to, days]);

  const [category, setCategory] = useState<Category | "all">(
    CATEGORIES.includes(initialCat as Category) ? (initialCat as Category) : "all",
  );
  // Follow the category when the search bar updates the URL.
  useEffect(() => {
    setCategory(CATEGORIES.includes(initialCat as Category) ? (initialCat as Category) : "all");
  }, [initialCat]);
  const [transmission, setTransmission] = useState<Transmission | "all">("all");
  const [maxPrice, setMaxPrice] = useState(roundUp(PRICE_MAX));
  const [sort, setSort] = useState<Sort>("price-asc");

  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const list = useMemo(() => {
    const power = (p: string) => parseInt(p, 10) || 0;
    return cars
      .filter((c) => (category === "all" || c.category === category) && (transmission === "all" || c.transmission === transmission) && c.pricePerDay <= maxPrice)
      .sort((a, b) =>
        sort === "price-asc" ? a.pricePerDay - b.pricePerDay : sort === "price-desc" ? b.pricePerDay - a.pricePerDay : power(b.power) - power(a.power),
      );
  }, [category, transmission, maxPrice, sort]);

  /** Capture positions before a filter change so the grid can animate (GSAP Flip). */
  function withFlip(change: () => void) {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && grid.current) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    }
    change();
  }

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        targets: grid.current?.querySelectorAll("[data-card]"),
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }),
      });
    },
    { dependencies: [list], scope: grid },
  );

  const reset = () =>
    withFlip(() => {
      setCategory("all");
      setTransmission("all");
      setMaxPrice(roundUp(PRICE_MAX));
      setSort("price-asc");
    });

  const filtered = category !== "all" || transmission !== "all" || maxPrice < roundUp(PRICE_MAX);

  return (
    <div>
      <BookingWidget
        variant="bar"
        submitLabel="Mettre à jour"
        initial={{ city: city || undefined, from: from || undefined, to: to || undefined, category: category }}
        className="mb-10"
      />

      {days > 0 ? (
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.14em] text-mute" aria-live="polite">
          {city ? `${cityName(city)} · ` : ""}
          {formatDate(from)} → {formatDate(to)} · <span className="text-accent">{days} jour{days > 1 ? "s" : ""}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-6 border-y border-line py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5">
          <fieldset>
            <legend className="label">Catégorie</legend>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {(["all", ...CATEGORIES] as const).map((c) => (
                <button key={c} type="button" className="chip shrink-0" aria-pressed={category === c} onClick={() => withFlip(() => setCategory(c))}>
                  {c === "all" ? "Toutes" : CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">Boîte de vitesses</legend>
            <div className="flex flex-wrap gap-2">
              {(["all", "Automatique", "Manuelle"] as const).map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={transmission === t} onClick={() => withFlip(() => setTransmission(t))}>
                  {t === "all" ? "Toutes" : t}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:w-[34rem]">
          <div>
            <label htmlFor="price" className="label flex justify-between">
              <span>Prix max / jour</span>
              <span className="text-bone">{formatDZD(maxPrice)}</span>
            </label>
            <input
              id="price"
              type="range"
              min={roundUp(PRICE_MIN)}
              max={roundUp(PRICE_MAX)}
              step={STEP}
              value={maxPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                withFlip(() => setMaxPrice(v));
              }}
              className="h-12 w-full"
            />
          </div>
          <div>
            <label htmlFor="sort" className="label">
              Trier par
            </label>
            <select id="sort" className="field" value={sort} onChange={(e) => withFlip(() => setSort(e.target.value as Sort))}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute" aria-live="polite">
          {list.length} véhicule{list.length > 1 ? "s" : ""}
        </p>
        {filtered ? (
          <button type="button" onClick={reset} className="font-mono text-xs uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline">
            Réinitialiser les filtres
          </button>
        ) : null}
      </div>

      <div ref={grid} className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((car, i) => (
          <CarCard key={car.slug} car={car} days={days} query={query} priority={i < 3} />
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-[3px] border border-dashed border-line p-12 text-center">
          <p className="font-display text-3xl font-semibold uppercase">Aucune voiture ne correspond</p>
          <p className="mt-3 text-mute">Augmentez le prix maximum ou choisissez une autre catégorie.</p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-8">
            Réinitialiser les filtres
          </button>
        </div>
      ) : null}
    </div>
  );
}
