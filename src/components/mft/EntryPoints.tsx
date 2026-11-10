"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getListings } from "@/lib/listings";
import { safePicks } from "@/lib/match";
import { formatDays, upcoming } from "@/lib/occasions";
import type { Person } from "@/lib/people";
import { usePeople } from "@/lib/peopleStore";
import { Avatar, nextOccasionText, personHref } from "./PeopleStrip";

const listings = getListings();

/** The saved person with the soonest occasion, and that occasion. */
function soonest(people: Person[], today: Date) {
  return people
    .flatMap((p) => upcoming(p.occasions, today).slice(0, 1).map((u) => ({ person: p, ...u })))
    .sort((a, b) => a.days - b.days)[0];
}

const picksFor = (p: Person, tag?: string, n = 3) => safePicks(listings, { ...p, occasionTag: tag }, n);

/** 2a: a pill under the existing search bar opens your saved people. */
export function ShoppingForPill() {
  const people = usePeople();
  const [open, setOpen] = useState(true); // open on load so the concept is visible in a demo
  // Dates are read only once people load in the browser, never during the prerender.
  const today = people ? new Date() : null;

  return (
    <div className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm hover:border-neutral-900"
      >
        🎁 Shopping for someone?
      </button>
      {open && people && today && (
        <div className="absolute left-0 z-10 mt-2 w-80 max-w-[calc(100vw-7rem)] rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <p className="px-2 pb-1 text-xs text-neutral-500">Your people</p>
          <ul>
            {people.map((p) => (
              <li key={p.id}>
                <Link href={personHref(p.id)} className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50">
                  <Avatar name={p.name} size="h-9 w-9 text-base" />
                  <span>
                    <span className="block text-sm font-semibold">{p.name}</span>
                    <span className="block text-xs text-etsy-dark">{nextOccasionText(p, today)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/made-for-them#add" className="block rounded-lg p-2 text-sm font-semibold hover:bg-neutral-50">
            + Someone new
          </Link>
        </div>
      )}
    </div>
  );
}

/** 2b: a homepage strip for the next occasion. It sits inside the homepage instead of replacing it. */
export function OccasionStrip() {
  const people = usePeople();
  if (!people) return <div className="h-28" aria-hidden />;
  const next = soonest(people, new Date());
  if (!next) return null;
  const picks = picksFor(next.person, next.occasion.tag);

  return (
    <section className="border-b border-neutral-200 bg-white">
      <Link href={personHref(next.person.id)} className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-4 hover:bg-neutral-50 sm:px-8">
        <Avatar name={next.person.name} />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold">
            {next.person.name}&apos;s {next.occasion.label.toLowerCase()} is {formatDays(next.days)}
          </span>
          <span className="block text-sm text-neutral-600">{picks.length} picks based on what they like →</span>
        </span>
        <span className="flex gap-2">
          {picks.map((l) => (
            <span key={l.id} className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image src={l.images[0]} alt="" fill sizes="64px" className="object-cover" />
            </span>
          ))}
        </span>
      </Link>
    </section>
  );
}

/** 2d: the bell in the header, with a reminder 3 weeks ahead. */
export function ReminderBell() {
  const people = usePeople();
  const [open, setOpen] = useState(true);
  const next = people && soonest(people, new Date());

  return (
    <span className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Notifications" aria-expanded={open} className="relative text-lg">
        🔔
        {next && <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full bg-etsy" />}
      </button>
      {open && next && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-4 text-left text-neutral-900 shadow-lg">
          <p className="text-xs text-neutral-500">Gift reminder</p>
          <p className="mt-1 font-semibold">
            {next.person.name}&apos;s {next.occasion.label.toLowerCase()} is {formatDays(next.days)}
          </p>
          <p className="text-sm text-neutral-600">Order soon so handmade items arrive on time.</p>
          <div className="mt-3 flex gap-2">
            {picksFor(next.person, next.occasion.tag).map((l) => (
              <span key={l.id} className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image src={l.images[0]} alt="" fill sizes="64px" className="object-cover" />
              </span>
            ))}
          </div>
          <Link href={personHref(next.person.id)} className="mt-3 block rounded-full bg-neutral-900 py-2 text-center text-sm font-semibold text-white">
            See picks for {next.person.name}
          </Link>
        </div>
      )}
    </span>
  );
}

/** 2d: the same reminder as an email. */
export function ReminderEmail() {
  const people = usePeople();
  if (!people) return null;
  const next = soonest(people, new Date());
  if (!next) return <p className="text-sm text-neutral-600">Save someone with a date to see their reminder.</p>;
  const picks = picksFor(next.person, next.occasion.tag, 4);

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600">
        <p>
          <strong>From:</strong> Etsy &nbsp; <strong>Subject:</strong> {next.person.name}&apos;s {next.occasion.label.toLowerCase()} is{" "}
          {formatDays(next.days)} 🎁
        </p>
      </div>
      <div className="p-6">
        <p className="font-serif text-2xl text-etsy">Etsy</p>
        <h2 className="mt-4 text-xl font-semibold">
          {next.person.name}&apos;s {next.occasion.label.toLowerCase()} is {formatDays(next.days)}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Picked for what {next.person.name} likes: {[...next.person.interests, ...next.person.style].join(", ")}.
        </p>
        <ul className="mt-4 grid grid-cols-4 gap-2">
          {picks.map((l) => (
            <li key={l.id} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={l.images[0]} alt="" fill sizes="120px" className="object-cover" />
            </li>
          ))}
        </ul>
        <Link href={personHref(next.person.id)} className="mt-5 inline-block rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
          Shop for {next.person.name}
        </Link>
      </div>
    </div>
  );
}
