export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsParams,
    ) => void;
  }
}

/** Send a GA4 event when analytics has loaded. Analytics must never block a tool. */
export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("modu:optional-consent:v1") !== "granted") return;
  } catch {
    return;
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", eventName, params]);
}
