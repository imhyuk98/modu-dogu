import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/year-end-tax" },
  title: "연말정산 계산기 - 예상 환급액·추가납부액 계산 (2026)",
  description:
    "2026년 일반 기준 주요 소득공제와 세액공제를 반영해 연말정산 환급·추가납부액을 간이 계산합니다. 기납부세액을 직접 입력해 비교하세요.",
  keywords: [
    "연말정산 계산기",
    "연말정산 환급",
    "연말정산 추가납부",
    "소득공제",
    "세액공제",
    "2026 연말정산",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "연말정산 계산기 - 예상 환급액·추가납부액 계산 (2026) | 모두의도구",
    description:
      "2026년 기준 연말정산 예상 환급액 또는 추가납부액을 간편하게 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/year-end-tax",
  },
};

export default function YearEndTaxLayout({
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
            name: "연말정산 계산기",
            description:
              "2026년 일반 기준 주요 소득공제와 세액공제를 반영해 연말정산 환급·추가납부액을 간이 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/year-end-tax",
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
