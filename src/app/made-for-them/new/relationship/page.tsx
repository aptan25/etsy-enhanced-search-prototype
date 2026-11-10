import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { RelationshipStart } from "@/components/mft/RelationshipStart";

export default function RelationshipStartPage() {
  return (
    <>
      <Header />
      <ConceptNote code="1b" title="Start from who they are" answers="a person you've never bought for. Relationship, occasion, budget." />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <h1 className="mb-6 text-2xl font-semibold">Shopping for someone new</h1>
        <RelationshipStart />
      </main>
    </>
  );
}
