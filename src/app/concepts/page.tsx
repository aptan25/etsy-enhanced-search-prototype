import Link from "next/link";
import { ResetDemo } from "@/components/mft/ResetDemo";

type Concept = { code: string; title: string; href: string; body: string };

const groups: { question: string; concepts: Concept[] }[] = [
  {
    question: "Baseline",
    concepts: [
      { code: "Now", title: "Etsy today: homepage + search", href: "/", body: "Keyword search; lookalikes with the most reviews rank first." },
      { code: "Now", title: "Etsy today: AI gift page", href: "/gifts", body: "The Nov 2026 gift page. Finds this gift, keeps nothing for the next." },
      { code: "Core", title: "Made for Them gifts page", href: "/made-for-them", body: "Same page with your saved people under the box." },
    ],
  },
  {
    question: "How does it work for someone you've never bought for?",
    concepts: [
      { code: "1a", title: "Taste quiz", href: "/made-for-them/new/quiz", body: "Four photo picks build a starting profile." },
      { code: "1b", title: "Start from who they are", href: "/made-for-them/new/relationship", body: "Relationship, occasion, budget; heart items to teach it." },
      { code: "1c", title: "Start from a chat", href: "/made-for-them/new/chat", body: "Describe them; Etsy keeps the name, dates and likes." },
      { code: "1d", title: "Start from a past order", href: "/journey", body: "A gift-like past order offers to save who it was for. Shown in the guided demo." },
    ],
  },
  {
    question: "How do people get to their saved people if it isn't the homepage?",
    concepts: [
      { code: "2a", title: "Search bar pill", href: "/entry/search-pill", body: "“Shopping for someone?” under the search bar." },
      { code: "2b", title: "Homepage strip", href: "/entry/home-strip", body: "The next occasion, like Mom's birthday, inside today's homepage." },
      { code: "2c", title: "Save at checkout", href: "/entry/checkout", body: "“Who is this for?” when buying a gift." },
      { code: "2d", title: "Reminders", href: "/entry/reminder", body: "Notification bell and email before the occasion." },
    ],
  },
  {
    question: "How do we suggest new things, not just the stated interests?",
    concepts: [
      { code: "3a", title: "Picks + Something new", href: "/made-for-them/person?id=maya", body: "Maya likes pickleball; “Something new” tries golf." },
      { code: "3b", title: "Seller confirms attributes", href: "/seller/attributes", body: "Sellers confirm who an item is great for; see who it reaches." },
      { code: "3c", title: "Was it a hit?", href: "/made-for-them/lookback?id=mom", body: "Feedback after the occasion updates the profile." },
    ],
  },
];

// Presenter index. Not part of the Etsy UI.
export default function ConceptsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <p className="font-serif text-2xl text-etsy">Etsy · Made for Them</p>
      <h1 className="mt-1 text-3xl font-semibold">Concepts</h1>
      <p className="mt-2 max-w-2xl text-neutral-700">
        One page per idea, grouped by the class feedback it answers. Saved people are kept in this browser only; reset before each demo.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link href="/journey" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700">
          Guided demo: one buyer, start to finish →
        </Link>
        <ResetDemo />
      </div>

      {groups.map((g) => (
        <section key={g.question} className="mt-10">
          <h2 className="text-lg font-semibold">{g.question}</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.concepts.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="block h-full rounded-xl border border-neutral-200 p-4 hover:border-neutral-900">
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-950">{c.code}</span>
                  <span className="mt-2 block font-semibold">{c.title} →</span>
                  <span className="mt-1 block text-sm text-neutral-600">{c.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
