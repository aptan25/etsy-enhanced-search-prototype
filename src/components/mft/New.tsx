"use client";

import type { ReactNode } from "react";
import { changes, type ChangeId } from "@/data/changes";
import { openChange } from "@/lib/viewStore";

// Presenter marker, not part of the Etsy UI: a dashed amber outline and a
// numbered tag around the parts of a page that differ from Etsy today. The tag
// opens the side panel for `change`. The banner's view switch hides the outline
// ("Made for Them") or the whole part ("Etsy today"); see globals.css.
// Outline (not border) so wrapping doesn't shift the layout.
// Hidden when the wrapped component renders nothing (only the tag is left).
export function New({ change, label = "New", inline = false, children }: { change: ChangeId; label?: string; inline?: boolean; children: ReactNode }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      data-new={change}
      className={`relative rounded-xl outline-2 outline-offset-4 outline-amber-400 outline-dashed [&:not(:has(>*+*))]:hidden ${inline ? "inline-block" : "block"}`}
    >
      <button
        type="button"
        onClick={() => openChange(change)}
        aria-label={`What changed: ${changes[change].title}`}
        className="new-tag absolute -top-3.5 left-2 z-10 whitespace-nowrap rounded bg-amber-300 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-amber-950 hover:bg-amber-400"
      >
        {label} <span aria-hidden>ⓘ</span>
      </button>
      {children}
    </Tag>
  );
}
