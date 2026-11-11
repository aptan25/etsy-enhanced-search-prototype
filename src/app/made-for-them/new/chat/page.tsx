import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ConceptNote } from "@/components/mft/ConceptNote";
import { GiftChat } from "@/components/mft/GiftChat";

export default function ChatStartPage() {
  return (
    <>
      <Header />
      <ConceptNote change="1c-chat" code="1c" title="Start from a chat" answers="a person you've never bought for. 2–3 questions, then save." />
      <main className="flex-1 px-4 py-8 sm:px-8">
        <Suspense>
          <GiftChat canSave />
        </Suspense>
      </main>
    </>
  );
}
