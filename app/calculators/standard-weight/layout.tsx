import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "표준체중 계산기 - 계산기나라",
  description:
    "키와 성별로 표준체중을 계산합니다. Broca, BMI, Devine 세 가지 공식으로 비교해보세요.",
  keywords: ["표준체중 계산기", "표준체중", "Broca", "Devine", "적정체중", "이상체중"],
  openGraph: {
    title: "표준체중 계산기 - 계산기나라",
    description: "키와 성별로 표준체중을 계산합니다. Broca, BMI, Devine 세 가지 공식으로 비교해보세요.",
    url: "https://vibe-revenue.pages.dev/calculators/standard-weight",
  },
};

export default function StandardWeightLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "표준체중 계산기",
            description:
              "키와 성별로 표준체중을 계산합니다. Broca, BMI, Devine 세 가지 공식으로 비교해보세요.",
            url: "https://vibe-revenue.pages.dev/calculators/standard-weight",
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
