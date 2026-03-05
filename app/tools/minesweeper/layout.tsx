import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "지뢰찾기 - 온라인 지뢰찾기 무료 플레이",
  description:
    "클래식 지뢰찾기 게임을 온라인으로 무료 플레이! 초급(9x9), 중급(16x16), 고급(30x16) 3단계 난이도. 첫 클릭 안전 보장, 깃발 기능 지원.",
  keywords: ["지뢰찾기", "지뢰찾기 온라인", "지뢰찾기 게임", "마인스위퍼", "minesweeper", "무료 게임"],
  openGraph: {
    title: "지뢰찾기 - 온라인 지뢰찾기 무료 플레이",
    description: "클래식 지뢰찾기 게임을 온라인으로 무료 플레이! 3단계 난이도 지원.",
    url: "https://vibe-revenue.pages.dev/tools/minesweeper",
  },
};

export default function MinesweeperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "지뢰찾기",
            description: "3단계 난이도의 클래식 지뢰찾기 게임",
            url: "https://vibe-revenue.pages.dev/tools/minesweeper",
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
