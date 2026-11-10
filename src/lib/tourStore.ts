"use client";

import { useSyncExternalStore } from "react";

// Which step of the guided demo (/journey) the viewer is on, or null when no
// demo is running. Browser-only, like saved people.
const KEY = "made-for-them:tour:v1";
const listeners = new Set<() => void>();
let memory: string | null = null; // used when the browser blocks storage

function read(): number | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = memory;
  }
  const n = Number(raw);
  return raw !== null && Number.isInteger(n) && n >= 0 ? n : null;
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

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current step, or null (no demo running, or during the server render). */
export function useTourStep(): number | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export const setTourStep = (step: number) => write(String(step));
export const endTour = () => write(null);
