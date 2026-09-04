import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/calculators/name-compatibility",
    languages: { ko: "/calculators/name-compatibility", en: "/en/calculators/name-compatibility", "x-default": "/calculators/name-compatibility" },
  },
  title: "이름 궁합 계산기 - 한글 획수로 보는 이름 궁합 테스트",
  description:
    "한글 획수 기반으로 두 사람의 이름 궁합을 계산합니다. 이름을 입력하면 획수를 분석하여 궁합 퍼센트와 피라미드 계산 과정을 보여줍니다.",
  keywords: [
    "이름 궁합",
    "이름 궁합 테스트",
    "이름 궁합 계산기",
    "한글 획수 궁합",
    "이름 궁합 보기",
    "커플 이름 궁합",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "이름 궁합 계산기 - 한글 획수로 보는 이름 궁합 테스트",
    description:
      "한글 획수 기반으로 두 사람의 이름 궁합을 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/name-compatibility",
  },
};

export default function NameCompatibilityLayout({
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
            name: "이름 궁합 계산기",
            description:
              "한글 획수 기반으로 두 사람의 이름 궁합을 계산합니다. 이름을 입력하면 획수를 분석하여 궁합 퍼센트와 피라미드 계산 과정을 보여줍니다.",
            url: "https://modu-dogu.pages.dev/calculators/name-compatibility",
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
