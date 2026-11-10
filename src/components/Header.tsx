import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";
import { Account } from "./journey/Account";

const navLinks = ["Gifts", "Top 100 Gifts", "Home Favorites", "Fashion Finds", "Wedding Guide", "Registry"];

// Concept pages add their entry point to the header: `searchAddon` sits under
// the search bar (the "Shopping for someone?" pill), `bell` replaces the static
// favorites icon (the reminder notification).
export function Header({ query = "", searchAddon, bell }: { query?: string; searchAddon?: ReactNode; bell?: ReactNode }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:gap-6 sm:px-8">
        <Link href="/" className="font-serif text-3xl leading-none text-etsy" aria-label="Home">
          Etsy
        </Link>
        <span className="hidden text-sm text-neutral-700 md:inline">☰ Categories</span>

        <div className="relative min-w-0 flex-1">
          <Form action="/search" className="flex min-w-0">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search for anything"
              aria-label="Search"
              className="min-w-0 flex-1 rounded-l-full border-2 border-neutral-900 px-4 py-2 text-sm outline-none focus:border-etsy"
            />
            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-full border-2 border-l-0 border-neutral-900 bg-etsy px-4 text-white hover:bg-etsy-dark"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.41 1.4-5.4-5.39A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
              </svg>
            </button>
          </Form>
          {searchAddon}
        </div>

        <nav className="hidden items-center gap-4 text-sm text-neutral-700 sm:flex" aria-label="Account">
          <Account />
          {bell ?? <span aria-label="Favorites">♡</span>}
          <span aria-label="Cart">🛒</span>
        </nav>
      </div>

      <nav className="mx-auto hidden max-w-[1400px] justify-center gap-6 px-8 pb-3 text-sm text-neutral-700 md:flex">
        {navLinks.map((l) =>
          l === "Gifts" ? (
            <Link key={l} href="/gifts" className="hover:underline">
              {l}
            </Link>
          ) : (
            <span key={l}>{l}</span>
          ),
        )}
      </nav>
    </header>
  );
}
