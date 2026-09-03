import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도시가스 요금 계산기 - 난방/취사 가스비 계산",
  description:
    "도시가스 사용량을 입력하면 난방용·취사용 가스요금을 실시간으로 계산합니다. 기본요금, 사용요금, 부가세 포함 총 요금을 확인하세요.",
  keywords: [
    "도시가스 요금 계산기",
    "가스비 계산",
    "난방비 계산기",
    "취사용 가스요금",
    "가스 사용량 요금",
    "도시가스 단가",
  ],
  openGraph: {
    title: "도시가스 요금 계산기 | 모두의도구",
    description:
      "도시가스 사용량을 입력하면 난방용·취사용 가스요금을 실시간으로 계산합니다. 기본요금, 사용요금, 부가세 포함 총 요금을 확인하세요.",
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
              "도시가스 사용량을 입력하면 난방용·취사용 가스요금을 실시간으로 계산합니다. 기본요금, 사용요금, 부가세 포함 총 요금을 확인하세요.",
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
