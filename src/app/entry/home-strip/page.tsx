import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { OccasionStrip } from "@/components/mft/EntryPoints";
import { New } from "@/components/mft/New";
import { PastOrderPrompt } from "@/components/mft/PastOrderPrompt";

export default function HomeStripPage() {
  return (
    <>
      <Header />
      <ConceptNote code="2b" title="Homepage strip" answers="how buyers reach their people: the next occasion on the homepage, which stays as it is." />
      <main className="flex-1">
        <div className="px-2 pt-4">
          <New label="New: save from a past order (1d)">
            <PastOrderPrompt />
          </New>
        </div>
        <div className="px-2 pt-4">
          <New label="New: next occasion strip">
            <OccasionStrip />
          </New>
        </div>
        <HomeSections />
      </main>
    </>
  );
}
