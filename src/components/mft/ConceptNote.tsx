"use client";

import Link from "next/link";
import type { ChangeId } from "@/data/changes";
import { openChange } from "@/lib/viewStore";

// A small label on each concept page so the team can present it: which idea it
// is and which piece of class feedback it answers. Not part of the Etsy UI.
// `change` is the page's main change; its button opens the side panel.
// `whole`: the entire page is new, so "Etsy today" hides the page (globals.css);
// otherwise the new parts carry a <New> outline.
export function ConceptNote({ code, title, answers, change, whole = false }: { code: string; title: string; answers: string; change: ChangeId; whole?: boolean }) {
  return (
    <div data-whole={whole || undefined} className="concept-note border-b border-amber-200 bg-amber-50 text-sm text-amber-950">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-8">
        <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-xs font-semibold">{code}</span>
        <span className="font-semibold">{title}</span>
        <span className="text-amber-900">Answers: {answers}</span>
        <span className="rounded border border-dashed border-amber-500 px-1.5 py-0.5 text-xs font-semibold">
          {whole ? "Whole page is new" : "New parts are outlined"}
        </span>
        <button type="button" onClick={() => openChange(change)} className="underline">
          What changes + how it&apos;s built
        </button>
        <Link href="/concepts" className="ml-auto underline">
          All concepts
        </Link>
      </div>
      {whole && (
        <p className="today-notice mx-auto max-w-[1400px] px-4 pb-3 font-semibold sm:px-8">
          This page doesn&apos;t exist on Etsy today. Switch to “Made for Them” in the black bar to see it.
        </p>
      )}
    </div>
  );
}
