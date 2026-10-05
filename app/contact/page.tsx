import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cities, site } from "@/data/site";
import { IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Cirta Motors à Constantine, Alger ou Oran. Téléphone, WhatsApp et formulaire.",
};

// Approximate positions on the stylised map (viewBox 600 × 300).
const PINS: Record<string, { x: number; y: number }> = {
  oran: { x: 120, y: 132 },
  alger: { x: 292, y: 96 },
  constantine: { x: 470, y: 118 },
};

export default function ContactPage() {
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour ${site.name}, j'ai une question.`)}`;
  return (
    <div className="container-x pb-24 pt-32 md:pb-32 md:pt-40">
      <SectionHeading
        as="h1"
        eyebrow="On vous répond 7j/7"
        title={
          <>
            Contact<span className="text-accent">.</span>
          </>
        }
        intro="Une question sur une voiture, une location longue durée ou un événement ? Écrivez-nous ou passez à l'agence."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
        <ContactForm />

        <div className="grid content-start gap-6">
          <div className="flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <IconWhatsApp className="text-base" /> WhatsApp
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn btn-ghost">
              <IconPhone /> {site.phone}
            </a>
          </div>
          <p className="flex items-center gap-2 font-mono text-xs text-mute select-all">
            <IconMail /> {site.email}
          </p>

          <figure className="overflow-hidden rounded-[3px] border border-line bg-coal">
            <svg viewBox="0 0 600 300" className="block h-auto w-full" role="img" aria-label="Carte de nos agences : Oran, Alger et Constantine">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M30 0H0V30" fill="none" stroke="#1f1f23" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="300" fill="url(#grid)" />
              <path d="M0 150 C60 140 90 120 130 125 C190 132 230 100 290 90 C350 82 400 104 460 100 C520 96 560 110 600 104" fill="none" stroke="#3a3a3f" strokeWidth="1.5" strokeDasharray="4 6" />
              <text x="20" y="60" fill="#5d5a55" fontFamily="monospace" fontSize="11" letterSpacing="3">MER MÉDITERRANÉE</text>
              {cities.map((c) => {
                const p = PINS[c.id];
                if (!p) return null;
                return (
                  <g key={c.id}>
                    <circle cx={p.x} cy={p.y} r="14" opacity="0.15" style={{ fill: "var(--color-accent)" }} />
                    <circle cx={p.x} cy={p.y} r="5" style={{ fill: "var(--color-accent)" }} />
                    <text x={p.x} y={p.y + 32} textAnchor="middle" fill="#ece8e1" fontFamily="monospace" fontSize="12" letterSpacing="2">
                      {c.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
            <figcaption className="border-t border-line px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mute">
              Carte interactive à intégrer (Google Maps ou Mapbox)
            </figcaption>
          </figure>

          <Reveal className="grid gap-px overflow-hidden rounded-[3px] border border-line bg-line" stagger={0.08}>
            {cities.map((c) => (
              <div key={c.id} data-reveal className="bg-night p-6">
                <p className="font-display text-3xl font-semibold uppercase leading-none">{c.name}</p>
                <p className="mt-3 flex items-start gap-2 text-sm text-bone/85">
                  <IconPin className="mt-0.5 shrink-0 text-accent" /> {c.address}
                </p>
                <p className="mt-1 pl-6 text-sm text-mute">
                  {c.airport} · {c.hours}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 pl-6 font-mono text-xs">
                  <span className="select-all text-mute">{c.phone}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
                  >
                    Itinéraire
                  </a>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
