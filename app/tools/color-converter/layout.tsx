import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "색상 변환기 - HEX, RGB, HSL 색상 코드 변환",
  description:
    "HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보기할 수 있는 무료 온라인 색상 변환 도구입니다.",
  keywords: [
    "색상 변환기",
    "HEX RGB 변환",
    "색상 코드 변환",
    "color converter",
    "HSL 변환",
    "컬러 피커",
  ],
  openGraph: {
    title: "색상 변환기 - HEX, RGB, HSL 색상 코드 변환",
    description:
      "HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보기할 수 있는 무료 온라인 색상 변환 도구입니다.",
  },
};

export default function ColorConverterLayout({
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
            name: "색상 변환기",
            description:
              "HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보기할 수 있는 무료 온라인 색상 변환 도구입니다.",
            url: "https://vibe-revenue.pages.dev/tools/color-converter",
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
