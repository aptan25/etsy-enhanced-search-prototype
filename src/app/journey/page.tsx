import { StartJourney } from "@/components/journey/StartJourney";

// Presenter link, not part of the Etsy UI: opening it starts the guided demo.
export default function JourneyPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-10 text-neutral-500">
      <StartJourney />
    </main>
  );
}
