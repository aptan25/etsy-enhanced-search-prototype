import type { Occasion } from "./occasions";
import type { Relationship } from "./people";

// Keyword parsing for the scripted gift chat. It stands in for Etsy's AI chat:
// good enough to demo "Etsy pulls the dates out of the conversation", not a
// real language model.

const relationshipWords: [RegExp, Relationship][] = [
  [/\b(mom|mother|mum|mama)\b/i, "mom"],
  [/\b(dad|father|papa)\b/i, "dad"],
  [/\b(wife|husband|partner|boyfriend|girlfriend|fianc[eé]e?)\b/i, "partner"],
  [/\b(co-?worker|colleague|boss|manager)\b/i, "coworker"],
  [/\b(sister|brother|sibling)\b/i, "sibling"],
  [/\b(friend|bestie|roommate)\b/i, "friend"],
];

const occasionWords: [RegExp, Omit<Occasion, "month" | "day"> & { month?: number; day?: number }][] = [
  [/\b(gift exchange|secret santa|white elephant)\b/i, { label: "Holiday gift exchange", tag: "holiday" }],
  [/\bchristmas\b/i, { label: "Christmas", tag: "holiday", month: 12, day: 25 }],
  [/\bmother'?s day\b/i, { label: "Mother's Day", tag: "mothers-day", month: 5, day: 10 }],
  [/\bfather'?s day\b/i, { label: "Father's Day", tag: "fathers-day", month: 6, day: 21 }],
  [/\bvalentine'?s?\b/i, { label: "Valentine's Day", tag: "valentines", month: 2, day: 14 }],
  [/\banniversary\b/i, { label: "Anniversary", tag: "anniversary" }],
  [/\bbaby shower\b/i, { label: "Baby shower" }],
  [/\bhousewarming\b/i, { label: "Housewarming", tag: "housewarming" }],
  [/\bwedding\b/i, { label: "Wedding", tag: "wedding" }],
  [/\bbirthday\b/i, { label: "Birthday", tag: "birthday" }],
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Words mapped to listing tag vocabulary. "Gardening" has no listings of its
// own, so it maps to the nearest tags we have.
const interestWords: [RegExp, string[]][] = [
  [/\bpickleball\b/i, ["pickleball"]],
  [/\b(tennis|sports?|athletic)\b/i, ["sports"]],
  [/\bgolf/i, ["golf"]],
  [/\b(coffee|espresso|latte)/i, ["coffee"]],
  [/\btea\b/i, ["tea"]],
  [/\b(ceramics?|pottery|mugs?)\b/i, ["ceramics"]],
  [/\b(art|drawing|painting|sketch)/i, ["art"]],
  [/\b(crafts?|crafty|knitting|sewing)\b/i, ["crafts"]],
  [/\b(jewelry|jewellery|necklaces?)\b/i, ["jewelry"]],
  [/\btravel/i, ["travel"]],
  [/\bfishing\b/i, ["fishing"]],
  [/\b(hiking|camping|outdoors?|nature)\b/i, ["outdoors"]],
  [/\b(garden|gardening|plants?)\b/i, ["outdoors", "home"]],
  [/\b(cooking|baking|food|foodie)\b/i, ["food"]],
  [/\bcandles?\b/i, ["candles"]],
  [/\b(home|decor|interiors?)\b/i, ["home"]],
  [/\b(funny|jokes?|humou?r|sarcastic)\b/i, ["humor"]],
  [/\b(office|desk|work)\b/i, ["office"]],
];

const styleWords: [RegExp, string][] = [
  [/\bminimalist|\bsimple\b|\bclean\b/i, "minimalist"],
  [/\bboho\b/i, "boho"],
  [/\brustic\b/i, "rustic"],
  [/\bvintage\b|\bretro\b/i, "vintage"],
  [/\bfunny\b|\bsilly\b/i, "funny"],
  [/\bplayful\b|\bcute\b|\bfun\b/i, "playful"],
  [/\belegant\b|\bclassy\b/i, "elegant"],
  [/\bsentimental\b|\bmeaningful\b/i, "sentimental"],
  [/\bhandmade\b|\bartisan\b/i, "artisan"],
];

// Whole month words only: "May" is a month, "Maya" is a name.
const MONTH_WORD = /^(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|june?|july?|aug(ust)?|sept?(ember)?|oct(ober)?|nov(ember)?|dec(ember)?)$/i;

const STOP_NAMES = new Set(["I", "My", "She", "He", "They", "Her", "His", "It", "The", "For", "Christmas", "Mother", "Father"]);

export type ParsedWho = {
  relationship?: Relationship;
  name?: string;
  occasion?: Occasion | Omit<Occasion, "month" | "day">;
};

// Leap year, so Feb 29 is allowed.
const validDay = (month: number, day: number) => day >= 1 && day <= new Date(2028, month, 0).getDate();

function parseDate(text: string): { month: number; day: number } | undefined {
  const named = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/i);
  if (named) {
    const month = MONTHS.indexOf(named[1].slice(0, 3).toLowerCase()) + 1;
    const day = Number(named[2]);
    if (validDay(month, day)) return { month, day };
  }
  const numeric = text.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  if (numeric) {
    const month = Number(numeric[1]);
    const day = Number(numeric[2]);
    if (month >= 1 && month <= 12 && validDay(month, day)) return { month, day };
  }
  return undefined;
}

/** "My coworker Maya, gift exchange Dec 18" → coworker, Maya, gift exchange on Dec 18. */
export function parseWho(text: string): ParsedWho {
  const out: ParsedWho = {};
  const rel = relationshipWords.find(([re]) => re.test(text));
  if (rel) out.relationship = rel[1];

  // A name is a capitalized word right after the relationship word, or after "named/called".
  const relMatch = rel && rel[0].exec(text);
  const afterRel = relMatch && text.slice(relMatch.index + relMatch[0].length).match(/^[\s,]+([A-Z][a-z]+)/);
  const named = text.match(/\b(?:named|called|name is)\s+([A-Z][a-z]+)/);
  const name = named?.[1] ?? afterRel?.[1];
  if (name && !STOP_NAMES.has(name) && !MONTH_WORD.test(name)) out.name = name;

  const occ = occasionWords.find(([re]) => re.test(text));
  const date = parseDate(text);
  if (occ) {
    const { month, day, ...rest } = occ[1];
    const when = date ?? (month && day ? { month, day } : undefined);
    out.occasion = when ? { ...rest, ...when } : rest;
  } else if (date) {
    out.occasion = { label: "Special day", ...date };
  }
  return out;
}

/** "She loves pickleball and anything funny" → interests [pickleball, humor], style [funny]. */
export function parseTaste(text: string): { interests: string[]; style: string[] } {
  const interests = new Set(interestWords.filter(([re]) => re.test(text)).flatMap(([, tags]) => tags));
  const style = new Set(styleWords.filter(([re]) => re.test(text)).map(([, s]) => s));
  return { interests: [...interests], style: [...style] };
}
