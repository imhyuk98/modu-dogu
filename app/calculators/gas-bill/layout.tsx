import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도시가스 요금 계산기 - 고지서 단가로 가스비 예상",
  description:
    "최근 도시가스 고지서의 사용량, 환산 사용단가와 기본요금으로 다음 가스비를 간이 계산합니다. 지역·공급사별 요금 차이를 직접 반영할 수 있습니다.",
  keywords: [
    "도시가스 요금 계산기",
    "가스비 계산",
    "난방비 계산기",
    "취사용 가스요금",
    "가스 사용량 요금",
    "도시가스 단가",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "도시가스 요금 계산기 | 모두의도구",
    description:
      "최근 고지서의 환산단가와 기본요금으로 다음 도시가스 요금을 간이 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/gas-bill",
  },
  alternates: {
    canonical: "https://modu-dogu.pages.dev/calculators/gas-bill",
  },
};

export default function GasBillLayout({
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
            name: "도시가스 요금 계산기",
            description:
              "최근 고지서의 환산단가와 기본요금으로 다음 도시가스 요금을 간이 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/gas-bill",
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
