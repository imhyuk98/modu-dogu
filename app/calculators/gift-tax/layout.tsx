import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증여세 계산기 - 증여재산 공제/세율/신고세액공제 자동 계산",
  description:
    "2025년 기준 증여세를 자동으로 계산합니다. 배우자, 직계존속, 직계비속 등 관계별 공제액과 증여세율을 적용하여 최종 납부세액을 확인하세요.",
  keywords: [
    "증여세 계산기",
    "증여세 세율",
    "증여 공제",
    "배우자 증여 공제",
    "직계존속 증여",
    "증여세 신고",
    "2025 증여세",
  ],
  openGraph: {
    title: "증여세 계산기 - 증여재산 공제/세율/신고세액공제 자동 계산",
    description:
      "2025년 기준 관계별 공제액과 증여세율을 적용하여 증여세를 자동으로 계산합니다.",
  },
};

export default function GiftTaxLayout({
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
            name: "증여세 계산기",
            description:
              "2025년 기준 증여세를 자동으로 계산합니다. 관계별 공제액과 증여세율, 신고세액공제를 적용합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/gift-tax",
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
