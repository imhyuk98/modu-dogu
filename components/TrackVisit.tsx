"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { addRecentTool } from "@/lib/recent";
import { trackEvent } from "@/lib/analytics";

export default function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    if (pathname !== "/" && (pathname.startsWith("/calculators/") || pathname.startsWith("/tools/"))) {
      addRecentTool(pathname);
      const key = `modu:return-visit:${pathname}`;
      if (localStorage.getItem(key)) {
        trackEvent("return_visit", { tool_path: pathname });
      }
      localStorage.setItem(key, String(Date.now()));
    }
  }, [pathname]);

  return null;
}
