"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getListing, getListings } from "@/lib/listings";
import { nearbyInterests, popularFor, safePicks, somethingNew } from "@/lib/match";
import { formatDate, formatDays, upcoming } from "@/lib/occasions";
import { relationshipLabel, type Person } from "@/lib/people";
import { removePerson, updatePerson, usePeople } from "@/lib/peopleStore";
import { New } from "./New";
import { Avatar } from "./PeopleStrip";
import { PickRow } from "./PickRow";

const allListings = getListings();
const vocabulary = [...new Set(allListings.flatMap((l) => [...l.tags.interests, ...l.tags.style]))].sort();
const styleWords = new Set(allListings.flatMap((l) => l.tags.style));

const sourceLabel: Record<Person["source"], string> = {
  demo: "Demo person",
  quiz: "Saved from the taste quiz",
  relationship: "Saved from 'start from who they are'",
  chat: "Saved from the gift chat",
  checkout: "Saved at checkout",
  orders: "Saved from a past order",
};

const outcomeLabel = { loved: "Loved it", okay: "It was okay", missed: "Missed" };

/** Look-back for one gift (`gift` = its index in history), or the newest unrated one. */
export const lookbackHref = (id: string, gift?: number) =>
  `/made-for-them/lookback?id=${encodeURIComponent(id)}${gift === undefined ? "" : `&gift=${gift}`}`;

/** A saved person: what Etsy remembers (visible and editable), dates, and two rows of picks. */
export function PersonView() {
  const id = useSearchParams().get("id") ?? "";
  const people = usePeople();
  const router = useRouter();
  if (!people) return null;

  const person = people.find((p) => p.id === id);
  if (!person) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold">We couldn&apos;t find that person.</p>
        <Link href="/made-for-them" className="mt-2 inline-block underline">
          Back to your people
        </Link>
      </div>
    );
  }

  const today = new Date();
  const dates = upcoming(person.occasions, today);
  const next = dates[0];
  const likes = [...person.interests, ...person.style];
  const profile = { ...person, occasionTag: next?.occasion.tag };
  const safe = safePicks(allListings, profile);
  const fresh = somethingNew(allListings, profile);
  const near = nearbyInterests(person.interests).slice(0, 3);

  const removeLike = (tag: string) =>
    updatePerson(person.id, (p) => ({ ...p, interests: p.interests.filter((t) => t !== tag), style: p.style.filter((t) => t !== tag) }));
  const addLike = (tag: string) =>
    updatePerson(person.id, (p) =>
      styleWords.has(tag) ? { ...p, style: [...new Set([...p.style, tag])] } : { ...p, interests: [...new Set([...p.interests, tag])] },
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={person.name} size="h-16 w-16 text-2xl" />
        <div>
          <h1 className="text-2xl font-semibold">{person.name}</h1>
          <p className="text-sm text-neutral-600">
            {relationshipLabel(person.relationship)}
            {person.budget !== undefined && ` · usually under $${person.budget}`} · {sourceLabel[person.source]}
          </p>
        </div>
        {next && (
          <p className="rounded-full bg-cream px-4 py-2 text-sm sm:ml-auto">
            <strong>{next.occasion.label}</strong> {formatDays(next.days)}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 p-4">
          <h2 className="font-semibold">What Etsy remembers</h2>
          <p className="text-xs text-neutral-500">You can see and change everything we use to pick gifts.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {likes.map((t) => (
              <li key={t} className="flex items-center gap-1 rounded-full bg-cream py-1 pl-3 pr-1 text-sm">
                {t}
                <button type="button" onClick={() => removeLike(t)} aria-label={`Remove ${t}`} className="rounded-full px-1.5 hover:bg-white">
                  ×
                </button>
              </li>
            ))}
            {likes.length === 0 && <li className="text-sm text-neutral-500">Nothing yet.</li>}
          </ul>
          <label className="mt-3 block text-sm">
            <span className="sr-only">Add something they like</span>
            <select
              value=""
              onChange={(e) => e.target.value && addLike(e.target.value)}
              className="rounded-lg border border-neutral-300 px-2 py-1"
            >
              <option value="">+ Add something they like</option>
              {vocabulary
                .filter((t) => !likes.includes(t))
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </label>
        </section>

        <section className="rounded-xl border border-neutral-200 p-4">
          <h2 className="font-semibold">Occasions</h2>
          <ul className="mt-2 divide-y divide-neutral-100 text-sm">
            {dates.map(({ occasion, days }) => (
              <li key={occasion.label} className="flex justify-between py-1.5">
                <span>
                  {occasion.label} <span className="text-neutral-500">· {formatDate(occasion, today)}</span>
                </span>
                <span className="text-neutral-600">{formatDays(days)}</span>
              </li>
            ))}
            {dates.length === 0 && <li className="py-1.5 text-neutral-500">No dates yet.</li>}
          </ul>
          <p className="mt-2 text-xs text-neutral-500">We&apos;ll remind you 3 weeks before each one, so handmade orders arrive on time.</p>
        </section>
      </div>

      {likes.length === 0 ? (
        <PickRow
          title={`Popular for a ${relationshipLabel(person.relationship).toLowerCase()}`}
          subtitle="Add a few likes and these get more personal."
          listings={popularFor(allListings, person.relationship, { occasionTag: next?.occasion.tag, budget: person.budget }, 5)}
        />
      ) : (
        <>
          <PickRow
            title={`Picks for ${person.name}`}
            subtitle={`Because they like ${person.interests.join(", ") || person.style.join(", ")}`}
            listings={safe}
            empty="No exact matches in our listings yet."
          />
          <div className="mt-10">
            <New label="3a: beyond what you told us">
              <div className="px-2 pb-2 [&>section]:mt-2">
                <PickRow
                  title="Something new"
                  subtitle={near.length ? `They might also like ${near.join(", ")}: things you didn't mention` : undefined}
                  listings={fresh}
                  empty="Nothing nearby yet."
                />
              </div>
            </New>
          </div>
        </>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Gift history</h2>
        {person.history.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No gifts recorded yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {person.history.map((h, i) => {
              const l = getListing(h.listingId);
              return (
                <li key={i} className="flex items-center gap-3 text-sm">
                  {l && (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={l.images[0]} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {h.occasion} {h.year} · {l?.title ?? "Unknown item"}
                  </span>
                  {h.outcome ? (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5">{outcomeLabel[h.outcome]}</span>
                  ) : (
                    <Link href={lookbackHref(person.id, i)} className="font-semibold text-etsy-dark underline">
                      How did it go?
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={() => {
          removePerson(person.id);
          router.push("/made-for-them");
        }}
        className="mt-10 text-sm text-neutral-500 underline"
      >
        Remove {person.name}
      </button>
    </>
  );
}
