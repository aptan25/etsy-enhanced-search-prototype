import Image from "next/image";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { categories } from "@/lib/categories";
import { getListings } from "@/lib/listings";

// Etsy's homepage as it works today. Shared by `/` and the concept pages that
// add one entry point to it (homepage strip, search pill).
export function HomeSections() {
  const listings = getListings();
  // Stand-in for today's ranking (our assumption, not Etsy's algorithm):
  // the most-reviewed items win, which favors high-volume lookalikes.
  const popular = [...listings].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 text-center sm:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl">Find something you love</h1>
          <p className="mt-2 text-neutral-700">Gifts made by independent sellers, for every occasion.</p>

          <ul className="mt-8 flex flex-wrap justify-center gap-6">
            {categories.map((c) => {
              const cover = listings.find((l) => l.category === c.id);
              return (
                <li key={c.id}>
                  <Link href={`/search?q=${encodeURIComponent(c.query)}`} className="group flex w-28 flex-col items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white ring-2 ring-transparent group-hover:ring-neutral-900">
                      {cover && <Image src={cover.images[0]} alt="" fill sizes="96px" className="object-cover" />}
                    </div>
                    <span className="mt-2 text-sm font-semibold">{c.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8">
        <h2 className="text-xl font-semibold">Popular gifts right now</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {popular.map((l) => (
            <li key={l.id}>
              <ListingCard listing={l} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
