"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { parseBudget, parseTaste, parseWho, type ParsedWho } from "@/lib/intent";
import { getListings } from "@/lib/listings";
import { popularFor, safePicks } from "@/lib/match";
import { formatDate, nextDate, type Occasion } from "@/lib/occasions";
import { newPersonId, relationshipLabel, relationships, suggestedOccasions, type Relationship } from "@/lib/people";
import { savePerson } from "@/lib/peopleStore";
import type { Listing } from "@/lib/types";
import { New } from "./New";
import { personHref } from "./PeopleStrip";

type Message = { from: "bot" | "user"; text: string; picks?: Listing[] };

type Chat = {
  who: ParsedWho;
  interests: string[];
  style: string[];
  budget?: number;
  messages: Message[];
  done: boolean;
};

const ASK_WHO = "Who are you shopping for, and what's the occasion?";
const ASK_TASTE = "What are they into? Hobbies, style, anything you know.";

const whoReplies = ["My coworker Maya, gift exchange Dec 18", "My mom's birthday, Nov 22", "My dad for Father's Day"];
const tasteReplies = ["Pickleball and coffee", "Gardening and pottery, rustic stuff", "Funny things, under $40"];

const dedupe = (xs: string[]) => [...new Set(xs)];

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** One turn of the scripted chat: merge what the buyer said, then ask for what's missing. */
function reply(chat: Chat, text: string): Chat {
  const parsed = parseWho(text);
  const taste = parseTaste(text);
  const who: ParsedWho = {
    relationship: parsed.relationship ?? chat.who.relationship,
    name: parsed.name ?? chat.who.name,
    occasion: parsed.occasion ?? chat.who.occasion,
  };
  const next: Chat = {
    who,
    interests: dedupe([...chat.interests, ...taste.interests]),
    style: dedupe([...chat.style, ...taste.style]),
    budget: parseBudget(text) ?? chat.budget,
    messages: [...chat.messages, { from: "user", text }],
    done: false,
  };

  if (!who.relationship) {
    next.messages.push({ from: "bot", text: `Got it. ${ASK_WHO}` });
  } else if (next.interests.length === 0 && next.style.length === 0) {
    next.messages.push({ from: "bot", text: ASK_TASTE });
  } else {
    const profile = {
      relationship: who.relationship,
      interests: next.interests,
      style: next.style,
      budget: next.budget,
      occasionTag: who.occasion?.tag,
    };
    const listings = getListings();
    const safe = safePicks(listings, profile, 4);
    const fill = popularFor(listings, who.relationship, profile).filter((l) => !safe.includes(l));
    const picks = [...safe, ...fill].slice(0, 4);
    const forWhom = who.name ?? `your ${relationshipLabel(who.relationship).toLowerCase()}`;
    next.messages.push({ from: "bot", text: `Here are a few ideas for ${forWhom}.`, picks });
    next.done = true;
  }
  return next;
}

function start(initial: string | null): Chat {
  const chat: Chat = { who: {}, interests: [], style: [], messages: [{ from: "bot", text: `Hi! ${ASK_WHO}` }], done: false };
  return initial ? reply(chat, initial) : chat;
}

/**
 * Scripted stand-in for Etsy's AI gift chat. With `canSave` (Made for Them),
 * it ends with a card to save the person and the dates it heard. Without it
 * (current state), the conversation ends at the picks and nothing is kept.
 */
