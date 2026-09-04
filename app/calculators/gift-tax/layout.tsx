import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/gift-tax" },
  title: "증여세 계산기 - 증여재산 공제/세율/신고세액공제 자동 계산",
  description:
    "2026년 일반 기준 증여세를 간이 계산합니다. 관계별 공제와 혼인·출산 추가공제, 증여세율을 반영해 예상 납부세액을 확인하세요.",
  keywords: [
    "증여세 계산기",
    "증여세 세율",
    "증여 공제",
    "배우자 증여 공제",
    "직계존속 증여",
    "증여세 신고",
    "2026 증여세",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "증여세 계산기 - 증여재산 공제/세율/신고세액공제 자동 계산",
    description:
      "2026년 일반 기준 관계별 공제와 혼인·출산 추가공제, 증여세율을 반영해 간이 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/gift-tax",
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
              "2026년 일반 기준 증여세를 간이 계산합니다. 관계별 공제, 혼인·출산 추가공제와 신고세액공제를 반영합니다.",
            url: "https://modu-dogu.pages.dev/calculators/gift-tax",
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
