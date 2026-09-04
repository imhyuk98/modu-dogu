import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/past-life" },
  title: "AI 전생 테스트 - 생년월일로 알아보는 나의 전생 직업",
  description:
    "AI가 생년월일을 분석하여 나의 전생 직업과 시대, 성격, 현생에 미치는 영향을 재미있게 알려주는 무료 전생 테스트입니다.",
  keywords: [
    "AI 전생 테스트",
    "전생 테스트",
    "전생 직업",
    "전생 알아보기",
    "생년월일 전생",
    "나의 전생",
    "무료 전생 테스트",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 전생 테스트 - 생년월일로 알아보는 나의 전생 직업",
    description:
      "AI가 생년월일을 분석하여 나의 전생 직업과 시대, 성격, 현생에 미치는 영향을 재미있게 알려줍니다.",
    url: "https://modu-dogu.pages.dev/calculators/past-life",
  },
};

export default function PastLifeLayout({
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
            name: "AI 전생 테스트",
            description:
              "AI가 생년월일을 분석하여 나의 전생 직업과 시대, 성격, 현생에 미치는 영향을 재미있게 알려주는 무료 전생 테스트입니다.",
            url: "https://modu-dogu.pages.dev/calculators/past-life",
            applicationCategory: "EntertainmentApplication",
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
