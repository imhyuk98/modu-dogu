import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/daily-fortune" },
  title: "오늘의 띠 운세 - 띠별 무료 운세 (총운/애정/재물/건강/직장)",
  description:
    "도구가 나의 띠(12지)로 오늘의 운세를 분석합니다. 총운, 애정운, 재물운, 건강운, 직장운과 행운의 숫자, 색상, 방위를 매일 무료로 제공합니다.",
  keywords: [
    "띠 운세",
    "오늘의 운세",
    "띠별 운세",
    "무료 운세",
    "오늘의 띠 운세",
    "총운",
    "애정운",
    "재물운",
    "건강운",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "오늘의 띠 운세 - 띠별 무료 운세 (총운/애정/재물/건강/직장)",
    description:
      "도구가 나의 띠(12지)로 오늘의 운세를 분석합니다. 총운, 애정운, 재물운, 건강운, 직장운과 행운 정보를 매일 무료로 제공합니다.",
    url: "https://modu-dogu.pages.dev/calculators/daily-fortune",
  },
};

export default function DailyFortuneLayout({
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
            name: "오늘의 띠 운세",
            description:
              "도구가 나의 띠(12지)로 오늘의 운세를 분석합니다. 총운, 애정운, 재물운, 건강운, 직장운과 행운 정보를 매일 무료로 제공합니다.",
            url: "https://modu-dogu.pages.dev/calculators/daily-fortune",
            applicationCategory: "EntertainmentApplication",
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
