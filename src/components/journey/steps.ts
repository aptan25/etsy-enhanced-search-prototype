import { personHref } from "@/components/mft/PeopleStrip";
import type { Person } from "@/lib/people";

/**
 * The guided demo: one buyer, Sam, from "bought here before, saved no one" to
 * two saved people with reminders and a rated gift. Each step names the page it
 * happens on; the bar moves on by itself when the viewer clicks the real link
 * into the next step's page, or when `autoNext` says the step's action is done.
 */
export type Step = {
  path: string;
  title: string;
  body: string;
  /** Time skip shown above the step, e.g. "3 weeks before Christmas". */
  when?: string;
  href: (people: Person[]) => string;
  autoNext?: (people: Person[]) => boolean;
};

const mom = (people: Person[]) => people.find((p) => p.relationship === "mom");
const maya = (people: Person[]) => people.find((p) => p.relationship === "coworker");
const profile = (p: Person | undefined) => (p ? personHref(p.id) : "/made-for-them");

export const steps: Step[] = [
  {
    path: "/entry/home-strip",
    title: "Sam has bought here before",
    body: "You're Sam: signed in, with past orders, and no saved people yet. Etsy sees that your May necklace order shipped to your mom before Mother's Day. Click “Save Mom”.",
    href: () => "/entry/home-strip",
    autoNext: (people) => Boolean(mom(people)),
  },
  {
    path: "/entry/home-strip",
    title: "Mom is on your homepage",
    body: "Saving a mom adds Mother's Day and Christmas, so her next occasion now sits at the top of the homepage. Click that strip.",
    href: () => "/entry/home-strip",
  },
  {
    path: "/made-for-them/person",
    title: "Mom's page",
    body: "Etsy remembers what the necklace says about her, her dates, and the gift itself. “Picks” match what she likes; “Something new” goes beyond it. Press Next.",
    href: (people) => profile(mom(people)),
  },
  {
    path: "/entry/search-pill",
    title: "Someone you've never bought for",
    body: "Your coworker Maya has a gift exchange coming up, and you've never bought her anything. Under the search bar, in “Shopping for someone?”, click “+ Someone new”.",
    href: () => "/entry/search-pill",
  },
  {
    path: "/made-for-them",
    title: "Three ways to start from zero",
    body: "A quiz, a relationship, or a chat: each works with no history. Click “Tell us in a chat”.",
    href: () => "/made-for-them#add",
  },
  {
    path: "/made-for-them/new/chat",
    title: "Tell Etsy about Maya",
    body: "Tap “My coworker Maya, gift exchange Dec 18”, then “Pickleball and coffee”. Etsy keeps her name, date and likes. Click “Save Maya”.",
    href: () => "/made-for-them/new/chat",
  },
  {
    path: "/made-for-them/person",
    title: "Maya is saved",
    body: "Her gift exchange date came from the chat. Her picks include a pickleball bag; press Next to buy it.",
    href: (people) => profile(maya(people)),
  },
  {
    path: "/entry/checkout",
    title: "Buy the gift",
    body: "Under “Who is it for?”, pick Maya (her occasion fills in), then “Place order”. The gift goes into her history.",
    href: () => "/entry/checkout",
  },
  {
    path: "/entry/reminder",
    when: "Weeks later",
    title: "Etsy reminds you",
    body: "Maya's exchange is covered, so the reminder is for Mom's Christmas, in the bell and by email. Click “See picks for Mom” (or “Shop for Mom” in the email).",
    href: () => "/entry/reminder",
  },
  {
    path: "/made-for-them/person",
    title: "Back on Mom's page",
    body: "Shop from her picks. Etsy also asks how past gifts went: under “Gift history”, click “How did it go?” next to the necklace.",
    href: (people) => profile(mom(people)),
  },
  {
    path: "/made-for-them/lookback",
    title: "Was it a hit?",
    body: "Choose “Loved it”, tap what she liked, then “Save feedback”. Mom's profile learns from it, and the next occasion is set up.",
    href: (people) => (mom(people) ? `/made-for-them/lookback?id=${encodeURIComponent(mom(people)!.id)}` : "/made-for-them"),
  },
  {
    path: "/made-for-them",
    title: "Where Sam ends up",
    body: "Two saved people, one from a past order and one from a chat, each with dates, reminders and gift history. That's the whole journey.",
    href: () => "/made-for-them",
  },
];
