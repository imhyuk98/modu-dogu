"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HtmlLanguageSync() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
  }, [pathname]);
  return null;
}
