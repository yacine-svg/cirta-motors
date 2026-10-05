"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { CATEGORIES, CATEGORY_LABELS, cars, getCar } from "@/data/cars";
import { cities, cityName, extras, site } from "@/data/site";
import { TIMES, addDays, formatDZD, formatDate, parseISODate, toISODate } from "@/lib/format";
import { quote, rentalDays } from "@/lib/pricing";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { IconArrow, IconArrowLeft, IconCheck, IconWhatsApp } from "@/components/ui/Icons";

const STEPS = ["Dates & lieu", "Options", "Vos informations", "Récapitulatif"] as const;

interface FormData {
  car: string;
  pickupCity: string;
  returnCity: string;
  from: string;
  fromTime: string;
  to: string;
  toTime: string;
  color: string;
  extras: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  license: string;
  flight: string;
  notes: string;
  terms: boolean;
}

type Errors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  car: "",
  pickupCity: cities[0].id,
  returnCity: cities[0].id,
  from: "",
  fromTime: "10:00",
  to: "",
  toTime: "10:00",
  color: "",
  extras: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  license: "",
  flight: "",
  notes: "",
  terms: false,
};

function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `CRT-${s.slice(0, 3)}-${s.slice(3)}`;
}

export default function BookingFlow() {
  const params = useSearchParams();
  const lenis = useLenis();
  const [data, setData] = useState<FormData>(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Prefill from the URL (car page, fleet, search widget) once on the client.
  useEffect(() => {
    const today = new Date();
    setMinDate(toISODate(today));
    const car = getCar(params.get("car") ?? "");
    const city = params.get("city");
    const validCity = cities.some((c) => c.id === city) ? (city as string) : cities[0].id;
    const from = params.get("from") ?? "";
    const to = params.get("to") ?? "";
    setData((d) => ({
      ...d,
      car: car?.slug ?? "",
      pickupCity: validCity,
      returnCity: validCity,
      from: parseISODate(from) ? from : toISODate(addDays(today, 1)),
      to: parseISODate(to) ? to : toISODate(addDays(today, 4)),
      fromTime: TIMES.includes(params.get("fromTime") ?? "") ? (params.get("fromTime") as string) : d.fromTime,
      toTime: TIMES.includes(params.get("toTime") ?? "") ? (params.get("toTime") as string) : d.toTime,
      color: params.get("color") ?? (car ? car.colors[0].name : ""),
    }));
  }, [params]);

  const car = getCar(data.car);
  const days = rentalDays(data.from, data.fromTime, data.to, data.toTime);
  const oneWay = data.pickupCity !== data.returnCity;
  const q = useMemo(() => (car && days > 0 ? quote(car, days, data.extras, oneWay) : null), [car, days, data.extras, oneWay]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 0) {
      if (!car) e.car = "Choisissez une voiture.";
      const a = parseISODate(data.from);
      if (!a) e.from = "Choisissez une date de départ.";
      else if (minDate && data.from < minDate) e.from = "La date de départ est déjà passée.";
      if (!parseISODate(data.to)) e.to = "Choisissez une date de retour.";
      else if (days <= 0) e.to = "Le retour doit être après le départ.";
    }
    if (s === 2) {
      if (data.firstName.trim().length < 2) e.firstName = "Indiquez votre prénom.";
      if (data.lastName.trim().length < 2) e.lastName = "Indiquez votre nom.";
      if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) e.email = "Entrez une adresse e-mail valide.";
      const phone = data.phone.replace(/[\s.-]/g, "").replace(/^\+213/, "0");
      if (!/^0[567]\d{8}$/.test(phone)) e.phone = "Numéro mobile algérien : 10 chiffres commençant par 05, 06 ou 07.";
      const age = parseInt(data.age, 10);
      if (!age) e.age = "Indiquez votre âge.";
      else if (car && age < car.minAge) e.age = `Il faut avoir au moins ${car.minAge} ans pour cette voiture.`;
      if (!data.license) e.license = "Indiquez depuis quand vous avez le permis.";
      else if (data.license === "lt2") e.license = "Il faut au moins 2 ans de permis.";
    }
    if (s === 3 && !data.terms) e.terms = "Merci d'accepter les conditions de location.";
    return e;
  }

  function goTo(next: number) {
    if (next > step) {
      for (let s = step; s < next; s++) {
        const e = validate(s);
        if (Object.keys(e).length) {
          setErrors(e);
          setStep(s);
          window.requestAnimationFrame(() => {
            const first = panel.current?.querySelector<HTMLElement>("[aria-invalid='true']");
            first?.focus();
          });
          return;
        }
      }
    }
    setErrors({});
    setStep(next);
  }

  // Step change: scroll the form into view, move focus to the step title, animate the panel.
  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (top.current) {
        if (lenis) lenis.scrollTo(top.current, { offset: -110, duration: 0.9 });
        else top.current.scrollIntoView({ block: "start" });
      }
      heading.current?.focus({ preventScroll: true });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (panel.current) gsap.fromTo(panel.current, { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { dependencies: [step, reference] },
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) return goTo(step + 1);
    const err = validate(3);
    if (Object.keys(err).length) return setErrors(err);
    setSubmitting(true);
    // Demo only: no backend. Simulate the network round trip.
    window.setTimeout(() => {
      setSubmitting(false);
      setReference(makeReference());
    }, 1400);
  }

  if (reference && car && q) {
    return (
      <div ref={top}>
        <Confirmation reference={reference} data={data} carName={car.name} carImage={car.images[0].src} total={q.total} deposit={q.deposit} days={q.days} headingRef={heading} />
      </div>
    );
  }

  const fieldProps = (key: keyof FormData) => ({
    id: `bk-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `bk-${key}-error` : undefined,
  });

  return (
    <div ref={top} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
      <form onSubmit={onSubmit} noValidate className="min-w-0">
        <ol className="no-scrollbar mb-10 flex gap-2 overflow-x-auto" aria-label="Étapes de la réservation">
          {STEPS.map((label, i) => (
            <li key={label} className="shrink-0">
              <button
                type="button"
                onClick={() => i < step && goTo(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={`flex items-center gap-3 rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors ${
                  i === step ? "border-accent text-bone" : i < step ? "border-line text-bone hover:border-bone/40" : "border-line text-mute"
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.6rem] ${i < step ? "bg-accent text-accent-ink" : i === step ? "bg-bone text-night" : "bg-steel"}`}>
                  {i < step ? <IconCheck /> : i + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol>

        <div ref={panel}>
          <h2 ref={heading} tabIndex={-1} className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold uppercase leading-none outline-none">
            {STEPS[step]}
          </h2>

          {step === 0 ? (
            <div className="mt-8 grid gap-6">
              <Field label="Voiture" error={errors.car} id="car">
                <select {...fieldProps("car")} className="field" value={data.car} onChange={(e) => set("car", e.target.value)}>
                  <option value="">Choisir une voiture…</option>
                  {CATEGORIES.map((cat) => (
                    <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
                      {cars
                        .filter((c) => c.category === cat)
                        .map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name} · {formatDZD(c.pricePerDay)}/jour
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
              {car ? (
                <Field label="Couleur souhaitée" id="color">
                  <select {...fieldProps("color")} className="field" value={data.color} onChange={(e) => set("color", e.target.value)}>
                    {car.colors.map((c) => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Agence de départ" id="pickupCity">
                  <select {...fieldProps("pickupCity")} className="field" value={data.pickupCity} onChange={(e) => set("pickupCity", e.target.value)}>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {c.airport}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Agence de retour" id="returnCity" hint={oneWay ? "Supplément aller simple appliqué." : undefined}>
                  <select {...fieldProps("returnCity")} className="field" value={data.returnCity} onChange={(e) => set("returnCity", e.target.value)}>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {c.airport}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid grid-cols-[1fr_7rem] gap-2">
                  <Field label="Départ" error={errors.from} id="from">
                    <input {...fieldProps("from")} type="date" className="field" min={minDate || undefined} value={data.from} onChange={(e) => set("from", e.target.value)} />
                  </Field>
                  <Field label="Heure" id="fromTime">
                    <select {...fieldProps("fromTime")} className="field px-2" value={data.fromTime} onChange={(e) => set("fromTime", e.target.value)}>
                      {TIMES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-[1fr_7rem] gap-2">
                  <Field label="Retour" error={errors.to} id="to">
                    <input {...fieldProps("to")} type="date" className="field" min={data.from || minDate || undefined} value={data.to} onChange={(e) => set("to", e.target.value)} />
                  </Field>
                  <Field label="Heure" id="toTime">
                    <select {...fieldProps("toTime")} className="field px-2" value={data.toTime} onChange={(e) => set("toTime", e.target.value)}>
                      {TIMES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <fieldset className="mt-8 grid gap-3">
              <legend className="sr-only">Options</legend>
              {extras.map((x) => {
                const checked = data.extras.includes(x.id);
                return (
                  <label
                    key={x.id}
                    className={`flex cursor-pointer items-center gap-5 rounded-[3px] border p-5 transition-colors ${checked ? "border-accent bg-coal" : "border-line hover:border-bone/30"}`}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-accent"
                      checked={checked}
                      onChange={() => set("extras", checked ? data.extras.filter((id) => id !== x.id) : [...data.extras, x.id])}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-2xl font-semibold uppercase leading-none">{x.name}</span>
                      <span className="mt-2 block text-sm text-mute">{x.description}</span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-xs">
                      +{formatDZD(x.pricePerDay)}
                      <span className="block text-mute">par jour</span>
                    </span>
                  </label>
                );
              })}
              <p className="mt-2 text-sm text-mute">Toutes les options sont facultatives. Vous pouvez aussi les ajouter à l&apos;agence.</p>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field label="Prénom" error={errors.firstName} id="firstName">
                <input {...fieldProps("firstName")} className="field" autoComplete="given-name" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </Field>
              <Field label="Nom" error={errors.lastName} id="lastName">
                <input {...fieldProps("lastName")} className="field" autoComplete="family-name" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </Field>
              <Field label="E-mail" error={errors.email} id="email">
                <input {...fieldProps("email")} type="email" className="field" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Téléphone mobile" error={errors.phone} id="phone">
                <input {...fieldProps("phone")} type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="05 / 06 / 07 …" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Âge du conducteur" error={errors.age} id="age" hint={car ? `Minimum ${car.minAge} ans pour cette voiture.` : undefined}>
                <input {...fieldProps("age")} inputMode="numeric" className="field" value={data.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, "").slice(0, 2))} />
              </Field>
              <Field label="Permis depuis" error={errors.license} id="license">
                <select {...fieldProps("license")} className="field" value={data.license} onChange={(e) => set("license", e.target.value)}>
                  <option value="">Choisir…</option>
                  <option value="lt2">Moins de 2 ans</option>
                  <option value="2-5">2 à 5 ans</option>
                  <option value="5+">Plus de 5 ans</option>
                </select>
              </Field>
              <Field label="Numéro de vol (facultatif)" id="flight" hint="Pour une livraison à l'aéroport, on suit votre vol en cas de retard.">
                <input {...fieldProps("flight")} className="field" placeholder="Ex. AH 1052" value={data.flight} onChange={(e) => set("flight", e.target.value)} />
              </Field>
              <Field label="Message (facultatif)" id="notes">
                <textarea {...fieldProps("notes")} rows={3} className="field" value={data.notes} onChange={(e) => set("notes", e.target.value)} />
              </Field>
            </div>
          ) : null}

          {step === 3 && car && q ? (
            <div className="mt-8 grid gap-6">
              <dl className="grid gap-px overflow-hidden rounded-[3px] border border-line bg-line sm:grid-cols-2">
                {[
                  ["Voiture", `${car.name} · ${data.color}`],
                  ["Départ", `${cityName(data.pickupCity)} · ${formatDate(data.from)} à ${data.fromTime}`],
                  ["Retour", `${cityName(data.returnCity)} · ${formatDate(data.to)} à ${data.toTime}`],
                  ["Conducteur", `${data.firstName} ${data.lastName} · ${data.age} ans`],
                  ["Contact", `${data.phone} · ${data.email}`],
                  ["Options", data.extras.length ? extras.filter((x) => data.extras.includes(x.id)).map((x) => x.name).join(", ") : "Aucune"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-night p-5">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-2 break-words text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-[3px] border border-line bg-coal p-5 text-sm leading-relaxed text-mute">
                À l&apos;agence : permis de conduire original, pièce d&apos;identité ou passeport, et caution de{" "}
                <span className="text-bone">{formatDZD(q.deposit)}</span> (espèces ou chèque, rendue au retour). Aucun paiement en ligne.
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  {...fieldProps("terms")}
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 accent-accent"
                  checked={data.terms}
                  onChange={(e) => set("terms", e.target.checked)}
                />
                <span className="text-sm">
                  J&apos;accepte les conditions de location : 300 km inclus par jour, carburant plein à plein, annulation gratuite jusqu&apos;à 48 h avant.
                </span>
              </label>
              {errors.terms ? (
                <p id="bk-terms-error" className="field-error -mt-3">
                  {errors.terms}
                </p>
              ) : null}
            </div>
          ) : null}

          {q ? (
            <div className="mt-10 flex items-end justify-between rounded-[3px] border border-line bg-coal px-5 py-4 lg:hidden" aria-live="polite">
              <div>
                <p className="eyebrow">Total · {q.days} jour{q.days > 1 ? "s" : ""}</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-mute">Caution {formatDZD(q.deposit)}</p>
              </div>
              <p className="font-display text-3xl font-semibold leading-none">{formatDZD(q.total)}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:pt-8">
            {step > 0 ? (
              <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={() => goTo(step - 1)}>
                <IconArrowLeft /> Retour
              </button>
            ) : (
              <Link href="/fleet" className="btn btn-ghost w-full sm:w-auto">
                <IconArrowLeft /> Voir la flotte
              </Link>
            )}
            <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-[14rem]" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink" aria-hidden="true" /> Envoi en cours…
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Confirmer la réservation <IconCheck />
                </>
              ) : (
                <>
                  Continuer <IconArrow />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <Summary carName={car?.name} carImage={car?.images[0].src} data={data} q={q} />
    </div>
  );
}

function Field({ label, id, error, hint, children }: { label: string; id: keyof FormData; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={`bk-${id}`} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`bk-${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs text-mute">{hint}</p>
      ) : null}
    </div>
  );
}

