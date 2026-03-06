import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기초대사량(BMR) 계산기 - 계산기나라",
  description:
    "나이, 키, 몸무게로 기초대사량을 계산합니다. Mifflin-St Jeor, Harris-Benedict 두 가지 공식을 제공합니다.",
  keywords: ["기초대사량 계산기", "BMR 계산기", "기초대사량", "칼로리 계산", "Mifflin-St Jeor", "Harris-Benedict"],
  openGraph: {
    title: "기초대사량(BMR) 계산기 - 계산기나라",
    description: "나이, 키, 몸무게로 기초대사량을 계산합니다. Mifflin-St Jeor, Harris-Benedict 두 가지 공식을 제공합니다.",
    url: "https://vibe-revenue.pages.dev/calculators/bmr",
  },
};

export default function BMRLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "기초대사량(BMR) 계산기",
            description:
              "나이, 키, 몸무게로 기초대사량을 계산합니다. Mifflin-St Jeor, Harris-Benedict 두 가지 공식을 제공합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/bmr",
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
