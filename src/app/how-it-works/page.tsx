import Link from "next/link";
import { flows, pages, parts } from "@/data/architecture";
import { changes, type ChangeId } from "@/data/changes";

// Presenter page, not part of the Etsy UI: how Made for Them would be built.
// Each part links to the changes that use it; those links open the change's panel.

const usedBy = (partId: string) =>
  (Object.keys(changes) as ChangeId[]).filter((id) => (changes[id].parts as readonly string[]).includes(partId));

/** Link to the page a change is on, opening its panel there. */
const changeHref = (id: ChangeId) => `${changes[id].page.split("#")[0]}#change-${id}`;

const statusStyle = { Built: "bg-green-100 text-green-900", Partly: "bg-amber-100 text-amber-950", New: "bg-neutral-200 text-neutral-800" };

export default function HowItWorksPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <p className="font-serif text-2xl text-etsy">Etsy · Made for Them</p>
      <h1 className="mt-1 text-3xl font-semibold">How it&apos;s built</h1>
      <p className="mt-2 max-w-2xl text-neutral-700">
        Our proposal for how this would work inside Etsy, not a description of Etsy&apos;s real systems. Each part lists what Etsy has today, what fakes it in this
        prototype, and the changes that use it.
      </p>
      <nav className="mt-4 flex flex-wrap gap-4 text-sm underline">
        <a href="#parts">System map</a>
        <a href="#flows">Data flows</a>
        <a href="#pages">Pages</a>
        <Link href="/concepts">All concepts</Link>
      </nav>

      <section id="parts" className="mt-10 scroll-mt-4">
        <h2 className="text-xl font-semibold">System map</h2>
        <p className="mt-1 text-sm text-neutral-600">Buyer pages call the services; the services read and write the data.</p>
        {(["service", "data"] as const).map((kind) => (
          <div key={kind} className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{kind === "service" ? "Services" : "Data"}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {parts
                .filter((p) => p.kind === kind)
                .map((p) => (
                  <li key={p.id} id={`part-${p.id}`} className="scroll-mt-4 rounded-xl border border-neutral-200 p-4 text-sm target:border-amber-500 target:ring-2 target:ring-amber-300">
                    <p className="text-base font-semibold">{p.name}</p>
                    <p className="mt-1 text-neutral-700">{p.does}</p>
                    <p className="mt-2 text-xs text-neutral-500">Etsy today: {p.etsyToday}</p>
                    <p className="text-xs text-neutral-500">In this prototype: {p.prototype}</p>
                    <p className="mt-2 text-xs font-semibold">Used by</p>
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {usedBy(p.id).map((id) => (
                        <li key={id}>
                          <Link href={changeHref(id)} className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-950 hover:bg-amber-200">
                            {changes[id].code}: {changes[id].title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="flows" className="mt-12 scroll-mt-4">
        <h2 className="text-xl font-semibold">Data flows</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-300 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                {["Flow", "Trigger", "Data", "Saved to", "Used by"].map((h) => (
                  <th key={h} className="py-2 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flows.map((f) => (
                <tr key={f.name} className="border-b border-neutral-100 align-top">
                  <td className="py-2 pr-4 font-semibold">{f.name}</td>
                  <td className="py-2 pr-4">{f.trigger}</td>
                  <td className="py-2 pr-4">{f.data}</td>
                  <td className="py-2 pr-4">{f.savedTo}</td>
                  <td className="py-2 pr-4">{f.usedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="pages" className="mt-12 scroll-mt-4">
        <h2 className="text-xl font-semibold">Customer-facing pages</h2>
        <p className="mt-1 text-sm text-neutral-600">Built = in this prototype. Partly = page exists, gift parts missing. New = not built yet.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {pages.map((p) => (
            <li key={p.name} className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 text-sm">
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${statusStyle[p.status]}`}>{p.status}</span>
              <span>
                {p.href ? (
                  <Link href={p.href} className="font-semibold underline">
                    {p.name}
                  </Link>
                ) : (
                  <span className="font-semibold">{p.name}</span>
                )}
                <span className="block text-neutral-600">{p.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
