import { nextDate, upcoming } from "./occasions";
import type { Person } from "./people";

/**
 * The saved person with the soonest occasion that still needs a gift, and that
 * occasion. An occasion counts as covered when the history already has a gift
 * for it in the year it next happens, so Etsy doesn't remind you about a gift
 * you already bought.
 */
export function nextReminder(people: Person[], today: Date) {
  return people
    .flatMap((person) =>
      upcoming(person.occasions, today)
        .filter(({ occasion }) => {
          const year = nextDate(occasion, today).getFullYear();
          return !person.history.some((h) => h.occasion === occasion.label && h.year === year);
        })
        .slice(0, 1)
        .map((u) => ({ person, ...u })),
    )
    .sort((a, b) => a.days - b.days)[0];
}
