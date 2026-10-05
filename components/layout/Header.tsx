"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";
import { IconArrow, IconClose, IconMenu } from "@/components/ui/Icons";

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid ? "border-b border-line bg-night/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label={`${site.name}, accueil`} className="relative z-10">
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
            className="grid h-11 w-11 place-items-center border border-line text-xl md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-night md:hidden" data-lenis-prevent>
          <nav aria-label="Navigation mobile" className="container-x flex flex-1 flex-col justify-center gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-line py-4 font-display text-5xl font-semibold uppercase ${
                  isActive(l.href) ? "text-accent" : "text-bone"
                }`}
              >
                {l.label}
                <IconArrow className="text-2xl text-mute" />
              </Link>
            ))}
          </nav>
          <div className="container-x pb-10 font-mono text-xs leading-6 text-mute">
            <p>{site.phone}</p>
            <p>{site.email}</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
