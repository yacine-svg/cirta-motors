"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { cities, site } from "@/data/site";
import { IconArrow, IconWhatsApp } from "@/components/ui/Icons";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/fleet", label: "La flotte" },
  { href: "/booking", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-[1.65rem] font-semibold leading-none tracking-[0.14em]">{site.wordmark}</span>
      <span className="h-[3px] w-4 translate-y-[-0.35rem] bg-accent" aria-hidden="true" />
      <span className="font-mono text-[0.62rem] tracking-[0.32em] text-mute">{site.suffix}</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  // Lock page scroll on phones (native touch scrolling) while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Close if the screen grows to desktop size.
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour ${site.name}, je souhaite louer une voiture.`)}`;

  // Header background: opaque when the menu is open, frosted after scrolling, transparent over the hero.
  const headerBg = open
    ? "border-b border-line bg-night"
    : scrolled
      ? "border-b border-line bg-night/80 backdrop-blur-xl"
      : "border-b border-transparent bg-transparent";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-500 ${headerBg}`}>
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <Link href="/" aria-label={`${site.name}, accueil`} className="relative z-10" onClick={() => setOpen(false)}>
            <Wordmark />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`group relative font-mono text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isActive(l.href) ? "text-bone" : "text-bone/60 hover:text-bone"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-accent transition-all duration-500 ${
                    isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/booking" className="btn btn-primary hidden h-11 px-5 md:inline-flex">
              Réserver
            </Link>
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-night/40 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span
                className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-[var(--ease-premium)] ${open ? "rotate-45" : "-translate-y-[4px]"}`}
                aria-hidden="true"
              />
              <span
                className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-[var(--ease-premium)] ${open ? "-rotate-45" : "translate-y-[4px]"}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: a sibling of <header> (not a child) so it always covers the whole screen. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-0 z-[55] flex h-[100dvh] flex-col bg-night transition-[opacity,visibility] duration-500 ease-[var(--ease-premium)] md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,181,71,0.10),transparent_55%)]" aria-hidden="true" />
        <div className="relative flex flex-1 flex-col overflow-y-auto pt-24" style={{ paddingBottom: "calc(1.75rem + env(safe-area-inset-bottom, 0px))" }}>
          <nav aria-label="Navigation mobile" className="container-x">
            <ul className="border-t border-line">
              {LINKS.map((l, i) => (
                <li
                  key={l.href}
                  className={`border-b border-line transition-[opacity,transform] duration-700 ease-[var(--ease-premium)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
                >
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-5 font-display text-[2.6rem] font-semibold uppercase leading-none ${
                      isActive(l.href) ? "text-accent" : "text-bone"
                    }`}
                  >
                    {l.label}
                    <IconArrow className={`text-xl ${isActive(l.href) ? "text-accent" : "text-mute"}`} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`container-x mt-auto pt-10 transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: open ? "420ms" : "0ms" }}
          >
            <div className="grid gap-3">
              <Link href="/booking" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                Réserver une voiture <IconArrow />
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
                <IconWhatsApp className="text-base" /> WhatsApp
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6">
              {cities.map((c) => (
                <div key={c.id}>
                  <p className="font-display text-lg font-semibold uppercase leading-none">{c.name}</p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-mute">{c.hours}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 select-all font-mono text-xs text-mute">{site.phone}</p>
          </div>
        </div>
      </div>
    </>
  );
}
