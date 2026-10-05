import { benefits } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { IconCancel, IconPlane, IconSupport, IconTag } from "@/components/ui/Icons";

const ICONS = { cancel: IconCancel, plane: IconPlane, support: IconSupport, tag: IconTag } as const;

export default function WhyUs() {
  return (
    <section className="container-x py-24 md:py-36" aria-labelledby="why-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          eyebrow="Pourquoi Cirta"
          title={<span id="why-title">Le service d&apos;un grand hôtel, au volant.</span>}
          intro="Des voitures récentes, préparées avant chaque location, et une équipe qui répond à toute heure."
        />
        <Reveal className="grid gap-px self-end overflow-hidden rounded-[3px] border border-line bg-line sm:grid-cols-2" stagger={0.1}>
          {benefits.map((b) => {
            const Icon = ICONS[b.icon];
            return (
              <div key={b.title} data-reveal className="group bg-night p-7 transition-colors duration-500 hover:bg-coal md:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-xl text-accent transition-colors duration-500 group-hover:border-accent">
                  <Icon />
                </span>
                <h3 className="mt-8 font-display text-2xl font-semibold uppercase tracking-wide">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{b.text}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
