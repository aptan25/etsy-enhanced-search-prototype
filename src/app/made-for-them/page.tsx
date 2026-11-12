import Link from "next/link";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { GiftHub } from "@/components/mft/GiftHub";
import { ShoppingForChat } from "@/components/mft/ShoppingForChat";
import { PeopleStrip } from "@/components/mft/PeopleStrip";
import { New } from "@/components/mft/New";

const starts = [
  { href: "/made-for-them/new/quiz", title: "Take a quick taste quiz", body: "Pick between photos. Good when you don't know their hobbies yet." },
  { href: "/made-for-them/new/relationship", title: "Start from who they are", body: "Coworker, mom, friend? See what people like them get." },
  { href: "/made-for-them/new/chat", title: "Tell us in a chat", body: "Describe them in your own words. We'll keep the dates." },
];

// Made for Them: Etsy's gifts hub with a "Shopping for" dropdown on the chat card,
// plus the people you shop for under the guides.
export default function MadeForThemPage() {
  return (
    <>
      <Header />
      <ConceptNote change="core-people" code="Core" title="Gifts page with your people" answers="save once, shop for them every occasion." />
      <GiftHub chat={<ShoppingForChat />}>
        <section className="mt-10">
          <New change="core-people" label="New: your saved people">
            <h2 className="mb-3 pt-2 text-lg font-semibold">Your people</h2>
            <PeopleStrip />
          </New>
        </section>
        <section id="add" className="mt-10 scroll-mt-4">
          <New change="core-start" label="New: three ways to start">
            <div className="p-2">
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
            </div>
          </New>
        </section>
      </GiftHub>
    </>
  );
}
