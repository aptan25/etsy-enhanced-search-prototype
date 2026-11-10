import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GiftChat } from "@/components/mft/GiftChat";

// Current state: Etsy's AI gift chat. It finds ideas for this gift but keeps
// nothing for the next one (what our Nov 4 test of the real chat found).
export default function CurrentGiftChatPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-8">
        <Suspense>
          <GiftChat canSave={false} />
        </Suspense>
      </main>
    </>
  );
}
