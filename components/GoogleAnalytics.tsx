"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useOptionalConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-79YR5PPP3Q";

export default function GoogleAnalytics() {
  const consent = useOptionalConsent();
  const pathname = usePathname();
  if (pathname === "/tools/friend-inbox" || !GA_ID || consent !== "granted") return null;

  const safeLocation = typeof window === "undefined" ? "https://modu-dogu.pages.dev/" : `${window.location.origin}${window.location.pathname}`;
  const safeLocationJson = JSON.stringify(safeLocation);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false, page_location: ${safeLocationJson}, allow_google_signals: false, allow_ad_personalization_signals: false });
        `}
      </Script>
    </>
  );
}
