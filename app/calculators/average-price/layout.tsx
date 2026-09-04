import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/average-price" },
  title: "물타기 계산기 - 주식 평균단가 계산",
  description:
    "주식 물타기(추가 매수) 시 평균단가를 자동으로 계산합니다. 여러 차수의 매수가와 수량을 입력하면 평균단가, 총 매수금액, 각 차수별 비중을 확인할 수 있습니다.",
  keywords: [
    "물타기 계산기",
    "평균단가 계산기",
    "주식 물타기",
    "평균매입단가",
    "추가매수 계산",
    "주식 평균단가",
    "물타기 평단가",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "물타기 계산기 - 주식 평균단가 계산",
    description:
      "주식 물타기 시 평균단가, 총 매수금액, 각 차수별 비중을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/average-price",
  },
};

export default function AveragePriceLayout({
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
            name: "물타기 계산기 (평균단가 계산)",
            description:
              "주식 물타기(추가 매수) 시 평균단가를 자동으로 계산합니다. 여러 차수의 매수가와 수량을 입력하면 평균단가, 총 매수금액, 각 차수별 비중을 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/calculators/average-price",
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
