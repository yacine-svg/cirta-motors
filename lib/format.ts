const numberFmt = new Intl.NumberFormat("fr-FR");

export function formatNumber(n: number): string {
  return numberFmt.format(Math.round(n));
}

export function formatDZD(n: number): string {
  return `${formatNumber(n)} DA`;
}

/** Parse "YYYY-MM-DD" as a local date (no time-zone shift). */
export function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" });

export function formatDate(value: string): string {
  const d = parseISODate(value);
  return d ? dateFmt.format(d) : "—";
}

export const TIMES: string[] = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
