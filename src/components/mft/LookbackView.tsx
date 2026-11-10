"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getListing, getListings } from "@/lib/listings";
import { safePicks } from "@/lib/match";
import { formatDays, upcoming } from "@/lib/occasions";
import type { GiftRecord } from "@/lib/people";
import { updatePerson, usePeople } from "@/lib/peopleStore";
import { personHref } from "./PeopleStrip";
import { PickRow } from "./PickRow";

type Outcome = NonNullable<GiftRecord["outcome"]>;

const outcomes: { id: Outcome; label: string }[] = [
  { id: "loved", label: "😍 Loved it" },
  { id: "okay", label: "🙂 It was okay" },
  { id: "missed", label: "😕 Missed" },
];

/** After the occasion: one tap of feedback updates the profile and sets up the next occasion. */
export function LookbackView() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const requested = Number(params.get("gift") ?? NaN);
  const people = usePeople();
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  if (!people) return null;

  const person = people.find((p) => p.id === id);
  // The gift just rated on this visit, else the one the link asked for (if it
  // still needs feedback), else the most recent gift without feedback.
  const pending = (i: number) => Number.isInteger(i) && person?.history[i] !== undefined && !person.history[i].outcome;
  const index = savedIndex ?? (pending(requested) ? requested : (person?.history.findLastIndex((h) => !h.outcome) ?? -1));
  const gift = person && index >= 0 ? person.history[index] : undefined;
  const listing = gift && getListing(gift.listingId);

  if (!person || !gift || !listing) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold">No gifts waiting for feedback.</p>
        <Link href={person ? personHref(person.id) : "/made-for-them"} className="mt-2 inline-block underline">
          Back
        </Link>
      </div>
    );
  }

  const tags = [...listing.tags.interests, ...listing.tags.style];
  const next = upcoming(person.occasions, new Date())[0];

  const save = () => {
    if (!outcome) return;
    updatePerson(person.id, (p) => {
      const isStyle = (t: string) => listing.tags.style.includes(t);
      const add = outcome === "missed" ? [] : picked;
      const drop = outcome === "missed" ? picked : [];
      return {
        ...p,
        history: p.history.map((h, i) => (i === index ? { ...h, outcome } : h)),
        interests: [...new Set([...p.interests, ...add.filter((t) => !isStyle(t))])].filter((t) => !drop.includes(t)),
        style: [...new Set([...p.style, ...add.filter(isStyle)])].filter((t) => !drop.includes(t)),
      };
    });
    setSavedIndex(index);
  };

  if (savedIndex !== null) {
    return (
      <div>
        <div className="rounded-2xl bg-cream p-6 text-center">
          <p className="text-lg font-semibold">Thanks! {person.name}&apos;s profile is updated.</p>
          {next && (
            <p className="mt-1">
              Next up: <strong>{next.occasion.label}</strong> {formatDays(next.days)}. We&apos;ll remind you 3 weeks before.
            </p>
          )}
        </div>
        <PickRow title={`Early ideas for ${person.name}'s ${next?.occasion.label ?? "next gift"}`} listings={safePicks(getListings(), { ...person, occasionTag: next?.occasion.tag }).filter((l) => l.id !== listing.id)} />
        <Link href={personHref(person.id)} className="mt-6 inline-block underline">
          See {person.name}&apos;s profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center gap-4">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
          <Image src={listing.images[0]} alt="" fill sizes="80px" className="object-cover" />
        </span>
        <div>
          <p className="text-sm text-neutral-500">
            {gift.occasion} {gift.year}
          </p>
          <h1 className="text-lg font-semibold">How did {person.name} like it?</h1>
          <p className="line-clamp-1 text-sm text-neutral-700">{listing.title}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {outcomes.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setOutcome(o.id);
              setPicked([]);
            }}
            aria-pressed={outcome === o.id}
            className={`rounded-full border px-4 py-2 ${outcome === o.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {outcome && (
        <>
          <p className="mt-5 text-sm font-semibold">
            {outcome === "missed" ? "What missed? We'll show less of it." : "What did they like? We'll show more of it."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={picked.includes(t)}
                onClick={() => setPicked((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}
                className={`rounded-full px-3 py-1 text-sm ${picked.includes(t) ? "bg-etsy text-white" : "bg-neutral-100"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="button" onClick={save} className="mt-6 rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-neutral-700">
            Save feedback
          </button>
        </>
      )}
    </div>
  );
}
