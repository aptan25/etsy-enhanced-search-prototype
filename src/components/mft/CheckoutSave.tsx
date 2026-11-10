"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/components/ListingCard";
import { getListing } from "@/lib/listings";
import { newPersonId, relationshipLabel, relationships, suggestedOccasions, type Person, type Relationship } from "@/lib/people";
import { savePerson, updatePerson, usePeople } from "@/lib/peopleStore";
import { personHref } from "./PeopleStrip";
import { lookbackHref } from "./PersonView";

const ITEM_ID = "4349989364"; // personalized pickleball tote, $36.40
const NEW = "__new__";
const occasionChoices = ["Birthday", "Holiday gift exchange", "Christmas", "Just because"];

/** 2c: at checkout, "Who is this for?" saves the person and records the gift. */
export function CheckoutSave() {
  const people = usePeople();
  const item = getListing(ITEM_ID);
  const [isGift, setIsGift] = useState(true);
  const [who, setWho] = useState<string>(NEW);
  const [name, setName] = useState("");
  const [rel, setRel] = useState<Relationship>("friend");
  const [occasion, setOccasion] = useState(occasionChoices[0]);
  const [date, setDate] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!item) throw new Error(`Checkout demo listing ${ITEM_ID} is missing from src/data/listings.ts`);

  const placeOrder = () => {
    if (!isGift) {
      setSavedId("");
      return;
    }
    const record = { listingId: item.id, occasion, year: new Date().getFullYear() };
    if (who !== NEW) {
      updatePerson(who, (p) => ({ ...p, history: [...p.history, record] }));
      setSavedId(who);
      return;
    }
    const label = name.trim() || relationshipLabel(rel);
    const occasions = [...suggestedOccasions[rel]];
    if (date) {
      const [, m, d] = date.split("-").map(Number);
      occasions.unshift({ label: occasion, month: m, day: d, tag: occasion === "Birthday" ? "birthday" : "holiday" });
    }
    const person: Person = {
      id: newPersonId(label),
      name: label,
      relationship: rel,
      occasions: occasions.filter((o, i) => occasions.findIndex((x) => x.label === o.label) === i),
      // Start the profile from what they're buying.
      interests: item.tags.interests,
      style: item.tags.style,
      history: [record],
      source: "checkout",
    };
    savePerson(person);
    setSavedId(person.id);
  };

  if (savedId !== null) {
    const saved = people?.find((p) => p.id === savedId);
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-cream p-6 text-center">
        <p className="text-lg font-semibold">Order placed (demo: nothing was charged).</p>
        {saved ? (
          <>
            <p className="mt-2">
              Saved to <strong>{saved.name}</strong>&apos;s profile. After the {occasion.toLowerCase()}, we&apos;ll ask how it went, then
              remind you before their next occasion.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <Link href={personHref(saved.id)} className="underline">
                See {saved.name}&apos;s profile
              </Link>
              <Link href={lookbackHref(saved.id, saved.history.length - 1)} className="underline">
                Skip ahead: how did it go?
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm">Not a gift, so nothing was saved.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
      <section>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-4 flex gap-4 rounded-xl border border-neutral-200 p-4">
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
            <Image src={item.images[0]} alt="" fill sizes="96px" className="object-cover" />
          </span>
          <div>
            <p className="line-clamp-2 text-sm">{item.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{item.shop}</p>
            <p className="mt-1 font-semibold">{formatPrice(item.price)}</p>
          </div>
        </div>

        <label className="mt-6 flex items-center gap-2 font-semibold">
          <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} />
          This order is a gift
        </label>

        {isGift && people && (
          <div className="mt-4 rounded-xl border-2 border-etsy p-4">
            <p className="font-semibold">Who is it for?</p>
            <p className="text-sm text-neutral-600">We&apos;ll remember this gift and remind you before their next occasion.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...people.map((p) => ({ id: p.id, label: p.name })), { id: NEW, label: "+ Someone new" }].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setWho(o.id)}
                  aria-pressed={who === o.id}
                  className={`rounded-full border px-3 py-1 text-sm ${who === o.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {who === NEW && (
                <>
                  <label className="text-sm">
                    Name (optional)
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2" />
                  </label>
                  <label className="text-sm">
                    Relationship
                    <select value={rel} onChange={(e) => setRel(e.target.value as Relationship)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2">
                      {relationships.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
              <label className="text-sm">
                Occasion
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2">
                  {occasionChoices.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              {who === NEW && (
                <label className="text-sm">
                  Date (optional)
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2" />
                </label>
              )}
            </div>
          </div>
        )}
      </section>

      <aside className="h-fit rounded-xl bg-neutral-50 p-5">
        <p className="flex justify-between text-sm">
          <span>Item total</span>
          <span>{formatPrice(item.price)}</span>
        </p>
        <p className="mt-1 flex justify-between text-sm">
          <span>Shipping</span>
          <span>Free</span>
        </p>
        <p className="mt-3 flex justify-between border-t border-neutral-200 pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(item.price)}</span>
        </p>
        <button type="button" onClick={placeOrder} className="mt-5 w-full rounded-full bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-700">
          Place order (demo)
        </button>
        <p className="mt-2 text-center text-xs text-neutral-500">Prototype only. No payment is taken.</p>
      </aside>
    </div>
  );
}
