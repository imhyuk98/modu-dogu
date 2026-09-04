import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/lotto-tax" },
  title: "로또 세금 계산기 - 당첨금 실수령액 자동 계산",
  description:
    "로또 당첨금에 대한 소득세와 지방소득세를 계산하고, 세후 실수령액을 확인하세요. 1등부터 3등까지 등수별 예상 수령액을 간편하게 계산합니다.",
  keywords: [
    "로또 세금 계산기",
    "로또 당첨금 세금",
    "로또 실수령액",
    "복권 세금",
    "로또 소득세",
    "당첨금 세금 계산",
    "로또 세후 금액",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "로또 세금 계산기 - 당첨금 실수령액 자동 계산",
    description:
      "로또 당첨금에 대한 소득세와 지방소득세를 계산하고, 세후 실수령액을 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/lotto-tax",
  },
};

export default function LottoTaxLayout({
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
            name: "로또 세금 계산기",
            description:
              "로또 당첨금에 대한 소득세와 지방소득세를 계산하고, 세후 실수령액을 확인하세요. 1등부터 3등까지 등수별 예상 수령액을 간편하게 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/lotto-tax",
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
