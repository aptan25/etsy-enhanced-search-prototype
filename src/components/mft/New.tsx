import type { ReactNode } from "react";

// Presenter marker, not part of the Etsy UI: a dashed amber outline and a "New"
// tag around the parts of a page that differ from Etsy today, so reviewers know
// where to look. Outline (not border) so wrapping doesn't shift the layout.
// Hidden when the wrapped component renders nothing (only the tag is left).
export function New({ label = "New", inline = false, children }: { label?: string; inline?: boolean; children: ReactNode }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={`relative rounded-xl outline-2 outline-offset-4 outline-amber-400 outline-dashed [&:not(:has(>*+*))]:hidden ${inline ? "inline-block" : "block"}`}>
      <span className="pointer-events-none absolute -top-3.5 left-2 z-10 whitespace-nowrap rounded bg-amber-300 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-amber-950">
        {label}
      </span>
      {children}
    </Tag>
  );
}
