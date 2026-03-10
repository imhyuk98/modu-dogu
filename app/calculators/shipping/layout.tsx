import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "택배 배송비 계산기 - 크기·무게별 택배비 비교 | 모두의도구",
  description:
    "택배 크기와 무게를 입력하면 CJ대한통운, 한진택배, 롯데택배, 우체국택배 요금을 한눈에 비교할 수 있습니다. 부피무게 자동 계산, 제주 추가요금 포함.",
  keywords: ["택배비 계산기", "배송비 계산", "택배 요금", "CJ대한통운", "한진택배", "롯데택배", "우체국택배"],
  openGraph: {
    title: "택배 배송비 계산기 - 크기·무게별 택배비 비교 | 모두의도구",
    description: "택배 크기와 무게를 입력하면 CJ대한통운, 한진택배, 롯데택배, 우체국택배 요금을 한눈에 비교할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/calculators/shipping",
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "택배 배송비 계산기",
            description:
              "택배 크기와 무게를 입력하면 CJ대한통운, 한진택배, 롯데택배, 우체국택배 요금을 한눈에 비교할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/calculators/shipping",
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
