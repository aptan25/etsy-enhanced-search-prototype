import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { formatCount, formatPrice, ListingCard } from "@/components/ListingCard";
import { getListing, getListings } from "@/lib/listings";

// Every listing is prerendered at build time; an unknown ID hits notFound().
export function generateStaticParams() {
  return getListings().map((l) => ({ id: l.id }));
}

export default async function ListingPage({ params }: PageProps<"/listing/[id]">) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const related = getListings()
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 5);

  const highlights = [
    listing.isHandmade ? "Handmade" : "Designed by " + listing.shop,
    listing.isCustom ? "Personalization available" : null,
    listing.materials ? `Materials: ${listing.materials}` : null,
  ].filter((h): h is string => h !== null);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <Gallery images={listing.images} alt={listing.title} />

          <div>
            <p className="text-2xl font-semibold">{formatPrice(listing.price)}</p>
            <h1 className="mt-2 text-lg text-neutral-800">{listing.title}</h1>
            <p className="mt-2 text-sm">
              <span className="font-semibold underline">{listing.shop}</span>
              <span className="ml-2 text-neutral-700">
                {listing.rating.toFixed(1)} ★ ({formatCount(listing.reviewCount)} reviews)
              </span>
            </p>

            {/* Inert: the prototype has no cart or checkout. */}
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Add to cart
            </button>

            <section className="mt-8 border-t border-neutral-200 pt-6">
              <h2 className="font-semibold">Item details</h2>
              <ul className="mt-3 space-y-1 text-sm text-neutral-700">
                {highlights.map((h) => (
                  <li key={h}>• {h}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-neutral-800">{listing.description}</p>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">You may also like</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((l) => (
                <li key={l.id}>
                  <ListingCard listing={l} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
