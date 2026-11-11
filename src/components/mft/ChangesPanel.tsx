"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { partById } from "@/data/architecture";
import { changes } from "@/data/changes";
import { changeFromHash, openChange, useOpenChange } from "@/lib/viewStore";

/** Side panel for one change: Etsy today, what we change, and how it's built. */
export function ChangesPanel() {
  const id = useOpenChange();
  const pathname = usePathname();

  // Links from /how-it-works carry #change-<id> to open the panel on arrival.
  useEffect(() => {
    const fromHash = changeFromHash(window.location.hash);
    if (fromHash) openChange(fromHash);
  }, [pathname]);

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openChange(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id]);

  if (!id) return null;
  const c = changes[id];
  return (
    <aside
      role="dialog"
      aria-label={`What changed: ${c.title}`}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border border-neutral-300 bg-white p-5 text-sm shadow-2xl sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[400px] sm:rounded-none sm:border-y-0 sm:border-r-0"
    >
      <div className="flex items-start gap-3">
        <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-950">{c.code}</span>
        <h2 className="flex-1 text-base font-semibold">{c.title}</h2>
        <button type="button" onClick={() => openChange(null)} aria-label="Close" className="-m-1 rounded px-2 text-lg leading-none hover:bg-neutral-100">
          ×
        </button>
      </div>

      <dl className="mt-4 space-y-3">
        <Row label="Etsy today">{c.today}</Row>
        <Row label="What we change">{c.change}</Row>
        <Row label="Answers">{c.answers}</Row>
      </dl>

      <h3 className="mt-6 border-t border-neutral-200 pt-4 font-semibold">How it&apos;s built</h3>
      <dl className="mt-3 space-y-3">
        <Row label="Reads">{c.reads.length ? c.reads.join(" · ") : "Nothing new"}</Row>
        <Row label="Saves">{c.saves.length ? c.saves.join(" · ") : "Nothing"}</Row>
      </dl>
      <ul className="mt-3 space-y-2">
        {c.parts.map((p) => {
          const part = partById(p);
          return (
            <li key={p} className="rounded-lg bg-neutral-50 p-3">
              <Link href={`/how-it-works#part-${p}`} onClick={() => openChange(null)} className="font-semibold underline">
                {part.name}
              </Link>
              <p className="mt-1 text-neutral-700">{part.does}</p>
              <p className="mt-1 text-xs text-neutral-500">In this prototype: {part.prototype}</p>
            </li>
          );
        })}
      </ul>
      <Link href="/how-it-works" onClick={() => openChange(null)} className="mt-5 inline-block underline">
        Full system map and data flows →
      </Link>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