function Summary({ carName, carImage, data, q }: { carName?: string; carImage?: string; data: FormData; q: ReturnType<typeof quote> | null }) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Récapitulatif du prix">
      <div className="overflow-hidden rounded-[3px] border border-line bg-coal">
        {carImage ? (
          <div className="relative aspect-[16/9]">
            <Image src={carImage} alt="" fill sizes="380px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
            <p className="absolute bottom-4 left-5 font-display text-3xl font-semibold uppercase">{carName}</p>
          </div>
        ) : (
          <p className="p-6 text-sm text-mute">Choisissez une voiture pour voir le prix.</p>
        )}
        <div className="p-6" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute">
            {formatDate(data.from)} → {formatDate(data.to)}
          </p>
          {q ? (
            <>
              <dl className="mt-5 space-y-2 font-mono text-xs">
                <Row label={`Location · ${q.days} jour${q.days > 1 ? "s" : ""}`} value={formatDZD(q.base)} />
                {q.saving > 0 ? <Row label="Tarif semaine appliqué" value={`−${formatDZD(q.saving)}`} tone="success" /> : null}
                {q.lines.map((l) => (
                  <Row key={l.label} label={l.label} value={formatDZD(l.amount)} />
                ))}
                <Row label="Caution (rendue au retour)" value={formatDZD(q.deposit)} />
              </dl>
              <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
                <span className="eyebrow">Total</span>
                <span className="font-display text-4xl font-semibold leading-none">{formatDZD(q.total)}</span>
              </div>
              <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-mute">Payé à l&apos;agence · aucun prépaiement</p>
            </>
          ) : (
            <p className="mt-4 text-sm text-mute">Le total s&apos;affiche dès que la voiture et les dates sont choisies.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className={`flex justify-between gap-4 ${tone === "success" ? "text-success" : "text-mute"}`}>
      <dt>{label}</dt>
      <dd className={tone === "success" ? "" : "text-bone"}>{value}</dd>
    </div>
  );
}

