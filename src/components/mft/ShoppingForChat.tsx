"use client";

import Link from "next/link";
import { useState } from "react";
import { usePeople } from "@/lib/peopleStore";
import { New } from "./New";

const NEW = "";

/**
 * Made for Them's version of the "Need gift ideas?" card: a "Shopping for"
 * dropdown of saved people next to "Start a chat", so the chat starts already
 * knowing who it's for. "Someone new" starts the chat from zero, as today.
 */
export function ShoppingForChat() {
  const people = usePeople() ?? [];
  const [picked, setPicked] = useState(NEW);
  const forId = people.some((p) => p.id === picked) ? picked : NEW;
  const href = forId ? `/made-for-them/new/chat?for=${encodeURIComponent(forId)}` : "/made-for-them/new/chat";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/90 px-6 py-5 text-left shadow-sm">
      <span className="text-lg">Need gift ideas? We can help.</span>
      <span className="flex flex-wrap items-center gap-3">
        <New change="core-for" label="New: shopping for" inline>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-neutral-600">Shopping for</span>
            <select value={forId} onChange={(e) => setPicked(e.target.value)} className="rounded-full border border-neutral-400 bg-white px-3 py-1.5 font-semibold">
              <option value={NEW}>Someone new</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </New>
        <Link href={href} data-tour-target="start-chat" className="rounded-full bg-neutral-800 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-900">
          Start a chat
        </Link>
      </span>
    </div>
  );
}
