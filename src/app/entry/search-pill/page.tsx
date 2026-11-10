import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { ShoppingForPill } from "@/components/mft/EntryPoints";
import { New } from "@/components/mft/New";

export default function SearchPillPage() {
  return (
    <>
      <Header
        searchAddon={
          <New inline>
            <ShoppingForPill />
          </New>
        }
      />
      <ConceptNote code="2a" title="Search bar pill" answers="how buyers reach their people without a new page: from the search bar they already use." />
      <main className="flex-1">
        <HomeSections />
      </main>
    </>
  );
}
