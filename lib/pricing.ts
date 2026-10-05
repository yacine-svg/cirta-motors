import type { Car } from "@/data/cars";
import { extras as EXTRAS, ONE_WAY_FEE } from "@/data/site";
import { parseISODate } from "@/lib/format";

/** Number of rental days, rounded up per started 24h. Returns 0 if the dates are invalid. */
export function rentalDays(from: string, fromTime: string, to: string, toTime: string): number {
  const a = parseISODate(from);
  const b = parseISODate(to);
  if (!a || !b) return 0;
  const [ah, am] = (fromTime || "10:00").split(":").map(Number);
  const [bh, bm] = (toTime || "10:00").split(":").map(Number);
  a.setHours(ah || 0, am || 0, 0, 0);
  b.setHours(bh || 0, bm || 0, 0, 0);
  const hours = (b.getTime() - a.getTime()) / 36e5;
  if (hours <= 0) return 0;
  return Math.max(1, Math.ceil(hours / 24));
}

/** Weekly rate for every full week, daily rate for the rest (never more than one extra week). */
export function basePrice(car: Car, days: number): number {
  if (days <= 0) return 0;
  const weeks = Math.floor(days / 7);
  const rest = days % 7;
  return weeks * car.pricePerWeek + Math.min(rest * car.pricePerDay, car.pricePerWeek);
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  days: number;
  base: number;
  saving: number;
  lines: QuoteLine[];
  total: number;
  deposit: number;
}

export function quote(car: Car, days: number, extraIds: string[] = [], oneWay = false): Quote {
  const base = basePrice(car, days);
  const saving = Math.max(0, car.pricePerDay * days - base);
  const lines: QuoteLine[] = [];
  for (const e of EXTRAS) {
    if (extraIds.includes(e.id)) lines.push({ label: e.name, amount: e.pricePerDay * days });
  }
  if (oneWay) lines.push({ label: "Retour dans une autre ville", amount: ONE_WAY_FEE });
  const total = base + lines.reduce((s, l) => s + l.amount, 0);
  const deposit = extraIds.includes("insurance") ? Math.round(car.deposit / 2) : car.deposit;
  return { days, base, saving, lines, total, deposit };
}
