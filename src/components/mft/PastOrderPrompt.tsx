"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/components/ListingCard";
import { pastOrders } from "@/data/orders";
import { getListing } from "@/lib/listings";
import { newPersonId, relationshipLabel, relationships, suggestedOccasions, type Person, type Relationship } from "@/lib/people";
import { savePerson, usePeople } from "@/lib/peopleStore";
import { useTourStep } from "@/lib/tourStore";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * 1d: a signed-in buyer has bought gifts before. Etsy spots an order that looks
 * like a gift (shipped to someone else, just before a holiday) and offers to
 * save that person, so they start with a gift on record instead of from zero.
 */
export function PastOrderPrompt() {
  const people = usePeople();
  const inTour = useTourStep();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const order = people && pastOrders.find((o) => !dismissed.includes(o.listingId) && !people.some((p) => p.history.some((h) => h.listingId === o.listingId)));
  const [rel, setRel] = useState<Relationship | null>(null);
  const [name, setName] = useState<string | null>(null);
  if (!order) return null;

  const listing = getListing(order.listingId);
  if (!listing) throw new Error(`Past order listing ${order.listingId} is missing from src/data/listings.ts`);
  const relationship = rel ?? order.guess.relationship;
  const label = (name ?? order.guess.name).trim() || relationshipLabel(relationship);
  const [y, m, d] = order.ordered.split("-").map(Number);

  const save = () => {
    const person: Person = {
      id: newPersonId(label),
      name: label,
      relationship,
      occasions: suggestedOccasions[relationship],
      // Start the profile from what they were given.
      interests: listing.tags.interests,
      style: listing.tags.style,
      history: [{ listingId: listing.id, occasion: order.guess.occasion, year: y }],
      source: "orders",
    };
    savePerson(person);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-4 sm:px-8">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image src={listing.images[0]} alt="" fill sizes="80px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500">
            From your orders · {MONTHS[m - 1]} {d}, {y} · shipped to {order.shipTo}
          </p>
          <p className="font-semibold">Was this a {order.guess.occasion} gift?</p>
          <p className="line-clamp-1 text-sm text-neutral-600">
            {listing.title} · {formatPrice(listing.price)}
          </p>
          <p className="mt-1 text-sm text-neutral-600">Save who it was for, and we&apos;ll remind you before their next occasion.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs">
            Who
            <select
              value={relationship}
              onChange={(e) => setRel(e.target.value as Relationship)}
              className="mt-1 block rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
            >
              {relationships.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Name
            <input
              value={name ?? order.guess.name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-28 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </label>
          <button type="button" onClick={save} data-tour-target="save-past-order" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700">
            Save {label}
          </button>
          {/* Hidden in the guided demo: dismissing would leave its first step with nothing to click. */}
          {inTour === null && (
            <button type="button" onClick={() => setDismissed((x) => [...x, order.listingId])} className="px-2 py-2 text-sm underline">
              Not a gift
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
