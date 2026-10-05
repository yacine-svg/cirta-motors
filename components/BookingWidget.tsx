"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/data/cars";
import { cities } from "@/data/site";
import { addDays, parseISODate, toISODate } from "@/lib/format";
import { IconArrow } from "@/components/ui/Icons";

interface BookingWidgetProps {
  className?: string;
  initial?: { city?: string; from?: string; to?: string; category?: string };
  /** "hero" floats over the photo, "bar" sits in a page */
  variant?: "hero" | "bar";
  submitLabel?: string;
}

export default function BookingWidget({ className = "", initial, variant = "hero", submitLabel = "Rechercher" }: BookingWidgetProps) {
  const router = useRouter();
  const uid = useId();
  const [city, setCity] = useState(initial?.city ?? cities[0].id);
  const [from, setFrom] = useState(initial?.from ?? "");
  const [to, setTo] = useState(initial?.to ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "all");
  const [minDate, setMinDate] = useState("");
  const [error, setError] = useState("");

  // Dates depend on the visitor's clock, so they are set after hydration.
  useEffect(() => {
    const today = new Date();
    setMinDate(toISODate(today));
    setFrom((v) => v || toISODate(addDays(today, 1)));
    setTo((v) => v || toISODate(addDays(today, 4)));
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const a = parseISODate(from);
    const b = parseISODate(to);
    if (!a || !b) return setError("Choisissez une date de départ et de retour.");
    if (b <= a) return setError("La date de retour doit être après la date de départ.");
    setError("");
    const params = new URLSearchParams({ city, from, to });
    if (category !== "all") params.set("cat", category);
    router.push(`/fleet?${params.toString()}`);
  }

  const glass =
    variant === "hero" ? "border border-white/10 bg-night/55 backdrop-blur-2xl" : "border border-line bg-coal";

  return (
    <form onSubmit={onSubmit} className={`${glass} rounded-[3px] p-2 ${className}`} aria-label="Rechercher une voiture" noValidate>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-line/60 lg:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
        <Field label="Ville de départ" htmlFor={`${uid}-city`} className="col-span-2 lg:col-span-1">
          <select id={`${uid}-city`} value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent py-1 font-medium outline-none">
            {cities.map((c) => (
              <option key={c.id} value={c.id} className="bg-coal">
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Départ" htmlFor={`${uid}-from`}>
          <input
            id={`${uid}-from`}
            type="date"
            value={from}
            min={minDate || undefined}
            onChange={(e) => {
              setFrom(e.target.value);
              if (to && e.target.value >= to) {
                const d = parseISODate(e.target.value);
                if (d) setTo(toISODate(addDays(d, 1)));
              }
            }}
            className="w-full min-w-0 appearance-none bg-transparent py-1 font-medium outline-none"
          />
        </Field>
        <Field label="Retour" htmlFor={`${uid}-to`}>
          <input
            id={`${uid}-to`}
            type="date"
            value={to}
            min={from || minDate || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="w-full min-w-0 appearance-none bg-transparent py-1 font-medium outline-none"
          />
        </Field>
        <Field label="Catégorie" htmlFor={`${uid}-cat`} className="col-span-2 lg:col-span-1">
          <select id={`${uid}-cat`} value={category} onChange={(e) => setCategory(e.target.value as Category | "all")} className="w-full bg-transparent py-1 font-medium outline-none">
            <option value="all" className="bg-coal">
              Toutes
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-coal">
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
        <div className="col-span-2 bg-night/40 p-2 lg:col-span-1">
          <button type="submit" className="btn btn-primary h-full min-h-14 w-full">
            {submitLabel} <IconArrow className="text-base" />
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="px-3 pb-1 pt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function Field({ label, htmlFor, className = "", children }: { label: string; htmlFor: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`min-w-0 bg-night/40 px-4 py-3 transition-colors focus-within:bg-night/70 ${className}`}>
      <label htmlFor={htmlFor} className="label mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
