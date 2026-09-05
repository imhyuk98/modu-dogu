"use client";

import { useSyncExternalStore } from "react";

export type OptionalConsent = "unknown" | "granted" | "denied";

const STORAGE_KEY = "modu:optional-consent:v1";
const CHANGE_EVENT = "modu:consent-change";
export const OPEN_CONSENT_EVENT = "modu:consent-open";

function getSnapshot(): OptionalConsent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unknown";
  } catch {
    return "unknown";
  }
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function useOptionalConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "unknown" as const);
}

export function setOptionalConsent(value: Exclude<OptionalConsent, "unknown">) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }
  if (value === "denied") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push([
      "consent",
      "update",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0]?.trim();
      if (name?.startsWith("_ga")) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
