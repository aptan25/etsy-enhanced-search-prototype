import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export function PickRow({ title, subtitle, listings, empty }: { title: string; subtitle?: string; listings: Listing[]; empty?: string }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
      {listings.length === 0 ? (
        <p className="mt-3 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">{empty ?? "No picks yet."}</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {listings.map((l) => (
            <li key={l.id}>
              <ListingCard listing={l} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
