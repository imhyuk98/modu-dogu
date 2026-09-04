import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차 유류비 계산기 - 주유비·연료비 계산",
  description:
    "주행 거리와 연비를 입력하면 휘발유·경유·LPG 유류비를 실시간으로 계산합니다. 유종별 비교와 월간 유류비도 확인하세요.",
  keywords: [
    "유류비 계산기",
    "자동차 유류비",
    "주유비 계산",
    "연료비 계산",
    "기름값 계산",
    "휘발유 비용",
    "경유 비용",
    "LPG 비용",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "자동차 유류비 계산기 | 모두의도구",
    description:
      "주행 거리와 연비를 입력하면 휘발유·경유·LPG 유류비를 실시간으로 계산합니다. 유종별 비교와 월간 유류비도 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/fuel-cost",
  },
  alternates: {
    canonical: "https://modu-dogu.pages.dev/calculators/fuel-cost",
  },
};

export default function FuelCostLayout({
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
            name: "자동차 유류비 계산기",
            description:
              "주행 거리와 연비를 입력하면 휘발유·경유·LPG 유류비를 실시간으로 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/fuel-cost",
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
