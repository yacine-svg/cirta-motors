import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, cars, getCar } from "@/data/cars";
import CarDetail from "@/components/car/CarDetail";
import CarCard from "@/components/CarCard";
import Reveal from "@/components/ui/Reveal";
import { formatDZD } from "@/lib/format";
import { IconArrowLeft, IconBag, IconBolt, IconCheck, IconDoor, IconFuel, IconGauge, IconGear, IconSeat, IconCalendar } from "@/components/ui/Icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return { title: "Voiture introuvable" };
  return {
    title: `${car.name} à louer`,
    description: `${car.name} (${CATEGORY_LABELS[car.category]}) à partir de ${formatDZD(car.pricePerDay)} par jour. ${car.tagline}`,
    openGraph: { images: [{ url: car.images[0].src, alt: car.images[0].alt }] },
  };
}

export default async function CarPage({ params }: Params) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();

  const specs = [
    { Icon: IconBolt, label: "Puissance", value: car.power },
    { Icon: IconGear, label: "Boîte", value: car.transmission },
    { Icon: IconFuel, label: "Carburant", value: car.fuel },
    { Icon: IconGauge, label: "Consommation", value: car.consumption },
    { Icon: IconSeat, label: "Places", value: String(car.seats) },
    { Icon: IconDoor, label: "Portes", value: String(car.doors) },
    { Icon: IconBag, label: "Bagages", value: `${car.bags} valises` },
    { Icon: IconCalendar, label: "Année", value: String(car.year) },
  ];
  const similar = cars.filter((c) => c.category === car.category && c.slug !== car.slug).slice(0, 3);

  return (
    <div className="container-x pb-24 pt-28 md:pb-32 md:pt-32">
      <nav aria-label="Fil d'Ariane" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/fleet" className="inline-flex items-center gap-2 transition-colors hover:text-bone">
              <IconArrowLeft /> La flotte
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{CATEGORY_LABELS[car.category]}</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-bone">
            {car.name}
          </li>
        </ol>
      </nav>

      <header className="mb-10 mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">
            {car.brand} · {car.year}
          </p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold uppercase leading-[0.9]">{car.name}</h1>
        </div>
        <p className="max-w-sm text-lg text-bone/80 md:text-right">{car.tagline}</p>
      </header>

      <CarDetail car={car}>
        <Reveal className="mt-16">
          <h2 className="eyebrow">Présentation</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bone/85">{car.description}</p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="eyebrow">Caractéristiques</h2>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line md:grid-cols-4">
            {specs.map(({ Icon, label, value }) => (
              <div key={label} className="bg-night p-5">
                <dt className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mute">
                  <Icon className="text-sm text-accent" /> {label}
                </dt>
                <dd className="mt-3 font-display text-2xl font-semibold uppercase">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="eyebrow">Inclus dans le prix</h2>
            <ul className="mt-6 space-y-3">
              {car.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-bone/90">
                  <IconCheck className="mt-1 shrink-0 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Tarifs</h2>
            <table className="mt-6 w-full font-mono text-sm">
              <tbody className="[&_td]:border-b [&_td]:border-line [&_td]:py-3">
                <tr>
                  <td className="text-mute">Par jour</td>
                  <td className="text-right">{formatDZD(car.pricePerDay)}</td>
                </tr>
                <tr>
                  <td className="text-mute">Par semaine (7 jours)</td>
                  <td className="text-right">{formatDZD(car.pricePerWeek)}</td>
                </tr>
                <tr>
                  <td className="text-mute">Caution</td>
                  <td className="text-right">{formatDZD(car.deposit)}</td>
                </tr>
                <tr>
                  <td className="text-mute">Âge minimum</td>
                  <td className="text-right">{car.minAge} ans</td>
                </tr>
                <tr>
                  <td className="text-mute">Kilométrage</td>
                  <td className="text-right">300 km / jour inclus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </CarDetail>

      {similar.length ? (
        <section className="mt-24 border-t border-line pt-16" aria-labelledby="similar-title">
          <h2 id="similar-title" className="font-display text-4xl font-semibold uppercase md:text-5xl">
            Dans la même catégorie
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {similar.map((c) => (
              <CarCard key={c.slug} car={c} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
