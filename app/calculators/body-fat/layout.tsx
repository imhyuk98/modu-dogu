import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/body-fat" },
  title: "체지방률 계산기",
  description:
    "US Navy 둘레 공식으로 체지방률을 추정합니다. 허리둘레와 목둘레를 이용한 참고용 수치를 확인하세요.",
  keywords: ["체지방률 계산기", "체지방 계산", "US Navy 체지방", "체지방률 측정", "바디팻 계산기"],
  openGraph: {
    images: ["/og-image.png"],
    title: "체지방률 계산기 - 모두의도구",
    description: "US Navy 둘레 공식으로 체지방률을 추정합니다. 허리둘레와 목둘레를 이용한 참고용 수치입니다.",
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
              "US Navy 둘레 공식으로 체지방률을 추정합니다. 허리둘레와 목둘레를 이용한 참고용 수치입니다.",
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
