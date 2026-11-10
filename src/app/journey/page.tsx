import Link from "next/link";
import { StartJourney } from "@/components/journey/StartJourney";
import { steps } from "@/components/journey/steps";

const states = [
  { state: "Already signed in", where: "Sam is signed in the whole time (top right says “Hi, Sam”)." },
  { state: "Already bought from Etsy", where: "Step 1: a past order becomes Mom's profile." },
  { state: "No profile saved", where: "Steps 1 and 4–6: Sam starts with nobody saved, then adds Maya from scratch." },
  { state: "Profile already saved", where: "Steps 2–3 and 7–11: shortcuts, checkout, reminders and feedback use saved people." },
];

// Presenter page, not part of the Etsy UI: the start of the guided demo.
export default function JourneyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-8">
      <p className="font-serif text-2xl text-etsy">Etsy · Made for Them</p>
      <h1 className="mt-1 text-3xl font-semibold">Guided demo: Sam&apos;s gift year</h1>
      <p className="mt-2 text-neutral-700">
        One buyer, start to finish, in {steps.length} steps (about 5 minutes). A card at the bottom of each page says what to click.
        Starting clears the people saved in this browser.
      </p>

      <h2 className="mt-8 font-semibold">Buyer states it covers</h2>
      <ul className="mt-2 divide-y divide-neutral-100 rounded-xl border border-neutral-200 text-sm">
        {states.map((s) => (
          <li key={s.state} className="flex flex-col gap-0.5 p-3 sm:flex-row sm:gap-4">
            <span className="font-semibold sm:w-48 sm:shrink-0">{s.state}</span>
            <span className="text-neutral-700">{s.where}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-semibold">The steps</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-neutral-700">
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
    </main>
  );
}
