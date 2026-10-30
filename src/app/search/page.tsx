import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/listings";
import { search } from "@/lib/search";

// Current state: plain keyword search. Reading the query is request-time data,
// so it lives inside <Suspense> (required with cacheComponents).
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<Header />}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const raw = (await searchParams).q;
  // ?q=a&q=b arrives as an array; use the first.
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = search(getListings(), query);

  return (
    <>
      <Header query={query} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8">
        {query === "" ? (
          <p className="py-16 text-center text-neutral-600">Type something to search, like &ldquo;pickleball&rdquo;.</p>
        ) : results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold">We couldn&apos;t find any results for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-neutral-600">Try searching for something else instead?</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {["All filters", "Estimated Arrival", "Price", "Star Seller", "Free shipping"].map((f) => (
                <span key={f} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((l) => (
                <li key={l.id}>
                  <ListingCard listing={l} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
