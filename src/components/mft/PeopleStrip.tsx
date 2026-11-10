"use client";

import Link from "next/link";
import { formatDays, upcoming } from "@/lib/occasions";
import { relationshipLabel, type Person } from "@/lib/people";
import { usePeople } from "@/lib/peopleStore";

export function Avatar({ name, size = "h-12 w-12 text-lg" }: { name: string; size?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-cream font-serif text-neutral-900 ${size}`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function nextOccasionText(p: Person, today: Date) {
  const next = upcoming(p.occasions, today)[0];
  return next ? `${next.occasion.label} ${formatDays(next.days)}` : "No dates saved";
}

export const personHref = (id: string) => `/made-for-them/person?id=${encodeURIComponent(id)}`;

/** "Your people": saved recipients under the gift search box, soonest occasion first. */
export function PeopleStrip({ addHref = "/made-for-them#add" }: { addHref?: string }) {
  const people = usePeople();
  if (!people) return <div className="h-20" aria-hidden />;

  const today = new Date();
  const sorted = [...people].sort(
    (a, b) => (upcoming(a.occasions, today)[0]?.days ?? 999) - (upcoming(b.occasions, today)[0]?.days ?? 999),
  );

  return (
    <ul className="flex flex-wrap justify-center gap-3">
      {sorted.map((p) => (
        <li key={p.id}>
          <Link
            href={personHref(p.id)}
            className="flex w-56 items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-left hover:border-neutral-900"
          >
            <Avatar name={p.name} />
            <span className="min-w-0">
              <span className="block font-semibold">{p.name}</span>
              <span className="block text-xs text-neutral-500">{relationshipLabel(p.relationship)}</span>
              <span className="block truncate text-xs text-etsy-dark">{nextOccasionText(p, today)}</span>
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={addHref}
          className="flex h-full w-40 items-center justify-center rounded-xl border border-dashed border-neutral-400 p-3 text-sm font-semibold text-neutral-700 hover:border-neutral-900"
        >
          + Add someone
        </Link>
      </li>
    </ul>
  );
}
