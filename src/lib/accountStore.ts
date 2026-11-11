"use client";

import { useSyncExternalStore } from "react";

// A pretend Etsy account, so the demo can show a guest becoming signed in.
// Nothing is sent anywhere: it is a name in this browser's storage.
export type Account = { name: string; email: string };

const KEY = "made-for-them:account:v1";
const listeners = new Set<() => void>();
let memory: string | null = null; // used when the browser blocks storage
let cache: { raw: string | null; value: Account | null } = { raw: null, value: null };

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function parse(raw: string | null): Account | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return typeof v?.name === "string" && typeof v?.email === "string" ? { name: v.name, email: v.email } : null;
  } catch {
    return null;
  }
}

// Same object while the stored text is unchanged, as useSyncExternalStore needs.
function read(): Account | null {
  const raw = readRaw();
  if (raw !== cache.raw) cache = { raw, value: parse(raw) };
  return cache.value;
}

function write(raw: string | null) {
  try {
    if (raw === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, raw);
  } catch {
    memory = raw;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The signed-in account, or null for a guest (and during the server render). */
export function useAccount(): Account | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** "jess.t@example.com" → Jess. Throws on something that isn't an email. */
export function accountFromEmail(email: string): Account {
  const clean = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new Error("Enter an email address");
  const first = clean.split("@")[0].split(/[._+-]/)[0];
  return { name: first.charAt(0).toUpperCase() + first.slice(1), email: clean };
}

export const signIn = (account: Account) => write(JSON.stringify(account));
export const signOut = () => write(null);
