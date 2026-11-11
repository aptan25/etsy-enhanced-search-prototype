"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "@/lib/accountStore";
import { usePeople } from "@/lib/peopleStore";
import { endTour, setTourStep, useTourStep } from "@/lib/tourStore";
import { persona, steps } from "./steps";

/** The guided-demo panel, pinned to the top of every page while the demo runs. */
export function JourneyBar() {
  const step = useTourStep();
  const people = usePeople();
  const account = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const current = step === null ? undefined : steps[step];

  // The viewer clicked the real link into the next step's page.
  useEffect(() => {
    if (step === null || !current) return;
    const next = steps[step + 1];
    if (next && next.path !== current.path && pathname === next.path) setTourStep(step + 1);
  }, [step, current, pathname]);

  // Hide concept labels and make this step's target pulse (globals.css).
  useEffect(() => {
    const root = document.documentElement;
    if (!current) {
      delete root.dataset.tour;
      return;
    }
    root.dataset.tour = current.target ?? "on";
    return () => {
      delete root.dataset.tour;
    };
  }, [current]);

  // A stale step number from an older version of the demo.
  useEffect(() => {
    if (step !== null && !current) endTour();
  }, [step, current]);

  if (step === null || !current || !people) return null;

  const go = (to: number) => {
    setTourStep(to);
    router.push(steps[to].href(people, account));
  };
  const last = step === steps.length - 1;
  // Steps with an action lock Next until it's done, so later steps have Mom to show.
  const locked = current.done ? !current.done(people, account) : false;

  return (
    <aside aria-label="Guided demo" className="sticky top-0 z-40 border-b-2 border-amber-400 bg-amber-50 text-neutral-900 shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5 sm:px-8">
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-300 font-serif text-lg sm:flex" aria-hidden>
          {persona.initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-amber-900">
            <span>
              You&apos;re {persona.name}, {persona.goal} · {step + 1}/{steps.length}
            </span>
            {current.when && <span className="rounded bg-amber-300 px-1.5 font-semibold">⏩ {current.when}</span>}
          </p>
          <p className="text-sm">
            <span className="font-semibold">{current.title}.</span> <span className="text-neutral-700">👉 {current.action}</span>
            {pathname !== current.path && (
              <Link href={current.href(people, account)} className="ml-2 font-semibold underline">
                Go back to this step
              </Link>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="hidden underline sm:inline">
              Back
            </button>
          )}
          {last ? (
            <button
              type="button"
              onClick={() => {
                endTour();
                router.push("/concepts");
              }}
              className="tour-pulse rounded-full bg-neutral-900 px-4 py-1.5 font-semibold text-white"
            >
              Finish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(step + 1)}
              disabled={locked}
              title={locked ? "Do the highlighted step first" : undefined}
              className={`rounded-full px-4 py-1.5 font-semibold ${
                locked
                  ? "cursor-not-allowed border border-neutral-300 bg-white text-neutral-400"
                  : current.done
                    ? "tour-pulse bg-neutral-900 text-white"
                    : "border border-neutral-400 bg-white"
              }`}
            >
              Next →
            </button>
          )}
          <button type="button" onClick={endTour} className="text-neutral-500 underline">
            Exit
          </button>
        </div>
      </div>
      <div className="h-1 bg-amber-100">
        <div className="h-full bg-amber-400" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
    </aside>
  );
}
