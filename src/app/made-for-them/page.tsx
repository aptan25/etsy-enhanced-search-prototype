import Link from "next/link";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { GiftAsk } from "@/components/mft/GiftAsk";
import { PeopleStrip } from "@/components/mft/PeopleStrip";

const starts = [
  { href: "/made-for-them/new/quiz", title: "Take a quick taste quiz", body: "Pick between photos. Good when you don't know their hobbies yet." },
  { href: "/made-for-them/new/relationship", title: "Start from who they are", body: "Coworker, mom, friend? See what people like them get." },
  { href: "/made-for-them/new/chat", title: "Tell us in a chat", body: "Describe them in your own words. We'll keep the dates." },
];

// Made for Them: Etsy's new gift page, plus the people you shop for under the box.
export default function MadeForThemPage() {
  return (
    <>
      <Header />
      <ConceptNote code="Core" title="Gifts page with your people" answers="save once, shop for them every occasion." />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-4 py-12 text-center sm:px-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Find the perfect gift</h1>
            <p className="mb-6 mt-2 text-neutral-700">Tell us who it&apos;s for and we&apos;ll find ideas.</p>
            <GiftAsk action="/made-for-them/new/chat" />
            <h2 className="mb-3 mt-10 text-left text-lg font-semibold sm:text-center">Your people</h2>
            <PeopleStrip />
          </div>
        </section>

        <section id="add" className="mx-auto max-w-[1400px] scroll-mt-4 px-4 py-10 sm:px-8">
          <h2 className="text-lg font-semibold">Shopping for someone new?</h2>
          <p className="text-sm text-neutral-600">Three ways to start, even if you&apos;ve never bought them a gift.</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {starts.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="block h-full rounded-xl border border-neutral-200 p-5 hover:border-neutral-900">
                  <span className="font-semibold">{s.title} →</span>
                  <span className="mt-1 block text-sm text-neutral-600">{s.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
