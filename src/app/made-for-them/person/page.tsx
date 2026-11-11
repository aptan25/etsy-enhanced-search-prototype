import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { PersonView } from "@/components/mft/PersonView";

export default function PersonPage() {
  return (
    <>
      <Header />
      <ConceptNote change="3a-person" code="3a" title="Picks + Something new" answers="suggest new things, not just the interests the buyer typed." whole />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <Suspense>
          <PersonView />
        </Suspense>
      </main>
    </>
  );
}
