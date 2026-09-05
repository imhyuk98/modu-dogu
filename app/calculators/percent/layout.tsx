import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/calculators/percent",
    languages: { ko: "/calculators/percent", en: "/en/calculators/percent", "x-default": "/calculators/percent" },
  },
  title: "퍼센트 계산기 - 몇 퍼센트·할인율·증감률 계산",
  description:
    "A의 B% 값, A가 B의 몇 퍼센트인지, 할인·인상 가격과 두 값의 증감률을 한 화면에서 계산하는 무료 퍼센트 계산기입니다.",
  keywords: [
    "퍼센트 계산기",
    "% 계산기",
    "할인율 계산",
    "증감률 계산",
    "백분율 계산",
    "퍼센트 구하기",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "퍼센트 계산기 - 몇 퍼센트·할인율·증감률 계산",
    description:
      "기본 퍼센트, 전체 대비 비율, 할인·인상 가격과 증감률을 한 화면에서 계산하세요.",
    url: "https://modu-dogu.pages.dev/calculators/percent",
  },
};

export default function PercentLayout({
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
            name: "퍼센트 계산기",
            description:
              "기본 퍼센트, 전체 대비 비율, 할인·인상 가격과 두 값의 증감률을 계산하는 무료 온라인 계산기입니다.",
            url: "https://modu-dogu.pages.dev/calculators/percent",
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
