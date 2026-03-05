import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스도쿠 - 온라인 스도쿠 퍼즐 무료 플레이",
  description:
    "스도쿠 퍼즐을 온라인으로 무료 플레이! 쉬움, 보통, 어려움 3단계 난이도를 지원하며 메모, 힌트, 실수 카운트 기능이 있습니다.",
  keywords: ["스도쿠", "sudoku", "스도쿠 온라인", "스도쿠 퍼즐", "숫자 퍼즐", "무료 게임"],
  openGraph: {
    title: "스도쿠 - 온라인 스도쿠 퍼즐 무료 플레이",
    description: "스도쿠 퍼즐을 온라인으로 무료 플레이! 3단계 난이도, 메모, 힌트 기능 지원.",
    url: "https://vibe-revenue.pages.dev/tools/sudoku",
  },
};

export default function SudokuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "스도쿠",
            description: "3단계 난이도의 온라인 스도쿠 퍼즐 게임",
            url: "https://vibe-revenue.pages.dev/tools/sudoku",
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
