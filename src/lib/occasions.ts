/**
 * A yearly date such as a birthday. `tag` links it to listing occasion tags.
 * Holidays like Mother's Day move each year: `nth` + `weekday` (0 = Sunday)
 * replace `day`, e.g. the 2nd Sunday of May.
 */
export type Occasion = { label: string; month: number; day: number; tag?: string; nth?: number; weekday?: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** The date of this occasion in a given year. */
export function dateIn(o: Occasion, year: number): Date {
  if (o.nth === undefined || o.weekday === undefined) return new Date(year, o.month - 1, o.day);
  const first = new Date(year, o.month - 1, 1).getDay();
  const offset = (o.weekday - first + 7) % 7;
  return new Date(year, o.month - 1, 1 + offset + (o.nth - 1) * 7);
}

/** The next time this occasion happens, counting today as "next". */
export function nextDate(o: Occasion, today: Date): Date {
  const t = startOfDay(today);
  const thisYear = dateIn(o, t.getFullYear());
  return thisYear >= t ? thisYear : dateIn(o, t.getFullYear() + 1);
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

/** "Nov 22". Movable holidays show their next date. */
export function formatDate(o: Occasion, today: Date) {
  const d = nextDate(o, today);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** An occasion name mid-sentence: "Mom's birthday", but "Mom's Christmas" (holidays keep their capitals). */
export function occasionPhrase(label: string) {
  return /christmas|'s day$/i.test(label) ? label : label.toLowerCase();
}

export function formatDays(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 21) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
}
