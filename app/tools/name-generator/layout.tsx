import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 작명기 - 아기 이름 짓기, 반려동물 이름 추천",
  description:
    "AI 작명기로 아기 이름, 반려동물 이름, 사업체 이름, 게임 캐릭터 이름을 무료로 지어보세요. 한자 뜻풀이와 의미 설명이 포함된 이름 추천 서비스입니다.",
  keywords: [
    "AI 작명",
    "이름 짓기",
    "아기 이름",
    "작명기",
    "이름 추천",
    "반려동물 이름",
    "사업체 이름",
    "게임 캐릭터 이름",
    "한자 이름",
    "작명 사이트",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/name-generator",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 작명기 - 아기 이름 짓기, 반려동물 이름 추천",
    description:
      "AI 작명기로 아기 이름, 반려동물 이름, 사업체 이름, 게임 캐릭터 이름을 무료로 지어보세요.",
    url: "https://modu-dogu.pages.dev/tools/name-generator",
  },
};

export default function NameGeneratorLayout({
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
            name: "AI 작명기",
            description:
              "AI 작명기로 아기 이름, 반려동물 이름, 사업체 이름, 게임 캐릭터 이름을 무료로 지어보세요. 한자 뜻풀이와 의미 설명이 포함된 이름 추천 서비스입니다.",
            url: "https://modu-dogu.pages.dev/tools/name-generator",
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
