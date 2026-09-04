import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/calculators/percent",
    languages: { ko: "/calculators/percent", en: "/en/calculators/percent", "x-default": "/calculators/percent" },
  },
  title: "퍼센트 계산기 - 백분율, 할인율, 증감률 계산",
  description:
    "퍼센트(%) 계산, 할인율, 증감률, 비율 계산을 간편하게 할 수 있는 무료 온라인 퍼센트 계산기입니다.",
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
    title: "퍼센트 계산기 - 백분율, 할인율, 증감률 계산",
    description:
      "퍼센트(%) 계산, 할인율, 증감률, 비율 계산을 간편하게 할 수 있는 무료 온라인 퍼센트 계산기입니다.",
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
              "퍼센트(%) 계산, 할인율, 증감률, 비율 계산을 간편하게 할 수 있는 무료 온라인 퍼센트 계산기입니다.",
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
