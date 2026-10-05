import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, type Car } from "@/data/cars";
import { formatDZD, formatNumber } from "@/lib/format";
import { basePrice } from "@/lib/pricing";
import { IconArrow, IconFuel, IconGear, IconSeat } from "@/components/ui/Icons";

interface CarCardProps {
  car: Car;
  /** Rental length, to show the total for the chosen dates */
  days?: number;
  /** Query string carried to the detail page (dates, city) */
  query?: string;
  className?: string;
  priority?: boolean;
}

export default function CarCard({ car, days, query = "", className = "", priority = false }: CarCardProps) {
  const href = `/fleet/${car.slug}${query ? `?${query}` : ""}`;
  return (
    <article
      data-card={car.slug}
      className={`group relative flex flex-col overflow-hidden rounded-[3px] border border-line bg-coal transition-colors duration-500 hover:border-bone/25 ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel">
        <Image
          src={car.images[0].src}
          alt={car.images[0].alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-night/60 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] backdrop-blur-md">
          {CATEGORY_LABELS[car.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 md:p-6">
        <div>
          <p className="eyebrow">
            {car.brand} · {car.year}
          </p>
          <h3 className="mt-2 font-display text-[1.9rem] font-semibold uppercase leading-none tracking-wide">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {car.name}
            </Link>
          </h3>
        </div>

        <ul className="grid grid-cols-3 border-y border-line py-3 font-mono text-[0.7rem] text-mute">
          <li className="flex items-center gap-2">
            <IconSeat className="text-sm text-bone/70" /> {car.seats} places
          </li>
          <li className="flex items-center gap-2">
            <IconGear className="text-sm text-bone/70" /> {car.transmission === "Automatique" ? "Auto" : "Manuelle"}
          </li>
          <li className="flex items-center gap-2">
            <IconFuel className="text-sm text-bone/70" /> {car.fuel}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p>
              <span className="font-display text-[2rem] font-semibold leading-none">{formatNumber(car.pricePerDay)}</span>
              <span className="ml-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute">DA / jour</span>
            </p>
            <p className="mt-1 font-mono text-[0.68rem] text-mute">
              {days && days > 0
                ? `${days} jour${days > 1 ? "s" : ""} · ${formatDZD(basePrice(car, days))}`
                : `${formatDZD(car.pricePerWeek)} / semaine`}
            </p>
          </div>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-lg transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
            aria-hidden="true"
          >
            <IconArrow />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100" aria-hidden="true" />
    </article>
  );
}
