import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import { IconArrow, IconWhatsApp } from "@/components/ui/Icons";

export default function CtaBanner() {
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour ${site.name}, je souhaite réserver une voiture.`)}`;
  return (
    <section className="container-x pb-24 md:pb-32" aria-labelledby="cta-title">
      <div className="relative overflow-hidden rounded-[3px] border border-line">
        <Image
          src="https://images.unsplash.com/photo-1501290301209-7a0323622985?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-night/20" aria-hidden="true" />
        <Reveal className="relative px-6 py-16 md:px-14 md:py-24" stagger={0.1}>
          <p data-reveal className="eyebrow text-bone/70">
            Arrivée de nuit ? On est là.
          </p>
          <h2 id="cta-title" data-reveal className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,7vw,5.8rem)] font-semibold uppercase leading-[0.9]">
            Votre voiture vous attend à l&apos;arrivée<span className="text-accent">.</span>
          </h2>
          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <Link href="/booking" className="btn btn-primary">
              Réserver maintenant <IconArrow />
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost bg-night/40 backdrop-blur-md">
              <IconWhatsApp className="text-base" /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
