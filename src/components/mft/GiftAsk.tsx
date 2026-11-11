import Form from "next/form";
import Link from "next/link";

// Etsy's new gift page entry (Nov 2026): an AI search box with example prompts.
// `action` decides where it goes: keyword search for the current state, our
// scripted chat for Made for Them.
const examples = ["A Christmas gift for my mom", "Something funny for a coworker under $40", "A gift for a pickleball fan"];

export function GiftAsk({ action, field = "q" }: { action: string; field?: string }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Form action={action} className="flex rounded-2xl border-2 border-neutral-900 bg-white p-2 focus-within:border-etsy">
        <input
          name={field}
          placeholder="Describe who you're shopping for…"
          aria-label="Describe who you're shopping for"
          className="min-w-0 flex-1 px-3 py-2 outline-none"
        />
        <button type="submit" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700">
          ✦ Ask
        </button>
      </Form>
      <ul className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
        {examples.map((e, i) => (
          <li key={e}>
            <Link
              data-tour-target={i === 0 ? "ask-mom" : undefined}
              href={`${action}?${field}=${encodeURIComponent(e)}`}
              className="block rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900"
            >
              {e}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
