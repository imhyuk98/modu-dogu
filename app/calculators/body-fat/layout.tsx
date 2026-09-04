import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/body-fat" },
  title: "체지방률 계산기",
  description:
    "US Navy 공식으로 체지방률을 계산합니다. 허리둘레, 목둘레로 정확한 체지방 비율을 확인하세요.",
  keywords: ["체지방률 계산기", "체지방 계산", "US Navy 체지방", "체지방률 측정", "바디팻 계산기"],
  openGraph: {
    images: ["/og-image.png"],
    title: "체지방률 계산기 - 모두의도구",
    description: "US Navy 공식으로 체지방률을 계산합니다. 허리둘레, 목둘레로 정확한 체지방 비율을 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/body-fat",
  },
};

export default function BodyFatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "체지방률 계산기",
            description:
              "US Navy 공식으로 체지방률을 계산합니다. 허리둘레, 목둘레로 정확한 체지방 비율을 확인하세요.",
            url: "https://modu-dogu.pages.dev/calculators/body-fat",
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
