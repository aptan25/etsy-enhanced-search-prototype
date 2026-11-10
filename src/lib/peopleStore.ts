"use client";

import { useSyncExternalStore } from "react";
import { demoPeople, parsePeople, type Person } from "./people";

// Saved people live in this browser only (prototype; no accounts or database).
// Every flow reads and writes through here, so a person saved in one flow shows
// up in the others.
const KEY = "made-for-them:people:v1";

const listeners = new Set<() => void>();
let memory: string | null = null; // used when the browser blocks storage

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function write(value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    memory = value;
  }
  listeners.forEach((l) => l());
}

let cachedRaw: string | null | undefined;
let cachedPeople: Person[] = demoPeople;

function getPeople(): Person[] {
  const raw = read();
  if (raw === cachedRaw) return cachedPeople;
  cachedRaw = raw;
  if (raw === null) {
    cachedPeople = demoPeople;
  } else {
    const parsed = parsePeople(raw);
    if (!parsed) console.warn("Saved people data was unreadable; showing the demo people instead.");
    cachedPeople = parsed ?? demoPeople;
  }
  return cachedPeople;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved people, or null during the server render (storage is browser-only). */
export function usePeople(): Person[] | null {
  return useSyncExternalStore(subscribe, getPeople, () => null);
}

export function savePerson(person: Person) {
  const others = getPeople().filter((p) => p.id !== person.id);
  write(JSON.stringify([...others, person]));
}

export function updatePerson(id: string, change: (p: Person) => Person) {
  const people = getPeople();
  if (!people.some((p) => p.id === id)) throw new Error(`No saved person with id "${id}"`);
  write(JSON.stringify(people.map((p) => (p.id === id ? change(p) : p))));
}

export function removePerson(id: string) {
  write(JSON.stringify(getPeople().filter((p) => p.id !== id)));
}

/** No saved people: the guided demo starts from a buyer who hasn't saved anyone. */
export function clearPeople() {
  write("[]");
}

/** Back to the three demo people. */
export function resetPeople() {
  write(null);
}
