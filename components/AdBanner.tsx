"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!AD_CLIENT || !/^\d+$/.test(slot) || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [slot]);

  if (!AD_CLIENT || !/^\d+$/.test(slot)) {
    return (
      <div
        className={`bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm py-6 ${className}`}
      >
        광고 영역
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
