import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/constellation" },
  title: "별자리 계산기 - 생일로 알아보는 나의 별자리와 성격",
  description:
    "생일(월/일)을 입력하면 12별자리를 알려드립니다. 별자리별 성격 특성, 원소, 수호성, 궁합, 행운의 숫자와 색상까지 한눈에 확인하세요.",
  keywords: [
    "별자리 계산기",
    "별자리 찾기",
    "생일 별자리",
    "12별자리",
    "별자리 성격",
    "별자리 궁합",
    "오늘의 별자리",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "별자리 계산기 - 생일로 알아보는 나의 별자리와 성격",
    description:
      "생일을 입력하면 나의 별자리, 성격, 궁합, 행운의 숫자와 색상을 알려드립니다.",
    url: "https://modu-dogu.pages.dev/calculators/constellation",
  },
};

export default function ConstellationLayout({
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
            name: "별자리 계산기",
            description:
              "생일(월/일)을 입력하면 12별자리를 알려드립니다. 별자리별 성격 특성, 원소, 수호성, 궁합, 행운의 숫자와 색상까지 한눈에 확인하세요.",
            url: "https://modu-dogu.pages.dev/calculators/constellation",
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
