"use client";

import AdBanner from "./AdBanner";

const TOP_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP ?? "";
const BOTTOM_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? "";

export default function AdSidebar() {
  return (
    <aside className="hidden xl:block w-[160px] flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        <AdBanner slot={TOP_SLOT} format="vertical" />
        <AdBanner slot={BOTTOM_SLOT} format="vertical" />
      </div>
    </aside>
  );
}
