import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/housing-subscription" },
  title: "청약 점수 계산기 - 청약홈 가점 계산 (2026)",
  description:
    "무주택기간, 부양가족수, 청약통장 가입기간을 입력하면 청약 가점표(최대 84점)에 따라 참고 점수를 계산합니다.",
  keywords: ["청약 점수 계산기", "청약 가점", "청약홈", "무주택기간", "부양가족수", "청약통장 가입기간"],
  openGraph: {
    images: ["/og-image.png"],
    title: "청약 점수 계산기 - 청약홈 가점 계산 (2026) | 모두의도구",
    description: "무주택기간, 부양가족수, 청약통장 가입기간을 입력하면 청약 가점(최대 84점)을 자동 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/housing-subscription",
  },
};

export default function HousingSubscriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "청약 점수 계산기",
            description:
              "무주택기간, 부양가족수, 청약통장 가입기간을 입력하면 청약 가점표(최대 84점)에 따라 참고 점수를 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/housing-subscription",
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
