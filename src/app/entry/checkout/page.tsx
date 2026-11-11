import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { CheckoutSave } from "@/components/mft/CheckoutSave";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <ConceptNote change="2c-who" code="2c" title="Save at checkout" answers="how people get saved in the first place: when they buy a gift." />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <Suspense>
          <CheckoutSave />
        </Suspense>
      </main>
    </>
  );
}
