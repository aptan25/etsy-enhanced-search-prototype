import { personHref } from "@/components/mft/PeopleStrip";
import { lookbackHref } from "@/components/mft/PersonView";
import { getListings } from "@/lib/listings";
import { safePicks } from "@/lib/match";
import type { Account } from "@/lib/accountStore";
import { nextDate } from "@/lib/occasions";
import { suggestedOccasions, type Person } from "@/lib/people";

/** Who the viewer plays in the guided demo. */
export const persona = {
  name: "Jess",
  initial: "J",
  email: "jess@example.com",
  goal: "new to Etsy, shopping for Mom's Christmas gift",
};

/**
 * The guided demo: a first-time buyer, not signed in, from the gifts page to
 * a reminder before the next occasion. The panel moves on by itself when the
 * viewer clicks the real link into the next step's page. A step with `done`
 * keeps Next locked until its action is done, so later steps always have Mom
 * to show. `target` makes the thing to click pulse (it matches a
 * `data-tour-target` attribute; see globals.css). `asOf` shows the page as if
 * it were that date, for a time skip whose dates are on screen.
 */
export type Step = {
  path: string;
  /** What's happening, a few words. */
  title: string;
  /** The one thing to do. */
  action: string;
  /** Time skip shown with the step, e.g. "After Christmas". */
  when?: string;
  target?: string;
  href: (people: Person[], account: Account | null) => string;
  done?: (people: Person[], account: Account | null) => boolean;
  asOf?: (now: Date) => Date;
};

const mom = (people: Person[]) => people.find((p) => p.relationship === "mom");
const momPage = (people: Person[]) => {
  const m = mom(people);
  return m ? personHref(m.id) : "/made-for-them";
};
/** What "Buy for Mom" on her top pick would open. */
const momCheckout = (people: Person[]) => {
  const m = mom(people);
  const pick = m && safePicks(getListings(), m, 1)[0];
  return m && pick ? `/entry/checkout?item=${encodeURIComponent(pick.id)}&for=${encodeURIComponent(m.id)}` : "/entry/checkout";
};
const mothersDay = suggestedOccasions.mom.find((o) => o.label === "Mother's Day")!;
/** The reminder skips ahead to 3 weeks before Mother's Day; the last step stays there. */
const beforeMothersDay = (now: Date) => {
  const d = nextDate(mothersDay, now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 21);
};

export const steps: Step[] = [
  {
    path: "/made-for-them",
    title: "Etsy's gifts page. You're not signed in",
    action: "Click “A Christmas gift for my mom”",
    target: "ask-mom",
    href: () => "/made-for-them",
  },
  {
    path: "/made-for-them/new/chat",
    title: "The gift chat asks what she likes",
    action: "Click “Gardening and pottery, rustic stuff”, then “Save Mom”",
    target: "chat",
    href: () => `/made-for-them/new/chat?q=${encodeURIComponent("A Christmas gift for my mom")}`,
    done: (people) => Boolean(mom(people)),
  },
  {
    path: "/made-for-them/person",
    title: "Mom is saved in this browser, no account needed",
    action: "Click “Buy for Mom” on any gift",
    target: "buy",
    href: momPage,
  },
  {
    path: "/entry/checkout",
    title: "Guest checkout already knows it's for Mom",
    action: "Click “Place order”, then “Create account”",
    target: "checkout",
    href: momCheckout,
    done: (people, account) => (mom(people)?.history.length ?? 0) > 0 && account !== null,
  },
  {
    path: "/made-for-them/lookback",
    when: "After Christmas",
    title: "Etsy asks how the gift went",
    action: "Choose “Loved it”, then “Save feedback”",
    target: "save-feedback",
    href: (people) => (mom(people) ? lookbackHref(mom(people)!.id) : "/made-for-them"),
    done: (people) => mom(people)?.history.some((h) => h.outcome) ?? false,
  },
  {
    path: "/entry/reminder",
    when: "3 weeks before Mother's Day",
    title: "Signed in, so Etsy reminds you",
    action: "Click “See picks for Mom”",
    target: "reminder",
    href: () => "/entry/reminder",
    asOf: beforeMothersDay,
  },
  {
    path: "/made-for-them/person",
    when: "3 weeks before Mother's Day",
    title: "Next time starts smarter",
    action: "Mother's Day is next, and her gift history shows the Christmas gift she loved",
    href: momPage,
    asOf: beforeMothersDay,
  },
];
