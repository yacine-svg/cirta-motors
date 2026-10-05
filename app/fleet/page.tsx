import type { Metadata } from "next";
import { Suspense } from "react";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import SectionHeading from "@/components/ui/SectionHeading";
import { cars } from "@/data/cars";

export const metadata: Metadata = {
  title: "La flotte",
  description: "Citadines, SUV, berlines de luxe et vans à louer à Constantine, Alger et Oran. Prix par jour en dinars, caution affichée.",
};

export default function FleetPage() {
  return (
    <div className="container-x pb-24 pt-32 md:pb-32 md:pt-40">
      <SectionHeading
        as="h1"
        eyebrow={`${cars.length} voitures · 4 catégories`}
        title={
          <>
            La flotte<span className="text-accent">.</span>
          </>
        }
        intro="Des voitures de moins de deux ans, entretenues chez le concessionnaire. Filtrez, comparez, réservez."
      />
      <div className="mt-14">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[3px] border border-line bg-coal" aria-hidden="true" />}>
          <FleetExplorer />
        </Suspense>
      </div>
    </div>
  );
}
