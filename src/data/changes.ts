import type { PartId } from "./architecture";

// One entry per thing we change on a page. Each <New> outline and concept label
// points at one of these; the side panel shows it and links to /how-it-works.

export type Change = {
  code: string;
  title: string;
  /** Prototype page where it shows up. */
  page: string;
  /** What Etsy does there today (checked on etsy.com 2026-11-12). */
  today: string;
  change: string;
  /** The class question it answers. */
  answers: string;
  reads: readonly string[];
  saves: readonly string[];
  parts: readonly PartId[];
};

export const changes = {
  "core-people": {
    code: "Core",
    title: "Your people on the gifts page",
    page: "/made-for-them",
    today: "Gift guides and a “Start a chat” button. Nothing about who you shop for.",
    change: "Saved people under the chat box, soonest occasion first.",
    answers: "Save once, shop for them every occasion.",
    reads: ["Recipient profiles", "Next occasion per person"],
    saves: [],
    parts: ["profiles", "occasions"],
  },
  "core-start": {
    code: "Core",
    title: "Three ways to start",
    page: "/made-for-them#add",
    today: "Gift Mode browse and the chat, with nothing kept.",
    change: "Quiz, relationship or chat, each ending in a saved person.",
    answers: "Someone you've never bought for.",
    reads: [],
    saves: [],
    parts: ["profiles"],
  },
  "1a-quiz": {
    code: "1a",
    title: "Taste quiz",
    page: "/made-for-them/new/quiz",
    today: "No quiz. Gift Mode lets you browse by interest or persona.",
    change: "Pick between two photos four times; the picks become likes and style.",
    answers: "Someone you've never bought for.",
    reads: ["Listing attributes of the photos"],
    saves: ["New recipient profile"],
    parts: ["catalog", "profiles"],
  },
  "1b-relationship": {
    code: "1b",
    title: "Start from who they are",
    page: "/made-for-them/new/relationship",
    today: "Gift Mode has recipient pages (Grandparent, Coworker) that save nothing.",
    change: "Relationship + occasion + budget shows what buyers pick for that kind of person; hearts teach the profile.",
    answers: "Someone you've never bought for.",
    reads: ["Listing attributes", "Popular picks per relationship"],
    saves: ["New recipient profile"],
    parts: ["catalog", "matching", "profiles"],
  },
  "1c-chat": {
    code: "1c",
    title: "Save them from the chat",
    page: "/made-for-them/new/chat",
    today: "Gifting Assistant chat finds ideas, then forgets the person.",
    change: "When the chat has a name, occasion and likes: “Save Maya?” with one tap.",
    answers: "Someone you've never bought for.",
    reads: ["What the buyer typed"],
    saves: ["New recipient profile (after the buyer confirms)"],
    parts: ["chat", "profiles", "identity"],
  },
  "1d-past-order": {
    code: "1d",
    title: "Save from a past order",
    page: "/entry/home-strip",
    today: "Past orders sit in Purchases. Nothing asks who they were for.",
    change: "An order that looks like a gift asks once: “Was this a Mother's Day gift?” Save starts the profile with that gift on record.",
    answers: "Someone you've never saved, but have bought for.",
    reads: ["Orders: ship-to name and address, order date, gift flag"],
    saves: ["New recipient profile with the gift in its history"],
    parts: ["orders", "profiles", "addresses"],
  },
  "2a-pill": {
    code: "2a",
    title: "Search bar pill",
    page: "/entry/search-pill",
    today: "Search knows nothing about who it's for.",
    change: "“Shopping for someone?” under the search bar opens your people and ranks results for them.",
    answers: "How buyers reach their people without a new page.",
    reads: ["Recipient profiles"],
    saves: [],
    parts: ["profiles", "matching"],
  },
  "2b-strip": {
    code: "2b",
    title: "Next-occasion strip",
    page: "/entry/home-strip",
    today: "The homepage shows general picks.",
    change: "A strip for the next occasion still needing a gift, e.g. “Mom's birthday in 12 days”.",
    answers: "How buyers reach their people.",
    reads: ["Recipient profiles", "Next open occasion"],
    saves: [],
    parts: ["profiles", "occasions", "matching"],
  },
  "2c-who": {
    code: "2c",
    title: "Who is it for? at checkout",
    page: "/entry/checkout",
    today: "“Mark order as gift” adds a message, wrap and a gift teaser. Who it's for isn't kept.",
    change: "Under the gift option: pick a saved person or add someone, plus the occasion. Saves the person and the gift.",
    answers: "How people get saved in the first place.",
    reads: ["Recipient profiles", "Next open occasion"],
    saves: ["Gift in the person's history", "New person (if added)", "Address link (if the buyer agrees)"],
    parts: ["profiles", "orders", "addresses", "identity"],
  },
  "2d-bell": {
    code: "2d",
    title: "Reminder in the bell",
    page: "/entry/reminder",
    today: "The bell shows orders, sales and shop updates.",
    change: "A reminder for the person's next occasion, sent before the order-by date, linking to their picks.",
    answers: "How buyers come back.",
    reads: ["Reminder queue"],
    saves: [],
    parts: ["occasions", "notify", "arrival"],
  },
  "2d-email": {
    code: "2d",
    title: "Reminder email",
    page: "/entry/reminder",
    today: "Marketing emails with general gift guides.",
    change: "One email per occasion with picks for that person. Only for signed-in buyers who opted in.",
    answers: "How buyers come back.",
    reads: ["Reminder queue", "Picks for the person"],
    saves: [],
    parts: ["occasions", "notify", "matching"],
  },
  "3a-person": {
    code: "3a",
    title: "Person page",
    page: "/made-for-them/person?id=maya",
    today: "No page per recipient.",
    change: "What Etsy remembers about them, editable, with dates, past gifts and two rows of picks.",
    answers: "Suggest new things, not just stated interests.",
    reads: ["Recipient profile", "Listing attributes"],
    saves: ["Edits to likes and dates"],
    parts: ["profiles", "matching", "catalog"],
  },
  "3a-new": {
    code: "3a",
    title: "Something new",
    page: "/made-for-them/person?id=maya",
    today: "Recommendations repeat what you already looked at.",
    change: "A second row that tries a nearby interest (pickleball → golf) the buyer never mentioned.",
    answers: "Suggest new things, not just stated interests.",
    reads: ["Recipient profile", "Nearby interests", "Gifts already given"],
    saves: [],
    parts: ["matching", "catalog"],
  },
  "3b-seller": {
    code: "3b",
    title: "Seller confirms attributes",
    page: "/seller/attributes",
    today: "Sellers write their own tags.",
    change: "Etsy suggests who an item suits from its photos; the seller confirms, and sees which buyers it now reaches.",
    answers: "Match beyond the literal interest.",
    reads: ["Listing photos and description"],
    saves: ["Confirmed listing attributes"],
    parts: ["catalog", "matching"],
  },
  "3c-lookback": {
    code: "3c",
    title: "Was it a hit?",
    page: "/made-for-them/lookback?id=mom",
    today: "A review request about the item, not the person.",
    change: "After the occasion: Loved it / It was okay / Missed. Updates the profile and sets up the next occasion.",
    answers: "Suggestions get better after each gift.",
    reads: ["The gift and its occasion"],
    saves: ["Feedback on the gift", "Re-weighted likes"],
    parts: ["profiles", "matching", "occasions"],
  },
} as const satisfies Record<string, Change>;

export type ChangeId = keyof typeof changes;

export const isChangeId = (id: string): id is ChangeId => Object.hasOwn(changes, id);
