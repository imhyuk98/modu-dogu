"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { addRecentTool } from "@/lib/recent";
import { trackEvent } from "@/lib/analytics";
import { useOptionalConsent } from "@/lib/consent";

export default function TrackVisit() {
  const pathname = usePathname();
  const consent = useOptionalConsent();
  const visitState = useRef({ pathname: "", returning: false, analyticsPath: "" });

  useEffect(() => {
    if (pathname === "/tools/friend-inbox") return;
    if (visitState.current.pathname !== pathname) {
      let returning = false;
      if (pathname !== "/" && (pathname.startsWith("/calculators/") || pathname.startsWith("/tools/"))) {
        addRecentTool(pathname);
        const key = `modu:return-visit:${pathname}`;
        returning = Boolean(localStorage.getItem(key));
        localStorage.setItem(key, String(Date.now()));
      }
      visitState.current = { pathname, returning, analyticsPath: "" };
    }

    if (consent === "granted" && visitState.current.analyticsPath !== pathname) {
      trackEvent("page_view", {
        page_path: pathname,
        page_location: `${window.location.origin}${pathname}`,
        page_title: document.title,
      });
      if (visitState.current.returning) trackEvent("return_visit", { tool_path: pathname });
      visitState.current.analyticsPath = pathname;
    }
  }, [consent, pathname]);

  return null;
}
