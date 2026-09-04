"use client";

import { useSyncExternalStore } from "react";

const SERVER_DATE_KEY = "2000-01-01";
const subscribeOnce = () => () => undefined;
const getClientReady = () => true;
const getServerReady = () => false;

export function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLocalDateSnapshot() {
  return formatLocalDateKey(new Date());
}

function subscribeToLocalDate(onStoreChange: () => void) {
  let current = getLocalDateSnapshot();
  const interval = window.setInterval(() => {
    const next = getLocalDateSnapshot();
    if (next !== current) {
      current = next;
      onStoreChange();
    }
  }, 30_000);
  return () => window.clearInterval(interval);
}

/** A local YYYY-MM-DD value that hydrates safely in a static export. */
export function useLocalDateKey() {
  return useSyncExternalStore(subscribeToLocalDate, getLocalDateSnapshot, () => SERVER_DATE_KEY);
}

/** False for SSR/initial hydration, then true in the browser. */
export function useClientReady() {
  return useSyncExternalStore(subscribeOnce, getClientReady, getServerReady);
}

export function shiftLocalDateKey(dateKey: string, offset: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day + offset, 12);
  return formatLocalDateKey(date);
}
