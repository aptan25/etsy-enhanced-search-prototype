/** A yearly date such as a birthday. `tag` links it to listing occasion tags. */
export type Occasion = { label: string; month: number; day: number; tag?: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** The next time this occasion happens, counting today as "next". */
export function nextDate(o: Occasion, today: Date): Date {
  const t = startOfDay(today);
  const thisYear = new Date(t.getFullYear(), o.month - 1, o.day);
  return thisYear >= t ? thisYear : new Date(t.getFullYear() + 1, o.month - 1, o.day);
}

export function daysUntil(o: Occasion, today: Date): number {
  const ms = nextDate(o, today).getTime() - startOfDay(today).getTime();
  // Round, not floor: a daylight-saving change makes some days 23 or 25 hours.
  return Math.round(ms / 86_400_000);
}

/** Occasions sorted soonest first, each with its day count. */
export function upcoming(occasions: Occasion[], today: Date) {
  return occasions
    .map((occasion) => ({ occasion, days: daysUntil(occasion, today) }))
    .sort((a, b) => a.days - b.days);
}

export function formatDate(o: Pick<Occasion, "month" | "day">) {
  return `${MONTHS[o.month - 1]} ${o.day}`;
}

export function formatDays(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 21) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
}
