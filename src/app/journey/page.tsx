import Link from "next/link";
import { StartJourney } from "@/components/journey/StartJourney";
import { persona, steps } from "@/components/journey/steps";

// Presenter page, not part of the Etsy UI: the start of the guided demo.
export default function JourneyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-8">
      <p className="font-serif text-2xl text-etsy">Etsy · Made for Them</p>
      <h1 className="mt-1 text-3xl font-semibold">Guided demo: shopping for Mom</h1>

      <div className="mt-6 flex gap-4 rounded-2xl bg-amber-50 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-300 font-serif text-2xl" aria-hidden>
          {persona.initial}
        </span>
        <div>
          <p className="font-semibold">You&apos;re {persona.name}</p>
          <p className="mt-1 text-neutral-700">{persona.about}</p>
        </div>
      </div>

      <p className="mt-6 text-neutral-700">
        {steps.length} steps, about 3 minutes. A yellow panel at the top of each page tells you what to do, and the thing to click pulses.
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-neutral-700">
        {steps.map((s) => (
          <li key={s.title}>
            {s.when && <span className="mr-1 rounded bg-amber-100 px-1 text-xs font-semibold text-amber-950">⏩ {s.when}</span>}
            {s.title}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <StartJourney />
        <Link href="/concepts" className="text-sm underline">
          Or browse each concept on its own
        </Link>
      </div>
      <p className="mt-3 text-xs text-neutral-500">Starting clears the people saved in this browser.</p>
    </main>
  );
}
