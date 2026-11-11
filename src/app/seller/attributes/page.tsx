import Link from "next/link";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { SellerAttributes } from "@/components/mft/SellerAttributes";

export default function SellerAttributesPage() {
  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-8">
          <Link href="/" className="font-serif text-3xl leading-none text-etsy">
            Etsy
          </Link>
          <span className="text-sm font-semibold text-neutral-700">Shop Manager</span>
        </div>
      </header>
      <ConceptNote change="3b-seller" code="3b" title="Seller confirms attributes" answers="match beyond the literal interest: sellers say who it's great for." whole />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <SellerAttributes />
      </main>
    </>
  );
}
