# Etsy Enhanced Search prototype

CBS Digital PM Lab × Etsy. A clickable copy of Etsy as it works today (the
**current state**), which the team's Enhanced Search versions will be compared
against.

**Live:** https://etsy-enhanced-search-prototype.vercel.app (password-protected;
ask the team for it)

**Internal only.** The listings and photos are real Etsy data. Share the site
only with the team and our Etsy sponsor.

## Add or change a listing

1. Save 2 photos as `public/listings/<etsy-listing-id>-1.jpg` and `-2.jpg`.
2. Add an entry to `src/data/listings.ts`. Copy an existing one; fill every tag
   group (occasion, recipient, interests, style).
3. Run `pnpm test`. It fails on duplicate IDs, missing photos or empty tags.

The listing then shows on the homepage, in search and on its own page.

## Run locally

```sh
pnpm install
echo "SITE_PASSWORD=pick-anything" > .env.local
pnpm dev            # http://localhost:3000, any username + that password
pnpm test           # unit tests
```

## Deploy

```sh
vercel --prod
```

The production password is the `SITE_PASSWORD` env var on Vercel. If it is
missing, the site returns 500 instead of opening up.

## How it fits together

| Path | What it is |
|---|---|
| `src/data/listings.ts` | Seed listings, the file the team edits |
| `src/lib/listings.ts` | The only data access; becomes Supabase when edit mode is built |
| `src/lib/search.ts` | Today's keyword search (all words must match; ranked by review count) |
| `src/proxy.ts`, `src/lib/auth.ts` | Password gate on every route, photos included |
| `src/app/` | Pages: `/`, `/search`, `/listing/[id]` |

Ranking by review count is our stand-in for Etsy's ranking, not its real
algorithm. It reproduces what our research found: high-volume lookalikes rise
to the top and distinctive makers sink.

Built with Next.js 16 (App Router, Cache Components), Tailwind 4 and Vitest.
