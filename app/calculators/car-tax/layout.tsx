import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차세 계산기 - 배기량별 자동차세 계산",
  description:
    "차량 배기량과 차령에 따른 자동차세(지방세 포함)를 계산할 수 있는 무료 온라인 자동차세 계산기입니다.",
  keywords: [
    "자동차세 계산기",
    "자동차세 계산",
    "배기량 자동차세",
    "차량세금 계산",
    "자동차 세금",
    "지방세 계산",
  ],
  openGraph: {
    title: "자동차세 계산기 - 배기량별 자동차세 계산",
    description:
      "차량 배기량과 차령에 따른 자동차세(지방세 포함)를 계산할 수 있는 무료 온라인 자동차세 계산기입니다.",
  },
};

export default function CarTaxLayout({
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
            name: "자동차세 계산기",
            description:
              "차량 배기량과 차령에 따른 자동차세(지방세 포함)를 계산할 수 있는 무료 온라인 자동차세 계산기입니다.",
            url: "https://vibe-revenue.pages.dev/calculators/car-tax",
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
