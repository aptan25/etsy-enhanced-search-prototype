import { Header } from "@/components/Header";
import { GiftHub, StartChatCard } from "@/components/mft/GiftHub";

// Current state: Etsy's gifts hub (checked 2026-11-12). "Start a chat" opens
// the Gifting Assistant; nothing is saved for next time and no reminders follow.
export default function GiftsPage() {
  return (
    <>
      <Header />
      <GiftHub chat={<StartChatCard href="/gifts/chat" />} />
    </>
  );
}
