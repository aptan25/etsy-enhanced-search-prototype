"use client";

import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/listings";
import { popularFor } from "@/lib/match";
import type { Occasion } from "@/lib/occasions";
import { relationshipLabel, relationships, suggestedOccasions, type Relationship } from "@/lib/people";
import { SaveForm } from "./SaveForm";

const budgets = [
  { label: "Under $25", value: 25 },
  { label: "Under $50", value: 50 },
  { label: "Under $100", value: 100 },
  { label: "Any price", value: undefined },
];

// A choice only: its date is asked in the save form, so month/day are never saved.
const birthday: Occasion = { label: "Birthday", tag: "birthday", month: 0, day: 0 };

const Choice = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-full border px-4 py-2 text-sm ${selected ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 hover:border-neutral-900"}`}
  >
    {children}
  </button>
);

/**
 * Cold start without hobbies: relationship + occasion + budget shows what
 * buyers pick for that kind of person. Hearting items teaches the profile.
 */
export function RelationshipStart() {
  const [rel, setRel] = useState<Relationship | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [budget, setBudget] = useState<number | undefined | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  const listings = getListings();
  const occasionChoices = rel ? [birthday, ...suggestedOccasions[rel]] : [];
  const ready = rel && occasion && budget !== null;
  const picks = ready ? popularFor(listings, rel, { occasionTag: occasion.tag, budget }, 10) : [];
  const likedListings = listings.filter((l) => liked.includes(l.id));
  const interests = [...new Set(likedListings.flatMap((l) => l.tags.interests))];
  const style = [...new Set(likedListings.flatMap((l) => l.tags.style))];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-semibold">1. Who is it for?</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {relationships.map((r) => (
            <Choice
              key={r.id}
              selected={rel === r.id}
              onClick={() => {
                setRel(r.id);
                setOccasion(null);
              }}
            >
              {r.label}
            </Choice>
          ))}
        </div>
      </section>

      {rel && (
        <section>
          <h2 className="font-semibold">2. What&apos;s the occasion?</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {occasionChoices.map((o) => (
              <Choice key={o.label} selected={occasion?.label === o.label} onClick={() => setOccasion(o)}>
                {o.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {occasion && (
        <section>
          <h2 className="font-semibold">3. Budget</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {budgets.map((b) => (
              <Choice key={b.label} selected={budget === b.value} onClick={() => setBudget(b.value)}>
                {b.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {ready && (
        <>
          <section>
            <h2 className="text-lg font-semibold">Popular for a {relationshipLabel(rel).toLowerCase()}</h2>
            <p className="text-sm text-neutral-600">Tap ♡ on anything they&apos;d like. We learn their taste from it.</p>
            {picks.length === 0 ? (
              <p className="mt-3 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">Nothing in this budget yet. Try a higher one.</p>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
                {picks.map((l) => (
                  <li key={l.id} className="relative">
                    <ListingCard listing={l} />
                    <button
                      type="button"
                      aria-label={liked.includes(l.id) ? "Unlike" : "Like"}
                      aria-pressed={liked.includes(l.id)}
                      onClick={() => setLiked((x) => (x.includes(l.id) ? x.filter((y) => y !== l.id) : [...x, l.id]))}
                      className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow ${liked.includes(l.id) ? "text-etsy" : "text-neutral-700"}`}
                    >
                      {liked.includes(l.id) ? "♥" : "♡"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {(interests.length > 0 || style.length > 0) && (
            <p className="text-sm">
              Learning: likes{" "}
              {[...interests, ...style].map((t) => (
                <span key={t} className="mr-1 rounded-full bg-cream px-2 py-0.5">
                  {t}
                </span>
              ))}
            </p>
          )}

          <SaveForm
            key={rel}
            source="relationship"
            relationship={rel}
            interests={interests}
            style={style}
            budget={budget}
            // Birthday's date is asked in the form; holidays carry their own dates.
            occasion={occasion.label === "Birthday" ? undefined : occasion}
          />
        </>
      )}
    </div>
  );
}
