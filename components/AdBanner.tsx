"use client";

import { useEffect, useRef } from "react";
import { useOptionalConsent } from "@/lib/consent";

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
  const consent = useOptionalConsent();

  useEffect(() => {
    if (!AD_CLIENT || consent !== "granted" || !/^\d+$/.test(slot) || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [consent, slot]);

  if (!AD_CLIENT || consent !== "granted" || !/^\d+$/.test(slot)) return null;

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
