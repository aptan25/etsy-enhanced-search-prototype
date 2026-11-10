import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

/** A row of listings. With `buy`, each card gets a button (e.g. "Buy for Mom") linking to checkout. */
export function PickRow({
  title,
  subtitle,
  listings,
  empty,
  buy,
}: {
  title: string;
  subtitle?: string;
  listings: Listing[];
  empty?: string;
  buy?: { label: string; href: (l: Listing) => string; tourTarget?: string };
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
      {listings.length === 0 ? (
        <p className="mt-3 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">{empty ?? "No picks yet."}</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {listings.map((l, i) => (
            <li key={l.id}>
              <ListingCard listing={l} />
              {buy && (
                <Link
                  href={buy.href(l)}
                  data-tour-target={i === 0 ? buy.tourTarget : undefined}
                  className="mt-2 block rounded-full border border-neutral-900 py-1.5 text-center text-sm font-semibold hover:bg-neutral-900 hover:text-white"
                >
                  {buy.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
