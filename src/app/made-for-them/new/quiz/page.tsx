import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { TasteQuiz } from "@/components/mft/TasteQuiz";

export default function QuizStartPage() {
  return (
    <>
      <Header />
      <ConceptNote code="1a" title="Taste quiz" answers="a person you've never bought for. Four photo picks, no typing." />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8">
        <TasteQuiz />
      </main>
    </>
  );
}
