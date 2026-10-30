import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform group-hover:scale-[1.02]"
        />
      </div>
      <h3 className="mt-2 line-clamp-1 text-sm text-neutral-800 group-hover:underline">{listing.title}</h3>
      <p className="mt-0.5 text-xs text-neutral-700">
        <span className="font-semibold">{listing.rating.toFixed(1)}</span> ★{" "}
        <span className="text-neutral-500">({formatCount(listing.reviewCount)})</span>
      </p>
      <p className="mt-0.5 font-semibold">{formatPrice(listing.price)}</p>
      <p className="text-xs text-neutral-500">{listing.shop}</p>
    </Link>
  );
}
