import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/zodiac" },
  title: "띠 계산기 (12간지) - 출생년도로 나의 띠, 천간, 오행 알아보기",
  description:
    "출생년도를 입력하면 12지지(띠), 천간, 오행, 성격 특성, 궁합을 알려드립니다. 쥐띠부터 돼지띠까지 모든 띠 정보를 확인하세요.",
  keywords: [
    "띠 계산기",
    "12간지",
    "나의 띠",
    "띠 궁합",
    "천간 지지",
    "오행",
    "12지지",
    "띠별 성격",
    "띠별 궁합",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "띠 계산기 (12간지) - 출생년도로 나의 띠, 천간, 오행 알아보기",
    description:
      "출생년도를 입력하면 12지지(띠), 천간, 오행, 성격 특성, 궁합을 알려드립니다.",
    url: "https://modu-dogu.pages.dev/calculators/zodiac",
  },
};

export default function ZodiacLayout({
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
            name: "띠 계산기 (12간지)",
            description:
              "출생년도를 입력하면 12지지(띠), 천간, 오행, 성격 특성, 궁합을 알려드립니다. 쥐띠부터 돼지띠까지 모든 띠 정보를 확인하세요.",
            url: "https://modu-dogu.pages.dev/calculators/zodiac",
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
