"use client";

import { useSyncExternalStore } from "react";
import { isChangeId, type ChangeId } from "@/data/changes";

/**
 * Presenter view, set from the banner:
 * - "changes": new parts outlined with numbered pins (default)
 * - "mft": Made for Them as a buyer would see it, no outlines
 * - "today": Etsy as it is today, new parts hidden
 * Kept in the browser so it survives page changes.
 */
export type View = "changes" | "mft" | "today";
export const views: { id: View; label: string }[] = [
  { id: "today", label: "Etsy today" },
  { id: "mft", label: "Made for Them" },
  { id: "changes", label: "Show changes" },
];

const KEY = "made-for-them:view:v1";
const DEFAULT: View = "changes";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
let memory: string | null = null; // used when the browser blocks storage
let open: ChangeId | null = null; // which change the side panel shows

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readView(): View {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = memory;
  }
  return views.some((v) => v.id === raw) ? (raw as View) : DEFAULT;
}

export function setView(view: View) {
  try {
    window.localStorage.setItem(KEY, view);
  } catch {
    memory = view;
  }
  notify();
}

export function useView(): View {
  return useSyncExternalStore(subscribe, readView, () => DEFAULT);
}

export function openChange(id: ChangeId | null) {
  open = id;
  notify();
}

export function useOpenChange(): ChangeId | null {
  return useSyncExternalStore(subscribe, () => open, () => null);
}

/** `#change-2c-who` in a link opens that change's panel. */
export function changeFromHash(hash: string): ChangeId | null {
  const id = hash.replace(/^#change-/, "");
  return hash.startsWith("#change-") && isChangeId(id) ? id : null;
}