export function GiftChat({ canSave }: { canSave: boolean }) {
  const params = useSearchParams();
  const [chat, setChat] = useState(() => start(params.get("q")));
  const [draft, setDraft] = useState("");
  const replies = chat.who.relationship ? tasteReplies : whoReplies;

  const send = (text: string) => {
    if (!text.trim()) return;
    setChat((c) => reply(c, text.trim()));
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="space-y-3">
        {chat.messages.map((m, i) => (
          <li key={i} className={m.from === "user" ? "flex justify-end" : ""}>
            <div className={`rounded-2xl px-4 py-2 ${m.from === "user" ? "max-w-[80%] bg-neutral-900 text-white" : "bg-neutral-100"}`}>
              {m.from === "bot" && <span className="mr-1 text-etsy">✦</span>}
              {m.text}
            </div>
            {m.picks && (
              <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {m.picks.map((l) => (
                  <li key={l.id}>
                    <ListingCard listing={l} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {chat.done && canSave && chat.who.relationship && (
        <div className="mt-8">
          <New label="New: save them for next time">
            <SaveCard chat={chat} relationship={chat.who.relationship} />
          </New>
        </div>
      )}

      {!chat.done && (
        <>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {replies.map((r) => (
              <li key={r}>
                <button type="button" onClick={() => send(r)} className="rounded-full border border-neutral-300 px-3 py-1 hover:border-neutral-900">
                  {r}
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message"
              aria-label="Message"
              className="min-w-0 flex-1 rounded-full border-2 border-neutral-900 px-4 py-2 outline-none focus:border-etsy"
            />
            <button type="submit" className="rounded-full bg-neutral-900 px-4 font-semibold text-white">
              Send
            </button>
          </form>
        </>
      )}
      {chat.done && (
        <button type="button" onClick={() => setChat(start(null))} className="mt-6 text-sm underline">
          Start over
        </button>
      )}
    </div>
  );
}

/** "Save Maya?" Etsy pulled these from the chat; the buyer confirms with one tap. */
function SaveCard({ chat, relationship }: { chat: Chat; relationship: Relationship }) {
  const router = useRouter();
  const [name, setName] = useState(chat.who.name ?? "");
  const [rel, setRel] = useState<Relationship>(relationship);
  const heard = chat.who.occasion;
  // This card only renders after the buyer chats, so reading the clock here is browser-only.
  const [today] = useState(() => new Date());
  const heardDate = heard && "month" in heard ? isoDay(nextDate(heard, today)) : "";
  const [date, setDate] = useState(heardDate);
  const [extras, setExtras] = useState<string[]>(suggestedOccasions[relationship].map((o) => o.label));
  const suggestions = suggestedOccasions[rel].filter((o) => o.label !== heard?.label);

  const save = () => {
    const occasions: Occasion[] = [];
    if (heard && "month" in heard && date === heardDate) {
      occasions.push(heard); // unchanged: keeps a movable holiday's rule
    } else if (heard && date) {
      const [, m, d] = date.split("-").map(Number);
      occasions.push({ label: heard.label, tag: heard.tag, month: m, day: d });
    }
    occasions.push(...suggestions.filter((o) => extras.includes(o.label)));
    const person = {
      id: newPersonId(name || relationshipLabel(rel)),
      name: name.trim() || relationshipLabel(rel),
      relationship: rel,
      occasions,
      interests: chat.interests,
      style: chat.style,
      budget: chat.budget,
      history: [],
      source: "chat" as const,
    };
    savePerson(person);
    router.push(personHref(person.id));
  };

  return (
    <div className="rounded-2xl border-2 border-etsy bg-white p-5">
      <h2 className="font-semibold">Save {name || "them"} for next time?</h2>
      <p className="text-sm text-neutral-600">We picked these up from your chat. You can change them any time.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
        {heard && (
          <label className="text-sm">
            {heard.label} date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2" />
          </label>
        )}
        <div className="text-sm">
          Likes
          <p className="mt-1 flex flex-wrap gap-1">
            {[...chat.interests, ...chat.style].map((t) => (
              <span key={t} className="rounded-full bg-cream px-2 py-0.5">
                {t}
              </span>
            ))}
          </p>
        </div>
      </div>
      {suggestions.length > 0 && (
        <fieldset className="mt-4 text-sm">
          <legend className="font-semibold">Also remind me before</legend>
          {suggestions.map((o) => (
            <label key={o.label} className="mr-4 inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={extras.includes(o.label)}
                onChange={(e) => setExtras((x) => (e.target.checked ? [...x, o.label] : x.filter((l) => l !== o.label)))}
              />
              {o.label} ({formatDate(o, today)})
            </label>
          ))}
        </fieldset>
      )}
      <div className="mt-5 flex items-center gap-4">
        <button type="button" onClick={save} className="rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-neutral-700">
          Save {name || relationshipLabel(rel)}
        </button>
        <Link href="/made-for-them" className="text-sm underline">
          Not now
        </Link>
      </div>
    </div>
  );
}
