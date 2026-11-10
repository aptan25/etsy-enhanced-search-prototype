import { personHref } from "@/components/mft/PeopleStrip";
import { lookbackHref } from "@/components/mft/PersonView";
import type { Person } from "@/lib/people";

/** Who the viewer plays in the guided demo. */
export const persona = {
  name: "Jess",
  initial: "J",
  about:
    "You're Jess, 29, signed in to Etsy. In May you bought your mom a name necklace for Mother's Day. Christmas is coming and you haven't thought about her gift yet.",
};

/**
 * The guided demo: Jess shopping for Mom, from a past order to a rated gift.
 * The panel moves on by itself when the viewer clicks the real link into the
 * next step's page; otherwise they press Next. `target` makes the thing to
 * click pulse (it matches a `data-tour-target` attribute; see globals.css).
 */
export type Step = {
  path: string;
  title: string;
  body: string;
  /** Time skip shown with the step, e.g. "6 weeks before Christmas". */
  when?: string;
  target?: string;
  href: (people: Person[]) => string;
  /** When true, the step's action is done and Next is highlighted. */
  done?: (people: Person[]) => boolean;
};

const mom = (people: Person[]) => people.find((p) => p.relationship === "mom");
const momPage = (people: Person[]) => {
  const m = mom(people);
  return m ? personHref(m.id) : "/entry/home-strip";
};

export const steps: Step[] = [
  {
    path: "/entry/home-strip",
    title: "Etsy remembers your Mother's Day order",
    body: "You haven't saved anyone on Etsy. But it sees the necklace you sent to your mom right before Mother's Day. Click “Save Mom”.",
    target: "save-past-order",
    href: () => "/entry/home-strip",
    done: (people) => Boolean(mom(people)),
  },
  {
    path: "/entry/reminder",
    when: "6 weeks before Christmas",
    title: "Etsy reminds you, so you don't have to",
    body: "An email arrives with ideas for Mom, picked from what the necklace says about her. Click “Shop for Mom”.",
    target: "reminder",
    href: () => "/entry/reminder",
  },
  {
    path: "/made-for-them/person",
    title: "Mom's page",
    body: "Everything Etsy knows about her is here, and you can change it. She's been into coffee lately: open “+ Add something they like” and choose coffee.",
    target: "add-like",
    href: momPage,
    done: (people) => mom(people)?.interests.includes("coffee") ?? false,
  },
  {
    path: "/made-for-them/person",
    title: "Pick her gift",
    body: "The picks changed as soon as you added coffee. “Something new” shows ideas you never mentioned. Click “Buy for Mom” on a gift you like.",
    target: "buy",
    href: momPage,
  },
  {
    path: "/entry/checkout",
    title: "Checkout already knows who it's for",
    body: "Mom and Christmas are filled in. Click “Place order” (nothing is charged), then Next.",
    target: "place-order",
    href: () => "/entry/checkout",
    done: (people) => (mom(people)?.history.length ?? 0) > 1,
  },
  {
    path: "/made-for-them/lookback",
    when: "After Christmas",
    title: "Was it a hit?",
    body: "Etsy asks one question. Choose “Loved it”, tap what she liked, then “Save feedback”.",
    target: "save-feedback",
    href: (people) => (mom(people) ? lookbackHref(mom(people)!.id) : "/entry/home-strip"),
    done: (people) => mom(people)?.history.some((h) => h.outcome) ?? false,
  },
  {
    path: "/made-for-them/person",
    title: "Next time is easier",
    body: "Christmas shows “Gift bought”, her history has both gifts and what she loved, and her next occasion is up next, with picks that already know her.",
    href: momPage,
  },
];
