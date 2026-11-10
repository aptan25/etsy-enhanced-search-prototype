import { nextDate, upcoming, type Occasion } from "./occasions";
import type { Person } from "./people";

/**
 * True when the history already has a gift for this occasion in the year it
 * next happens, so Etsy doesn't remind you about a gift you already bought.
 */
export function covered(person: Person, occasion: Occasion, today: Date) {
  const year = nextDate(occasion, today).getFullYear();
  return person.history.some((h) => h.occasion === occasion.label && h.year === year);
}

/** This person's occasions that still need a gift, soonest first. */
export const openOccasions = (person: Person, today: Date) =>
  upcoming(person.occasions, today).filter(({ occasion }) => !covered(person, occasion, today));

/** The saved person with the soonest occasion that still needs a gift, and that occasion. */
export function nextReminder(people: Person[], today: Date) {
  return people
    .flatMap((person) => openOccasions(person, today).slice(0, 1).map((u) => ({ person, ...u })))
    .sort((a, b) => a.days - b.days)[0];
}

/**
 * The year a gift bought today counts toward: the next time the occasion
 * happens (Dec 20 for a Dec 18 exchange counts toward next year's). Occasions
 * the person doesn't have, like "Just because", count toward this year.
 */
export function giftYear(occasions: Occasion[], label: string, today: Date) {
  const o = occasions.find((x) => x.label === label);
  return (o ? nextDate(o, today) : today).getFullYear();
}
