import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { LookbackView } from "@/components/mft/LookbackView";

export default function LookbackPage() {
  return (
    <>
      <Header />
      <ConceptNote code="3c" title="Was it a hit?" answers="suggestions improve after each gift, beyond the first interests." />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <Suspense>
          <LookbackView />
        </Suspense>
      </main>
    </>
  );
}
