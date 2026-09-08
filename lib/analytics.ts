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
  if (typeof window === "undefined") return false;
  if (window.location.pathname === "/tools/friend-inbox") return false;
  try {
    if (window.localStorage.getItem("modu:optional-consent:v1") !== "granted") return false;
  } catch {
    return false;
  }
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
      return true;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", eventName, params]);
    return true;
  } catch { return false; }
}
