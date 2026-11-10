import { Header } from "@/components/Header";
import { PickRow } from "@/components/mft/PickRow";
import { GiftAsk } from "@/components/mft/GiftAsk";
import { getListings } from "@/lib/listings";

// Current state: Etsy's gift page after its Nov 2026 redesign. The AI box is
// the main entry; nothing is saved for next time and no reminders follow.
export default function GiftsPage() {
  const listings = getListings();
  const guides = [
    { title: "Gifts for her", listings: listings.filter((l) => l.tags.recipient.includes("her")).slice(0, 5) },
    { title: "Gifts for him", listings: listings.filter((l) => l.tags.recipient.includes("him")).slice(0, 5) },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-4 py-12 text-center sm:px-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Find the perfect gift</h1>
            <p className="mb-6 mt-2 text-neutral-700">Tell us who it&apos;s for and we&apos;ll find ideas.</p>
            <GiftAsk action="/gifts/chat" />
          </div>
        </section>
        <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-8">
          {guides.map((g) => (
            <PickRow key={g.title} title={g.title} listings={g.listings} />
          ))}
        </div>
      </main>
    </>
  );
}
