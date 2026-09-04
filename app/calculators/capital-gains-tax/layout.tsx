import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/capital-gains-tax" },
  title: "양도소득세 계산기 - 부동산 양도세/장기보유특별공제 자동 계산",
  description:
    "2026년 일반 기준 부동산 양도소득세를 간이 계산합니다. 1세대 1주택 12억원 비과세, 장기보유특별공제와 기본공제를 반영합니다.",
  keywords: [
    "양도소득세 계산기",
    "부동산 양도세",
    "양도차익 계산",
    "장기보유특별공제",
    "1세대 1주택 비과세",
    "양도세 세율",
    "2026 양도소득세",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "양도소득세 계산기 - 부동산 양도세/장기보유특별공제 자동 계산",
    description:
      "2026년 일반 기준 부동산 양도소득세를 1세대 1주택 비과세와 장기보유특별공제를 반영해 간이 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/capital-gains-tax",
  },
};

export default function CapitalGainsTaxLayout({
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
            name: "양도소득세 계산기",
            description:
              "2026년 일반 기준 부동산 양도소득세를 간이 계산합니다. 1세대 1주택 비과세, 장기보유특별공제와 기본공제를 반영합니다.",
            url: "https://modu-dogu.pages.dev/calculators/capital-gains-tax",
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
