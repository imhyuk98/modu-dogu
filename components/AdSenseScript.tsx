"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useOptionalConsent } from "@/lib/consent";

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
const certifiedConsentEnabled = process.env.NEXT_PUBLIC_ADSENSE_CERTIFIED_CONSENT === "true";

export default function AdSenseScript() {
  const consent = useOptionalConsent();
  const pathname = usePathname();
  if (pathname === "/tools/friend-inbox" || !certifiedConsentEnabled || !adsenseId || consent !== "granted") return null;
  return <Script id="google-adsense" strategy="lazyOnload" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`} crossOrigin="anonymous" />;
}
