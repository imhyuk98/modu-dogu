import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "물 섭취량 계산기 - 계산기나라",
  description:
    "체중과 활동량에 맞는 하루 권장 물 섭취량을 계산합니다. 컵 수, 물병 수로 쉽게 확인하세요.",
  keywords: ["물 섭취량 계산기", "하루 물 섭취량", "권장 물 섭취량", "물 마시기", "수분 섭취"],
  openGraph: {
    title: "물 섭취량 계산기 - 계산기나라",
    description: "체중과 활동량에 맞는 하루 권장 물 섭취량을 계산합니다. 컵 수, 물병 수로 쉽게 확인하세요.",
    url: "https://vibe-revenue.pages.dev/calculators/water-intake",
  },
};

export default function WaterIntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "물 섭취량 계산기",
            description:
              "체중과 활동량에 맞는 하루 권장 물 섭취량을 계산합니다. 컵 수, 물병 수로 쉽게 확인하세요.",
            url: "https://vibe-revenue.pages.dev/calculators/water-intake",
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
