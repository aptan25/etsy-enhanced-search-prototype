"use client";

import Image from "next/image";
import { useState } from "react";
import { getListing, getListings } from "@/lib/listings";
import { safePicks } from "@/lib/match";
import type { Listing } from "@/lib/types";
import { PickRow } from "./PickRow";
import { SaveForm } from "./SaveForm";

// Each round contrasts two styles. Picking a photo adds that listing's
// interest and style tags to the profile; "Neither" adds nothing.
const rounds: [string, string][] = [
  ["1413455244", "4376404554"], // minimalist necklace vs funny bobblehead
  ["4318207115", "1099228102"], // boho macramé vs modern travel map
  ["4595511480", "4411823542"], // artisan mug vs sweary desk chart
  ["4591499376", "4515441955"], // rustic fishing tile vs sentimental shadow box
];

const pairs = rounds.map((r) => r.map((id) => getListing(id)).filter((l): l is Listing => l !== undefined));

export function TasteQuiz() {
  const [chosen, setChosen] = useState<Listing[]>([]);
  const [round, setRound] = useState(0);
  const done = round >= pairs.length;

  const interests = [...new Set(chosen.flatMap((l) => l.tags.interests))];
  const style = [...new Set(chosen.flatMap((l) => l.tags.style))];

  const pick = (l: Listing | null) => {
    if (l) setChosen((c) => [...c, l]);
    setRound((r) => r + 1);
  };

  if (!done) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm text-neutral-500">
          {round + 1} of {pairs.length}
        </p>
        <h1 className="mt-1 text-xl font-semibold">Which would they like more?</h1>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {pairs[round].map((l) => (
            <button key={l.id} type="button" onClick={() => pick(l)} className="group text-left">
              <span className="relative block aspect-square overflow-hidden rounded-2xl ring-2 ring-transparent group-hover:ring-neutral-900">
                <Image src={l.images[0]} alt={l.title} fill sizes="(min-width: 640px) 320px, 45vw" className="object-cover" />
              </span>
              <span className="mt-2 block text-sm text-neutral-600">{l.tags.style.join(" · ")}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => pick(null)} className="mt-4 text-sm underline">
          Neither
        </button>
      </div>
    );
  }

  const preview = safePicks(getListings(), { relationship: "friend", interests, style });

  return (
    <div>
      <h1 className="text-xl font-semibold">Their taste</h1>
      <p className="mt-2 flex flex-wrap gap-2">
        {[...interests, ...style].map((t) => (
          <span key={t} className="rounded-full bg-cream px-3 py-1 text-sm">
            {t}
          </span>
        ))}
        {interests.length + style.length === 0 && <span className="text-sm text-neutral-600">No picks yet. Try again or start from who they are.</span>}
      </p>
      <PickRow title="Ideas from their taste" listings={preview} empty="Pick a few photos to see ideas." />
      <div className="mt-8">
        <SaveForm source="quiz" interests={interests} style={style} />
      </div>
      <button
        type="button"
        onClick={() => {
          setChosen([]);
          setRound(0);
        }}
        className="mt-4 text-sm underline"
      >
        Retake quiz
      </button>
    </div>
  );
}
