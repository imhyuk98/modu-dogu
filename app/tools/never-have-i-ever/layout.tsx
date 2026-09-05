import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "손병호 게임 질문 82개 - 친구·모임 질문 카드",
  description:
    "일반·연애·학교·직장 등 주제별 질문 카드 82개로 즐기는 무료 손병호 게임입니다. 안전한 질문이 기본이며 설치 없이 바로 시작할 수 있습니다.",
  keywords: [
    "손병호게임",
    "손병호 게임",
    "나는 한적있다",
    "술게임",
    "never have i ever",
    "파티 게임",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/never-have-i-ever",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "손병호 게임 질문 82개 - 친구·모임 질문 카드 | 모두의도구",
    description:
      "안전한 질문을 기본으로 제공하는 주제별 손병호 게임 질문 카드 82개입니다.",
    url: "https://modu-dogu.pages.dev/tools/never-have-i-ever",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "손병호 게임 질문 카드",
            description: "친구·모임에서 주제별 질문 카드 82개로 즐기는 손병호 게임",
            url: "https://modu-dogu.pages.dev/tools/never-have-i-ever",
            applicationCategory: "GameApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
