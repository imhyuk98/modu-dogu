import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/liar-game" },
  title: "라이어 게임 - 온라인 라이어게임 무료 플레이",
  description:
    "스마트폰으로 바로 즐기는 온라인 라이어 게임! 3~10명이 함께 할 수 있는 라이어 게임을 앱 설치 없이 무료로 플레이하세요. 음식, 동물, 직업, 장소, 영화 카테고리 지원.",
  keywords: [
    "라이어 게임",
    "라이어게임",
    "라이어게임 온라인",
    "라이어 게임 온라인",
    "술게임",
    "술자리 게임",
    "회식 게임",
    "파티 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "라이어 게임 - 온라인 라이어게임 무료 플레이",
    description:
      "스마트폰으로 바로 즐기는 온라인 라이어 게임! 3~10명이 함께 할 수 있는 라이어 게임을 앱 설치 없이 무료로 플레이하세요.",
    url: "https://modu-dogu.pages.dev/tools/liar-game",
  },
};

export default function LiarGameLayout({
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
            name: "라이어 게임",
            description:
              "스마트폰으로 바로 즐기는 온라인 라이어 게임! 3~10명이 함께 플레이하세요.",
            url: "https://modu-dogu.pages.dev/tools/liar-game",
            applicationCategory: "GameApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