function Confirmation({
  reference,
  data,
  carName,
  carImage,
  total,
  deposit,
  days,
  headingRef,
}: {
  reference: string;
  data: FormData;
  carName: string;
  carImage: string;
  total: number;
  deposit: number;
  days: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
  }, [headingRef]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".cf-item", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, delay: 0.5, ease: "power3.out" });
        gsap.from(".cf-sweep", { xPercent: -100, duration: 1.6, ease: "expo.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Bonjour ${site.name}, voici ma demande de réservation ${reference} : ${carName}, du ${data.from} ${data.fromTime} au ${data.to} ${data.toTime} (${cityName(data.pickupCity)}). Total annoncé : ${formatDZD(total)}.`,
  )}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div ref={root} className="relative overflow-hidden rounded-[3px] border border-line bg-coal">
      <span className="cf-sweep pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-accent/10 to-transparent" aria-hidden="true" />
      <div className="relative grid gap-10 p-6 md:grid-cols-[1fr_340px] md:p-12">
        <div>
          <svg className="check-draw h-20 w-20 text-accent" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M30 52l13 13 27-29" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 ref={headingRef} tabIndex={-1} className="cf-item mt-8 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold uppercase leading-[0.92] outline-none">
            Demande enregistrée<span className="text-accent">.</span>
          </h2>
          <p className="cf-item mt-5 max-w-lg text-bone/80">
            Merci {data.firstName}. Un conseiller vous appelle sous une heure pour confirmer la disponibilité de votre {carName}.
          </p>
          <div className="cf-item mt-8 inline-flex flex-wrap items-center gap-4 rounded-[3px] border border-line bg-night px-5 py-4">
            <span className="eyebrow">Référence</span>
            <span className="select-all font-mono text-xl tracking-[0.12em] text-accent">{reference}</span>
            <button type="button" onClick={copy} className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute hover:text-bone">
              {copied ? "Copiée ✓" : "Copier"}
            </button>
          </div>
          <p className="cf-item mt-6 text-xs text-mute">Ceci est une démonstration : aucune réservation réelle n&apos;a été envoyée.</p>
          <div className="cf-item mt-10 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              Retour à l&apos;accueil
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <IconWhatsApp className="text-base" /> Envoyer sur WhatsApp
            </a>
          </div>
        </div>
        <div className="cf-item overflow-hidden rounded-[3px] border border-line bg-night">
          <div className="relative aspect-[16/10]">
            <Image src={carImage} alt="" fill sizes="340px" className="object-cover" />
          </div>
          <dl className="space-y-3 p-5 font-mono text-xs">
            <Row label="Voiture" value={carName} />
            <Row label="Départ" value={`${formatDate(data.from)} · ${data.fromTime}`} />
            <Row label="Retour" value={`${formatDate(data.to)} · ${data.toTime}`} />
            <Row label="Durée" value={`${days} jour${days > 1 ? "s" : ""}`} />
            <Row label="Caution" value={formatDZD(deposit)} />
            <div className="flex items-end justify-between border-t border-line pt-4">
              <dt className="eyebrow">Total</dt>
              <dd className="font-display text-3xl font-semibold">{formatDZD(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
