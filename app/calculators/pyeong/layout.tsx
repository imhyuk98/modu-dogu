import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평수 계산기 - 평을 제곱미터(㎡)로, ㎡를 평으로 변환",
  description:
    "평(坪)을 제곱미터(㎡)로, 제곱미터를 평으로 간편하게 변환할 수 있는 무료 온라인 평수 계산기입니다. 아파트, 오피스텔, 상가 면적 변환에 활용하세요.",
  keywords: [
    "평수 계산기",
    "평 제곱미터 변환",
    "㎡ 평 변환",
    "평수 변환",
    "아파트 평수",
    "면적 계산기",
  ],
  openGraph: {
    title: "평수 계산기 - 평을 제곱미터(㎡)로, ㎡를 평으로 변환",
    description:
      "평(坪)을 제곱미터(㎡)로, 제곱미터를 평으로 간편하게 변환할 수 있는 무료 온라인 평수 계산기입니다.",
  },
};

export default function PyeongLayout({
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
            name: "평수 계산기",
            description:
              "평(坪)을 제곱미터(㎡)로, 제곱미터를 평으로 간편하게 변환할 수 있는 무료 온라인 평수 계산기입니다. 아파트, 오피스텔, 상가 면적 변환에 활용하세요.",
            url: "https://vibe-revenue.pages.dev/calculators/pyeong",
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
