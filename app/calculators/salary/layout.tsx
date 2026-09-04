import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/salary" },
  title: "연봉 실수령액 계산기 - 2026년 4대보험·소득세 예상 계산",
  description:
    "2026년 7월 이후 기준으로 연봉에서 4대보험과 예상 소득세를 공제한 월 실수령액을 계산합니다. 부양가족과 비과세 항목에 따라 실제 금액은 달라질 수 있습니다.",
  keywords: [
    "연봉 실수령액",
    "연봉 실수령액 계산기",
    "월급 실수령액",
    "4대보험 계산",
    "소득세 계산",
    "2026 연봉 계산기",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "연봉 실수령액 계산기 - 2026년 4대보험·소득세 예상 계산",
    description:
      "연봉에서 4대보험과 소득세를 공제한 월 실수령액을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/salary",
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
              "2026년 7월 이후 기준으로 연봉에서 4대보험과 예상 소득세를 공제한 월 실수령액을 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/salary",
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
