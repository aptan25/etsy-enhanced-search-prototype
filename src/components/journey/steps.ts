import { personHref } from "@/components/mft/PeopleStrip";
import { lookbackHref } from "@/components/mft/PersonView";
import { getListings } from "@/lib/listings";
import { safePicks } from "@/lib/match";
import type { Person } from "@/lib/people";

/** Who the viewer plays in the guided demo. */
export const persona = { name: "Jess", initial: "J", goal: "shopping for Mom's Christmas gift" };

/**
 * The guided demo: Jess shopping for Mom, from a past order to a rated gift.
 * The panel moves on by itself when the viewer clicks the real link into the
 * next step's page. A step with `done` keeps Next locked until its action is
 * done, so later steps always have Mom to show. `target` makes the thing to
 * click pulse (it matches a `data-tour-target` attribute; see globals.css).
 */
export type Step = {
  path: string;
  /** What's happening, a few words. */
  title: string;
  /** The one thing to do. */
  action: string;
  /** Time skip shown with the step, e.g. "6 weeks before Christmas". */
  when?: string;
  target?: string;
  href: (people: Person[]) => string;
  done?: (people: Person[]) => boolean;
};

const mom = (people: Person[]) => people.find((p) => p.relationship === "mom");
const momPage = (people: Person[]) => {
  const m = mom(people);
  return m ? personHref(m.id) : "/entry/home-strip";
};
/** What "Buy for Mom" on her top pick would open. */
const momCheckout = (people: Person[]) => {
  const m = mom(people);
  const pick = m && safePicks(getListings(), m, 1)[0];
  return m && pick ? `/entry/checkout?item=${encodeURIComponent(pick.id)}&for=${encodeURIComponent(m.id)}` : "/entry/checkout";
};

export const steps: Step[] = [
  {
    path: "/entry/home-strip",
    title: "Etsy spots a gift you bought Mom in May",
    action: "Click “Save Mom”",
    target: "save-past-order",
    href: () => "/entry/home-strip",
    done: (people) => Boolean(mom(people)),
  },
  {
    path: "/entry/reminder",
    when: "6 weeks before Christmas",
    title: "Etsy reminds you about Christmas",
    action: "Click “Shop for Mom”",
    target: "reminder",
    href: () => "/entry/reminder",
  },
  {
    path: "/made-for-them/person",
    title: "Mom's page: everything Etsy knows about her",
    action: "She's into coffee lately. Add “coffee” to what she likes",
    target: "add-like",
    href: momPage,
    done: (people) => mom(people)?.interests.includes("coffee") ?? false,
  },
  {
    path: "/made-for-them/person",
    title: "Her picks updated right away",
    action: "Click “Buy for Mom” on any gift",
    target: "buy",
    href: momPage,
  },
  {
    path: "/entry/checkout",
    title: "Checkout already knows it's for Mom",
    action: "Click “Place order”",
    target: "place-order",
    href: momCheckout,
    done: (people) => (mom(people)?.history.length ?? 0) > 1,
  },
  {
    path: "/made-for-them/lookback",
    when: "After Christmas",
    title: "Etsy asks how the gift went",
    action: "Choose “Loved it”, then “Save feedback”",
    target: "save-feedback",
    href: (people) => (mom(people) ? lookbackHref(mom(people)!.id) : "/entry/home-strip"),
    done: (people) => mom(people)?.history.some((h) => h.outcome) ?? false,
  },
  {
    path: "/made-for-them/person",
    title: "Next time starts smarter",
    action: "Christmas is marked bought, and Mother's Day is next",
    href: momPage,
  },
];
