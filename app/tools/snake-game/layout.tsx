import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스네이크 게임 - 온라인 뱀 게임 무료 플레이",
  description:
    "클래식 스네이크 게임을 온라인으로 무료 플레이! 사과를 먹고 뱀을 성장시키세요. 키보드 방향키와 모바일 터치 컨트롤을 지원합니다.",
  keywords: ["스네이크 게임", "뱀 게임", "snake game", "스네이크", "아케이드 게임", "무료 게임"],
  openGraph: {
    title: "스네이크 게임 - 온라인 뱀 게임 무료 플레이",
    description: "클래식 스네이크 게임! 사과를 먹고 뱀을 성장시키세요. 모바일 터치 지원.",
    url: "https://vibe-revenue.pages.dev/tools/snake-game",
  },
};

export default function SnakeGameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "스네이크 게임",
            description: "사과를 먹고 뱀을 성장시키는 클래식 아케이드 게임",
            url: "https://vibe-revenue.pages.dev/tools/snake-game",
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
