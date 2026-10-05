import Link from "next/link";
import { cities, site } from "@/data/site";
import { Wordmark } from "@/components/layout/Header";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconTikTok, IconWhatsApp } from "@/components/ui/Icons";

export default function Footer() {
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour ${site.name}, je souhaite louer une voiture.`)}`;
  return (
    <footer className="border-t border-line bg-coal">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-6 text-sm leading-relaxed text-mute">
            Location de voitures premium à Constantine, Alger et Oran. Livraison à l&apos;aéroport, assistance 24/7, prix tout compris en dinars.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary h-11 px-5">
              <IconWhatsApp className="text-base" /> WhatsApp
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn btn-ghost h-11 px-5">
              <IconPhone /> Appeler
            </a>
          </div>
          <ul className="mt-6 space-y-2 font-mono text-xs text-mute">
            <li className="flex items-center gap-2 select-all">
              <IconPhone aria-hidden="true" /> {site.phone}
            </li>
            <li className="flex items-center gap-2 select-all">
              <IconMail aria-hidden="true" /> {site.email}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Agences</h2>
          <ul className="mt-6 space-y-6">
            {cities.map((c) => (
              <li key={c.id}>
                <p className="font-display text-xl font-semibold uppercase tracking-wide">{c.name}</p>
                <p className="mt-1 text-sm text-mute">{c.airport}</p>
                <p className="text-sm text-mute">{c.hours}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Navigation</h2>
          <ul className="mt-6 space-y-3 text-sm">
            <li><Link href="/fleet" className="text-bone/80 transition-colors hover:text-accent">La flotte</Link></li>
            <li><Link href="/booking" className="text-bone/80 transition-colors hover:text-accent">Réserver</Link></li>
            <li><Link href="/contact" className="text-bone/80 transition-colors hover:text-accent">Contact & agences</Link></li>
          </ul>
          <h2 className="eyebrow mt-10">Suivez-nous</h2>
          <div className="mt-5 flex gap-3">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: IconInstagram },
              { href: site.social.facebook, label: "Facebook", Icon: IconFacebook },
              { href: site.social.tiktok, label: "TikTok", Icon: IconTikTok },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center border border-line text-lg transition-colors hover:border-accent hover:text-accent"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {site.name} · Site de démonstration, données fictives</span>
          <span>Réalisé par Nova Web Dz · @nova_webdz</span>
        </div>
      </div>
    </footer>
  );
}
