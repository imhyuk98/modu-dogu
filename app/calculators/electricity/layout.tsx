import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기요금 계산기 - 가정용 전기요금 계산",
  description:
    "월간 전력 사용량(kWh)으로 가정용 전기요금을 누진제 기준으로 계산할 수 있는 무료 온라인 전기요금 계산기입니다.",
  keywords: [
    "전기요금 계산기",
    "전기세 계산",
    "누진세 계산",
    "전기요금 누진제",
    "한전 전기요금",
    "전력 요금 계산",
  ],
  openGraph: {
    title: "전기요금 계산기 - 가정용 전기요금 계산",
    description:
      "월간 전력 사용량(kWh)으로 가정용 전기요금을 누진제 기준으로 계산할 수 있는 무료 온라인 전기요금 계산기입니다.",
  },
};

export default function ElectricityLayout({
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
            name: "전기요금 계산기",
            description:
              "월간 전력 사용량(kWh)으로 가정용 전기요금을 누진제 기준으로 계산할 수 있는 무료 온라인 전기요금 계산기입니다.",
            url: "https://vibe-revenue.pages.dev/calculators/electricity",
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
