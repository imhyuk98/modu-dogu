import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퇴직금 계산기 - 근속연수 기반 퇴직금 자동 계산",
  description:
    "입사일, 퇴사일, 최근 3개월 급여를 입력하면 퇴직금을 자동으로 계산합니다. 근로기준법 기준 퇴직금 산정.",
  keywords: ["퇴직금 계산기", "퇴직금 계산", "퇴직금 산정", "근속연수 퇴직금"],
  openGraph: {
    title: "퇴직금 계산기 - 근속연수 기반 퇴직금 자동 계산",
    description: "입사일, 퇴사일, 최근 3개월 급여를 입력하면 퇴직금을 자동으로 계산합니다. 근로기준법 기준 퇴직금 산정.",
  },
};

export default function RetirementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "퇴직금 계산기",
            description:
              "입사일, 퇴사일, 최근 3개월 급여를 입력하면 퇴직금을 자동으로 계산합니다. 근로기준법 기준 퇴직금 산정.",
            url: "https://vibe-revenue.pages.dev/calculators/retirement",
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
