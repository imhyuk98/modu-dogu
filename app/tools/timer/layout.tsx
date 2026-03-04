import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "타이머 & 스톱워치 - 온라인 타이머, 카운트다운",
  description:
    "온라인 타이머와 스톱워치를 무료로 사용하세요. 카운트다운 타이머, 스톱워치, 랩 타임 기록이 가능합니다.",
  keywords: [
    "타이머",
    "온라인 타이머",
    "스톱워치",
    "카운트다운",
    "초시계",
    "타이머 온라인",
  ],
  openGraph: {
    title: "타이머 & 스톱워치 - 온라인 타이머, 카운트다운",
    description:
      "온라인 타이머와 스톱워치를 무료로 사용하세요. 카운트다운 타이머, 스톱워치, 랩 타임 기록이 가능합니다.",
  },
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "타이머 & 스톱워치",
            description:
              "온라인 타이머와 스톱워치를 무료로 사용하세요. 카운트다운 타이머, 스톱워치, 랩 타임 기록이 가능합니다.",
            url: "https://vibe-revenue.pages.dev/tools/timer",
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
