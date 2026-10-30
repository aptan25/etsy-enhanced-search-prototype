import type { Category } from "./types";

export const categories: { id: Category; label: string; query: string }[] = [
  { id: "birthday", label: "Birthday gifts", query: "birthday gift" },
  { id: "pickleball", label: "Pickleball", query: "pickleball" },
  { id: "jewelry", label: "Name necklaces", query: "name necklace" },
  { id: "mugs", label: "Handmade mugs", query: "mug" },
  { id: "anniversary", label: "Anniversary", query: "anniversary" },
  { id: "decor", label: "Wall decor", query: "wall hanging" },
];
