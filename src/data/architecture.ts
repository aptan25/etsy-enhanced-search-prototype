// How Made for Them would be built inside Etsy: a proposal, not Etsy's real
// systems. Shown on /how-it-works and linked from each change's panel.

export type Part = {
  id: string;
  name: string;
  kind: "service" | "data";
  does: string;
  /** What fakes it in this prototype. */
  prototype: string;
  /** Whether Etsy has something like it today (checked on etsy.com 2026-11-12). */
  etsyToday: string;
};

export const parts = [
  {
    id: "identity",
    name: "Identity",
    kind: "service",
    does: "Guest id (cookie) until the buyer makes an account; on sign-up, the guest's saved people move to the account.",
    prototype: "None. Everyone is a guest in one browser.",
    etsyToday: "Accounts and guest checkout exist.",
  },
  {
    id: "profiles",
    name: "Recipient profiles",
    kind: "data",
    does: "Each saved person: name, relationship, occasions, likes, style, gifts given, feedback. Visible and editable by the buyer.",
    prototype: "Browser storage (peopleStore.ts).",
    etsyToday: "Nothing. Each gift search starts from zero.",
  },
  {
    id: "chat",
    name: "Gift chat",
    kind: "service",
    does: "An LLM turns what the buyer types into a draft profile (name, dates, likes). The buyer confirms before anything is saved.",
    prototype: "Scripted keyword matching (intent.ts).",
    etsyToday: "Gifting Assistant chat exists; it keeps nothing about the recipient.",
  },
  {
    id: "orders",
    name: "Orders + gift detector",
    kind: "service",
    does: "Flags orders that look like gifts (marked as gift, shipped to another name or address) and asks once who it was for.",
    prototype: "One hard-coded past order (data/orders.ts).",
    etsyToday: "Orders and “Mark order as gift” exist; nothing is asked afterwards.",
  },
  {
    id: "catalog",
    name: "Listing catalog",
    kind: "data",
    does: "Listing attributes: who it suits, interests, style. Etsy suggests them; the seller confirms.",
    prototype: "Hand-written tags (data/listings.ts).",
    etsyToday: "Listings have titles, tags and categories set by sellers.",
  },
  {
    id: "matching",
    name: "Matching + ranking",
    kind: "service",
    does: "Safe picks match stated likes; Something new tries a nearby interest; never repeats a past gift; feedback re-weights likes.",
    prototype: "Tag overlap scoring (match.ts).",
    etsyToday: "Search and recommendations, not tied to a recipient.",
  },
  {
    id: "addresses",
    name: "Address book",
    kind: "data",
    does: "The buyer's saved addresses. A person links to one (after the buyer agrees) instead of keeping a copy.",
    prototype: "None.",
    etsyToday: "Exists in the buyer's account.",
  },
  {
    id: "arrival",
    name: "Arrival estimator",
    kind: "service",
    does: "Processing time + transit to the recipient's ZIP gives an arrives-by date, and the order-by date for an occasion.",
    prototype: "None.",
    etsyToday: "“Get it by Nov 14–24” on item pages, to the buyer's own ZIP.",
  },
  {
    id: "occasions",
    name: "Occasion job",
    kind: "service",
    does: "Daily: finds each person's next occasion with no gift bought yet, and when to remind (before the order-by date).",
    prototype: "Worked out on page load (reminders.ts, occasions.ts).",
    etsyToday: "Gift Mode lists holiday dates; nothing per person.",
  },
  {
    id: "notify",
    name: "Notifications",
    kind: "service",
    does: "Email, push and the header bell. Respects opt-outs and how often we contact; guests get none.",
    prototype: "Static mockups.",
    etsyToday: "Email, push and bell exist for orders and sales.",
  },
] as const satisfies readonly Part[];

export type PartId = (typeof parts)[number]["id"];

export const partById = (id: PartId) => parts.find((p) => p.id === id)!;

/** What data moves where. Same flows as the team doc, section 4. */
export const flows: { name: string; trigger: string; data: string; savedTo: string; usedBy: string }[] = [
  { name: "Save from chat", trigger: "Buyer taps “Save Mom?”", data: "Name, relationship, dates, likes (pulled from the chat, confirmed by the buyer)", savedTo: "Recipient profile", usedBy: "Picks, reminders" },
  { name: "Save from quiz or relationship", trigger: "Buyer finishes the flow", data: "Photo choices → likes + style; relationship, budget, birthday", savedTo: "Recipient profile", usedBy: "Picks" },
  { name: "Save at checkout", trigger: "“Who is it for?” on a gift order", data: "Person, occasion, item, ship-to address (if the buyer agrees)", savedTo: "Profile: gift history + address link", usedBy: "Look-back, no repeat gifts, reminders" },
  { name: "Gift detected", trigger: "Order placed without “Mark order as gift”", data: "Ship-to name and address, date vs holidays, personalization", savedTo: "Order: likely-gift flag", usedBy: "Homepage prompt" },
  { name: "Picks", trigger: "Person page, search for a person, reminder", data: "Profile + listing attributes + arrival estimate", savedTo: "Not stored", usedBy: "Person page, item page, email" },
  { name: "Occasion job", trigger: "Daily", data: "Occasions, gift history, order-by dates", savedTo: "Reminder queue", usedBy: "Email, push, bell" },
  { name: "Look-back", trigger: "Occasion passed and a gift was bought", data: "Loved it / It was okay / Missed", savedTo: "Profile: feedback, likes re-weighted", usedBy: "Picks next time" },
  { name: "Guest → account", trigger: "Guest signs up or signs in", data: "Everyone saved under the guest id", savedTo: "Moved to the account", usedBy: "Everything above" },
];

/** Customer-facing pages. `href` is the prototype page when one exists. */
export const pages: { name: string; status: "Built" | "Partly" | "New"; href?: string; note: string }[] = [
  { name: "Homepage", status: "Built", href: "/entry/home-strip", note: "Next-occasion strip, past-order prompt" },
  { name: "Search results", status: "Built", href: "/entry/search-pill", note: "“Shopping for someone?” pill" },
  { name: "Gifts hub + chat", status: "Built", href: "/made-for-them", note: "“Shopping for” dropdown, your people, Save Mom? in the chat" },
  { name: "Item page", status: "Partly", href: "/listing/1619780681", note: "Missing: fit for a person, arrival to their ZIP" },
  { name: "Checkout", status: "Partly", href: "/entry/checkout", note: "Missing: recipient address, arrival vs the occasion" },
  { name: "Order confirmation", status: "New", note: "Save + create-account prompt for guests" },
  { name: "Sign in / create account", status: "Built", href: "/account", note: "Carries the guest's people over" },
  { name: "Your people", status: "Partly", href: "/made-for-them", note: "Strip only, no full page" },
  { name: "Person page", status: "Built", href: "/made-for-them/person?id=mom", note: "Likes, dates, gifts, picks" },
  { name: "Add a person", status: "Built", href: "/made-for-them#add", note: "Quiz, relationship, chat" },
  { name: "Occasions calendar", status: "New", note: "Every occasion with its order-by date" },
  { name: "Reminders", status: "Built", href: "/entry/reminder", note: "Bell + email mockups" },
  { name: "Look-back", status: "Built", href: "/made-for-them/lookback?id=mom", note: "Loved it / okay / missed" },
  { name: "People settings", status: "New", note: "Edit, delete, reminders off" },
];
