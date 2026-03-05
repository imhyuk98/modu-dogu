"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { addRecentTool } from "@/lib/recent";

export default function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && (pathname.startsWith("/calculators/") || pathname.startsWith("/tools/"))) {
      addRecentTool(pathname);
    }
  }, [pathname]);

  return null;
}
