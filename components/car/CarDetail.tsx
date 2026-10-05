"use client";

import { Suspense, useState, type ReactNode } from "react";
import type { Car } from "@/data/cars";
import CarViewer from "@/components/car/CarViewer";
import BookingCard from "@/components/car/BookingCard";

/** Client wrapper so the viewer and the booking card share the selected color. */
export default function CarDetail({ car, children }: { car: Car; children: ReactNode }) {
  const [colorIndex, setColorIndex] = useState(0);
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
      <div className="min-w-0">
        <CarViewer car={car} colorIndex={colorIndex} onColorChange={setColorIndex} />
        {children}
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Réserver cette voiture">
        <Suspense fallback={<div className="h-[34rem] animate-pulse rounded-[3px] border border-line bg-coal" />}>
          <BookingCard car={car} color={car.colors[colorIndex].name} />
        </Suspense>
      </aside>
    </div>
  );
}
