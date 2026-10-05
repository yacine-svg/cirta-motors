import { testimonials } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  return (
    <section className="container-x py-24 md:py-36" aria-labelledby="reviews-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Ils ont roulé avec nous" title={<span id="reviews-title">Ce qu&apos;ils en disent.</span>} />
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">Témoignages fictifs · démonstration</p>
      </div>
      <Reveal className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.12}>
        {testimonials.map((t) => (
          <figure key={t.name} data-reveal className="flex flex-col justify-between rounded-[3px] border border-line bg-coal p-7 md:p-8">
            <blockquote className="text-lg leading-relaxed text-bone/90">
              <span className="font-display text-5xl leading-none text-accent" aria-hidden="true">
                “
              </span>
              <p className="-mt-3">{t.quote}</p>
            </blockquote>
            <figcaption className="mt-10 border-t border-line pt-5">
              <p className="font-display text-xl font-semibold uppercase tracking-wide">{t.name}</p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute">
                {t.city} · {t.car}
              </p>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
