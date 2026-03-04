import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 - 2024년 4대보험 소득세 자동 계산",
  description:
    "2024년 기준 연봉에서 4대보험(국민연금, 건강보험, 장기요양보험, 고용보험)과 소득세를 공제한 월 실수령액을 자동으로 계산합니다.",
  keywords: [
    "연봉 실수령액",
    "연봉 실수령액 계산기",
    "월급 실수령액",
    "4대보험 계산",
    "소득세 계산",
    "2024 연봉 계산기",
  ],
  openGraph: {
    title: "연봉 실수령액 계산기 - 2024년 4대보험 소득세 자동 계산",
    description:
      "연봉에서 4대보험과 소득세를 공제한 월 실수령액을 자동으로 계산합니다.",
  },
};

export default function SalaryLayout({
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
            name: "연봉 실수령액 계산기",
            description:
              "2024년 기준 연봉에서 4대보험(국민연금, 건강보험, 장기요양보험, 고용보험)과 소득세를 공제한 월 실수령액을 자동으로 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/salary",
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
