import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getListing } from "@/lib/listings";
import { PickRow } from "./PickRow";

// Etsy's gifts hub as it is today (the "Gifts" link in the top nav, checked on
// etsy.com 2026-11-12): gift guides, a "Start a chat" card, guide circles and
// best sellers. `chat` is the card; `children` go between the circles and the
// best sellers (Made for Them puts your people there).

// Chosen by hand: the seed data also has crude-joke items that shouldn't lead a demo.
const pick = (id: string) => {
  const l = getListing(id);
  if (!l) throw new Error(`Gift hub listing ${id} is missing from src/data/listings.ts`);
  return l;
};

const guides = [
  { title: "Top 100 Holiday Gifts", q: "christmas", id: "4515441955" },
  { title: "Gifts for Her", q: "her", id: "1413455244" },
  { title: "Gifts for Him", q: "him", id: "4310655951" },
  { title: "Home Gifts", q: "home", id: "4318207115" },
  { title: "Personalized Gifts", q: "personalized", id: "4574408367" },
  { title: "For Coffee Lovers", q: "coffee", id: "4448501401" },
].map((g) => ({ ...g, image: pick(g.id).images[0] }));

const bestSellers = ["1619780681", "4448501401", "4349989364", "4574408367", "1099228102", "4318207115", "4595511480", "4515441955", "1780038398", "4549652744"].map(pick);

export function GiftHub({ chat, children }: { chat: ReactNode; children?: ReactNode }) {
  return (
    <main className="flex-1">
      <section className="bg-[#d7e2f3]">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl">Etsy&apos;s Best Gift Guides</h1>
          <p className="mt-2 text-neutral-800">Find meaningful gifts straight from extraordinary small shops, for the people who matter most.</p>
          <div className="mt-6">{chat}</div>
        </div>
      </section>
      <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-8">
        <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {guides.map((g) => (
            <li key={g.title}>
              <Link href={`/search?q=${encodeURIComponent(g.q)}`} className="group block text-center text-sm">
                <span className="relative mx-auto block aspect-square w-full max-w-36 overflow-hidden rounded-full">
                  <Image src={g.image} alt="" fill sizes="144px" className="object-cover" />
                </span>
                <span className="mt-2 block group-hover:underline">{g.title} →</span>
              </Link>
            </li>
          ))}
        </ul>
        {children}
        <PickRow title="Best-selling gifts they'll love" listings={bestSellers} />
      </div>
    </main>
  );
}

/** The "Need gift ideas?" card as Etsy has it today. */
export function StartChatCard({ href }: { href: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/90 px-6 py-5 text-left shadow-sm">
      <span className="text-lg">Need gift ideas? We can help.</span>
      <Link href={href} className="rounded-full bg-neutral-800 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-900">
        Start a chat
      </Link>
    </div>
  );
}
