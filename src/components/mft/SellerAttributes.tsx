"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/components/ListingCard";
import { getListing, getListings } from "@/lib/listings";
import { safePicks, somethingNew } from "@/lib/match";
import { demoPeople } from "@/lib/people";
import type { Listing } from "@/lib/types";

const LISTING_ID = "4591499376"; // handmade rainbow trout tile

type Group = "interests" | "style" | "recipient" | "occasion";
type Attr = { group: Group; tag: string };

const groupLabel: Record<Group, string> = {
  interests: "Great for people who like",
  style: "Style",
  recipient: "Good gift for",
  occasion: "Occasions",
};

const key = (a: Attr) => `${a.group}:${a.tag}`;

/** The listing as matching sees it: only the attributes the seller confirmed. */
function withConfirmed(l: Listing, confirmed: string[]): Listing {
  const keep = (g: Group) => l.tags[g].filter((t) => confirmed.includes(`${g}:${t}`));
  return { ...l, tags: { interests: keep("interests"), style: keep("style"), recipient: keep("recipient"), occasion: keep("occasion") } };
}

/**
 * 3b: Etsy suggests attributes from the photos and description; the seller
 * confirms or removes them. The preview shows which example buyer profiles the
 * listing now reaches, including through "Something new".
 */
export function SellerAttributes() {
  const original = getListing(LISTING_ID);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  if (!original) throw new Error(`Seller demo listing ${LISTING_ID} is missing from src/data/listings.ts`);

  const suggestions: Attr[] = (["interests", "style", "recipient", "occasion"] as Group[]).flatMap((group) =>
    original.tags[group].map((tag) => ({ group, tag })),
  );
  const listing = withConfirmed(original, confirmed);
  const others = getListings().filter((l) => l.id !== LISTING_ID);
  const reach = demoPeople.map((p) => {
    const pool = [...others, listing];
    const safeRank = safePicks(pool, p, 100).findIndex((l) => l.id === LISTING_ID);
    const inNew = somethingNew(pool, p, 5).some((l) => l.id === LISTING_ID);
    return { person: p, where: safeRank >= 0 ? `#${safeRank + 1} in their picks` : inNew ? "In “Something new”" : null };
  });

  const toggle = (a: Attr) => setConfirmed((c) => (c.includes(key(a)) ? c.filter((x) => x !== key(a)) : [...c, key(a)]));

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
      <section>
        <p className="text-sm text-neutral-500">Shop Manager › Listings › Gift matching</p>
        <div className="mt-3 flex gap-4">
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
            <Image src={original.images[0]} alt="" fill sizes="96px" className="object-cover" />
          </span>
          <div>
            <h1 className="line-clamp-2 font-semibold">{original.title}</h1>
            <p className="text-sm text-neutral-600">
              {original.shop} · {formatPrice(original.price)}
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Help buyers find this as a gift</h2>
        <p className="text-sm text-neutral-600">
          We suggested these from your photos and description. Confirm the ones that are right; they decide which saved gift profiles see this
          listing.
        </p>
        {(Object.keys(groupLabel) as Group[]).map((g) => (
          <fieldset key={g} className="mt-4">
            <legend className="text-sm font-semibold">{groupLabel[g]}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions
                .filter((a) => a.group === g)
                .map((a) => {
                  const on = confirmed.includes(key(a));
                  return (
                    <button
                      key={key(a)}
                      type="button"
                      onClick={() => toggle(a)}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1 text-sm ${on ? "border-green-700 bg-green-50 text-green-900" : "border-dashed border-neutral-400 text-neutral-700"}`}
                    >
                      {on ? "✓ " : "+ "}
                      {a.tag}
                    </button>
                  );
                })}
            </div>
          </fieldset>
        ))}
        <div className="mt-6 flex gap-4 text-sm">
          <button type="button" onClick={() => setConfirmed(suggestions.map(key))} className="rounded-full bg-neutral-900 px-4 py-2 font-semibold text-white">
            Confirm all
          </button>
          <button type="button" onClick={() => setConfirmed([])} className="underline">
            Clear
          </button>
        </div>
      </section>

      <aside className="h-fit rounded-xl bg-neutral-50 p-5">
        <h2 className="font-semibold">Who this listing reaches</h2>
        <p className="text-xs text-neutral-500">Example buyer profiles. Sellers see counts, never buyers&apos; names.</p>
        <ul className="mt-3 space-y-2 text-sm">
          {reach.map(({ person, where }) => (
            <li key={person.id} className="flex justify-between rounded-lg bg-white p-3">
              <span>
                A {person.relationship} who likes {person.interests.join(", ")}
              </span>
              <span className={where ? "font-semibold text-green-800" : "text-neutral-400"}>{where ?? "Not shown"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          Confirmed: <strong>{confirmed.length}</strong> of {suggestions.length} attributes
        </p>
      </aside>
    </div>
  );
}
