"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/data/cars";
import { cities, site } from "@/data/site";
import { TIMES, addDays, formatDZD, formatNumber, parseISODate, toISODate } from "@/lib/format";
import { quote, rentalDays } from "@/lib/pricing";
import { IconArrow, IconWhatsApp } from "@/components/ui/Icons";

export default function BookingCard({ car, color }: { car: Car; color: string }) {
  const params = useSearchParams();
  const [city, setCity] = useState(params.get("city") ?? cities[0].id);
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("10:00");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    setMinDate(toISODate(today));
    setFrom((v) => (parseISODate(v) ? v : toISODate(addDays(today, 1))));
    setTo((v) => (parseISODate(v) ? v : toISODate(addDays(today, 4))));
  }, []);

  const days = rentalDays(from, fromTime, to, toTime);
  const q = useMemo(() => (days > 0 ? quote(car, days) : null), [car, days]);

  const href = useMemo(() => {
    const p = new URLSearchParams({ car: car.slug, city, from, to, fromTime, toTime, color });
    return `/booking?${p.toString()}`;
  }, [car.slug, city, from, to, fromTime, toTime, color]);

  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par la ${car.name}${from && to ? ` du ${from} au ${to}` : ""}.`)}`;

  return (
    <div className="rounded-[3px] border border-line bg-coal">
      <div className="border-b border-line p-6">
        <p className="eyebrow">À partir de</p>
        <p className="mt-2">
          <span className="font-display text-5xl font-semibold leading-none">{formatNumber(car.pricePerDay)}</span>
          <span className="ml-2 font-mono text-xs uppercase tracking-[0.14em] text-mute">DA / jour</span>
        </p>
        <p className="mt-2 font-mono text-xs text-mute">{formatDZD(car.pricePerWeek)} la semaine</p>
      </div>

      <div className="grid gap-4 p-6">
        <div>
          <label htmlFor="bc-city" className="label">
            Agence
          </label>
          <select id="bc-city" className="field" value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.airport}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_6.5rem] gap-2">
          <div>
            <label htmlFor="bc-from" className="label">
              Départ
            </label>
            <input id="bc-from" type="date" className="field" value={from} min={minDate || undefined} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="bc-from-t" className="label">
              Heure
            </label>
            <select id="bc-from-t" className="field px-2" value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_6.5rem] gap-2">
          <div>
            <label htmlFor="bc-to" className="label">
              Retour
            </label>
            <input id="bc-to" type="date" className="field" value={to} min={from || minDate || undefined} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label htmlFor="bc-to-t" className="label">
              Heure
            </label>
            <select id="bc-to-t" className="field px-2" value={toTime} onChange={(e) => setToTime(e.target.value)}>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-6" aria-live="polite">
        {q ? (
          <>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-mute">
                <dt>
                  Location · {q.days} jour{q.days > 1 ? "s" : ""}
                </dt>
                <dd className="text-bone">{formatDZD(q.base)}</dd>
              </div>
              {q.saving > 0 ? (
                <div className="flex justify-between text-success">
                  <dt>Tarif semaine appliqué</dt>
                  <dd>−{formatDZD(q.saving)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-mute">
                <dt>Kilométrage inclus</dt>
                <dd className="text-bone">{formatNumber(q.days * 300)} km</dd>
              </div>
              <div className="flex justify-between text-mute">
                <dt>Caution (rendue au retour)</dt>
                <dd className="text-bone">{formatDZD(q.deposit)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-line pt-5">
              <span className="eyebrow">Total</span>
              <span className="font-display text-4xl font-semibold leading-none">{formatDZD(q.total)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-danger" role="alert">
            Choisissez une date de retour après la date de départ.
          </p>
        )}
        <Link href={href} className={`btn btn-primary mt-6 w-full ${q ? "" : "pointer-events-none opacity-50"}`} aria-disabled={!q}>
          Réserver cette voiture <IconArrow />
        </Link>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-3 w-full">
          <IconWhatsApp className="text-base" /> Une question ?
        </a>
        <p className="mt-4 text-center font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mute">Annulation gratuite jusqu&apos;à 48 h avant</p>
      </div>
    </div>
  );
}
