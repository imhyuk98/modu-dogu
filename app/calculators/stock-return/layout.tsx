import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주식 수익률 계산기 - 매수 매도 수수료 세금 포함 순수익 계산",
  description:
    "주식 매수가와 매도가를 입력하면 수수료, 증권거래세를 포함한 순수익과 수익률을 자동으로 계산합니다. 2025년 증권거래세 0.18% 기준.",
  keywords: [
    "주식 수익률 계산기",
    "주식 수익 계산",
    "매도 수익률",
    "증권거래세 계산",
    "주식 수수료 계산",
    "순수익 계산기",
    "주식 세금 계산",
  ],
  openGraph: {
    title: "주식 수익률 계산기 - 매수 매도 수수료 세금 포함 순수익 계산",
    description:
      "주식 매수가와 매도가를 입력하면 수수료, 증권거래세를 포함한 순수익과 수익률을 자동으로 계산합니다.",
  },
};

export default function StockReturnLayout({
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
            name: "주식 수익률 계산기",
            description:
              "주식 매수가와 매도가를 입력하면 수수료, 증권거래세를 포함한 순수익과 수익률을 자동으로 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/stock-return",
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
