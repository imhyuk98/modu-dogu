import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "시급 월급 변환기 - 시급↔월급↔연봉 환산 | 모두의도구",
  description:
    "2026년 최저시급 10,030원 기준, 시급을 월급·연봉으로, 월급을 시급으로 간편하게 환산합니다. 주휴수당 포함 여부와 주 근무시간을 설정하여 정확한 급여를 계산하세요.",
  keywords: [
    "시급 월급 변환",
    "시급 계산기",
    "월급 시급 환산",
    "최저시급",
    "연봉 시급",
    "2026 최저임금",
    "주휴수당 계산",
    "시급 연봉 변환",
  ],
  openGraph: {
    title: "시급 월급 변환기 - 시급↔월급↔연봉 환산 | 모두의도구",
    description:
      "시급을 월급·연봉으로, 월급을 시급으로 간편하게 환산합니다. 주휴수당 포함 여부 설정 가능.",
    url: "https://modu-dogu.pages.dev/calculators/hourly-wage",
  },
};

export default function HourlyWageLayout({
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
            name: "시급 월급 변환기",
            description:
              "2026년 최저시급 10,030원 기준, 시급↔월급↔연봉을 간편하게 환산합니다. 주휴수당 포함 여부와 주 근무시간을 설정하여 정확한 급여를 계산하세요.",
            url: "https://modu-dogu.pages.dev/calculators/hourly-wage",
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
