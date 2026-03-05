import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상속세 계산기 - 상속재산 공제/세율/신고세액공제 자동 계산",
  description:
    "2025년 기준 상속세를 자동으로 계산합니다. 기초공제, 인적공제, 배우자공제, 일괄공제를 적용하여 상속세와 신고세액공제를 확인하세요.",
  keywords: [
    "상속세 계산기",
    "상속세 세율",
    "상속 공제",
    "배우자 상속 공제",
    "기초공제",
    "일괄공제",
    "상속세 신고",
    "2025 상속세",
  ],
  openGraph: {
    title: "상속세 계산기 - 상속재산 공제/세율/신고세액공제 자동 계산",
    description:
      "2025년 기준 기초공제, 인적공제, 배우자공제를 적용하여 상속세를 자동으로 계산합니다.",
  },
};

export default function InheritanceTaxLayout({
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
            name: "상속세 계산기",
            description:
              "2025년 기준 상속세를 자동으로 계산합니다. 기초공제, 인적공제, 배우자공제, 일괄공제를 적용합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/inheritance-tax",
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
