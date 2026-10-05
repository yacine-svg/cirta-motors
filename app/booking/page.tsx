import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFlow from "@/components/booking/BookingFlow";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Réserver",
  description: "Réservez votre voiture en quatre étapes. Prix total calculé en direct, aucun paiement en ligne.",
};

export default function BookingPage() {
  return (
    <div className="container-x pb-24 pt-32 md:pb-32 md:pt-40">
      <SectionHeading
        as="h1"
        eyebrow="Réservation · 2 minutes"
        title={
          <>
            Réserver<span className="text-accent">.</span>
          </>
        }
        intro="Le prix se calcule pendant que vous choisissez. Aucun paiement en ligne : vous réglez à l'agence."
      />
      <div className="mt-14">
        <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-[3px] border border-line bg-coal" aria-hidden="true" />}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
