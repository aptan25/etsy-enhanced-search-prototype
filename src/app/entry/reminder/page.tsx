import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { ReminderBell, ReminderEmail } from "@/components/mft/EntryPoints";
import { New } from "@/components/mft/New";

export default function ReminderPage() {
  return (
    <>
      <Header
        bell={
          <New inline>
            <ReminderBell />
          </New>
        }
      />
      <ConceptNote code="2d" title="Reminders" answers="how buyers come back: Etsy reaches out before the occasion (bell + email)." />
      <main className="flex-1">
        <section className="bg-neutral-100 px-4 py-10 sm:px-8">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-neutral-500">The same reminder by email</h2>
          <div className="mx-auto max-w-xl">
            <New label="New: reminder email">
              <ReminderEmail />
            </New>
          </div>
        </section>
        <HomeSections />
      </main>
    </>
  );
}
