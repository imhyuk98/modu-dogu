"use client";

import Script from "next/script";
import { useOptionalConsent } from "@/lib/consent";

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdSenseScript() {
  const consent = useOptionalConsent();
  if (!adsenseId || consent !== "granted") return null;
  return <Script id="google-adsense" strategy="lazyOnload" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`} crossOrigin="anonymous" />;
}
