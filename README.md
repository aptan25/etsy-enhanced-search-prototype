# Etsy Made for Them prototype

CBS Digital PM Lab × Etsy. A clickable copy of Etsy as it works today (the
**current state**), plus one page per **Made for Them** idea: save the people
you buy gifts for, get reminded before their occasions, and say how the gift
went. Start at **`/concepts`** (linked from the black banner on every page),
which groups the pages by the class feedback each one answers.

**Live:** https://etsy-enhanced-search-prototype.vercel.app (password-protected;
ask the team for it)

**Internal only.** The listings and photos are real Etsy data. Share the site
only with the team and our Etsy sponsor.

## Demo notes

- Saved people live in each viewer's browser (no accounts, no database). Every
  viewer starts with three demo people: Mom, Maya and Dad. Press **Reset demo
  people** on `/concepts` before presenting.
- The gift chat is scripted keyword matching, not an AI model. Try the
  suggested replies, or sentences like "my coworker Maya, gift exchange Dec 18".
- Day counts ("in 13 days") use the viewer's clock.

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
| `src/lib/match.ts` | Made for Them picks: "safe" (a named interest) vs "something new" (nearby interests only) |
| `src/lib/people.ts`, `src/lib/peopleStore.ts` | Saved-person type, demo people, browser storage |
| `src/lib/occasions.ts`, `src/lib/intent.ts` | Next-occasion math; chat parsing |
| `src/components/mft/` | The Made for Them screens |
| `src/proxy.ts`, `src/lib/auth.ts` | Password gate on every route, photos included |
| `src/app/` | Pages: current state (`/`, `/search`, `/listing/[id]`, `/gifts`), concepts (`/concepts`, `/made-for-them/...`, `/entry/...`, `/seller/attributes`) |

Ranking by review count is our stand-in for Etsy's ranking, not its real
algorithm. It reproduces what our research found: high-volume lookalikes rise
to the top and distinctive makers sink.

Built with Next.js 16 (App Router, Cache Components), Tailwind 4 and Vitest.
