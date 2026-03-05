import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2048 게임 - 온라인 2048 무료 플레이",
  description:
    "2048 게임을 온라인으로 무료 플레이! 같은 숫자 타일을 합쳐 2048을 만드세요. 키보드 방향키와 스와이프를 지원하며 최고 점수를 저장합니다.",
  keywords: ["2048", "2048 게임", "2048 온라인", "숫자 퍼즐", "퍼즐 게임", "무료 게임"],
  openGraph: {
    title: "2048 게임 - 온라인 2048 무료 플레이",
    description: "같은 숫자 타일을 합쳐 2048을 만드세요! 키보드와 스와이프를 지원합니다.",
    url: "https://vibe-revenue.pages.dev/tools/game-2048",
  },
};

export default function Game2048Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "2048 게임",
            description: "같은 숫자 타일을 합쳐 2048을 만드는 온라인 퍼즐 게임",
            url: "https://vibe-revenue.pages.dev/tools/game-2048",
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
