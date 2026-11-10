"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Occasion } from "@/lib/occasions";
import { newPersonId, relationshipLabel, relationships, suggestedOccasions, type Person, type Relationship } from "@/lib/people";
import { savePerson } from "@/lib/peopleStore";
import { personHref } from "./PeopleStrip";

/**
 * Last step of the quiz and relationship flows: name (optional), relationship,
 * birthday (optional). Holidays for the relationship are added automatically.
 */
export function SaveForm({
  source,
  interests,
  style,
  budget,
  relationship: initialRel,
  occasion,
}: {
  source: Person["source"];
  interests: string[];
  style: string[];
  budget?: number;
  relationship?: Relationship;
  /** An occasion already chosen earlier in the flow. */
  occasion?: Occasion;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rel, setRel] = useState<Relationship>(initialRel ?? "friend");
  const [birthday, setBirthday] = useState("");

  const save = () => {
    const occasions: Occasion[] = [...(occasion ? [occasion] : [])];
    if (birthday) {
      const [, m, d] = birthday.split("-").map(Number);
      occasions.push({ label: "Birthday", tag: "birthday", month: m, day: d });
    }
    for (const o of suggestedOccasions[rel]) if (!occasions.some((x) => x.label === o.label)) occasions.push(o);
    const label = name.trim() || relationshipLabel(rel);
    const person: Person = { id: newPersonId(label), name: label, relationship: rel, occasions, interests, style, budget, history: [], source };
    savePerson(person);
    router.push(personHref(person.id));
  };

  return (
    <div className="rounded-2xl border-2 border-etsy p-5">
      <h2 className="font-semibold">Save them for next time</h2>
      <p className="text-sm text-neutral-600">Only a relationship is needed. We&apos;ll add the usual holidays for you.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
        <label className="text-sm">
          Birthday (optional)
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2" />
        </label>
      </div>
      <button type="button" onClick={save} className="mt-5 rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-neutral-700">
        Save {name.trim() || relationshipLabel(rel)}
      </button>
    </div>
  );
}
