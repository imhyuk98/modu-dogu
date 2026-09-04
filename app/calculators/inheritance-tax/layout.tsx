import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/inheritance-tax" },
  title: "상속세 계산기 - 상속재산 공제/세율/신고세액공제 자동 계산",
  description:
    "2026년 일반 기준 상속세를 간이 계산합니다. 기초공제, 인적공제, 배우자공제와 일괄공제를 반영해 예상 세액을 확인하세요.",
  keywords: [
    "상속세 계산기",
    "상속세 세율",
    "상속 공제",
    "배우자 상속 공제",
    "기초공제",
    "일괄공제",
    "상속세 신고",
    "2026 상속세",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "상속세 계산기 - 상속재산 공제/세율/신고세액공제 자동 계산",
    description:
      "2026년 일반 기준 기초공제, 인적공제와 배우자공제를 반영해 상속세를 간이 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/inheritance-tax",
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
              "2026년 일반 기준 상속세를 간이 계산합니다. 기초공제, 인적공제, 배우자공제와 일괄공제를 반영합니다.",
            url: "https://modu-dogu.pages.dev/calculators/inheritance-tax",
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
