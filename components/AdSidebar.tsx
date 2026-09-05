"use client";

import AdBanner from "./AdBanner";
import { useOptionalConsent } from "@/lib/consent";
import { usePathname } from "next/navigation";

const TOP_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP ?? "";
const BOTTOM_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? "";
const certifiedConsentEnabled = process.env.NEXT_PUBLIC_ADSENSE_CERTIFIED_CONSENT === "true";
const AD_EXCLUDED_PATHS = new Set([
  "/calculators/alcohol",
  "/tools/image-game",
  "/tools/never-have-i-ever",
]);

export default function AdSidebar() {
  const consent = useOptionalConsent();
  const pathname = usePathname();
  if (AD_EXCLUDED_PATHS.has(pathname) || !certifiedConsentEnabled || consent !== "granted" || (!TOP_SLOT && !BOTTOM_SLOT)) return null;

  return (
    <aside className="hidden xl:block w-[160px] flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        <AdBanner slot={TOP_SLOT} format="vertical" />
        <AdBanner slot={BOTTOM_SLOT} format="vertical" />
      </div>
    </aside>
  );
}
