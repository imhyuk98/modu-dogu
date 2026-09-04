import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/planet-merge" },
  title: "행성 합치기 - 우주 퍼즐 게임 | 온라인 무료",
  description:
    "행성 합치기 게임을 온라인으로 무료 플레이! 같은 행성을 합쳐 더 큰 행성을 만드세요. 수성부터 태양까지, 중독성 있는 물리 퍼즐 게임입니다.",
  keywords: ["행성 합치기", "우주 퍼즐", "행성 게임", "합치기 게임", "무료 게임", "온라인 퍼즐", "물리 게임"],
  openGraph: {
    images: ["/og-image.png"],
    title: "행성 합치기 - 우주 퍼즐 게임 | 온라인 무료",
    description: "같은 행성을 합쳐 더 큰 행성을 만드세요! 수성부터 태양까지, 중독성 있는 물리 퍼즐 게임.",
    url: "https://modu-dogu.pages.dev/tools/planet-merge",
  },
};

export default function PlanetMergeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "행성 합치기",
            description: "같은 행성을 합쳐 더 큰 행성을 만드는 온라인 물리 퍼즐 게임",
            url: "https://modu-dogu.pages.dev/tools/planet-merge",
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
