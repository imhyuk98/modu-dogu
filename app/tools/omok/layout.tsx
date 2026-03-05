import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오목 - 온라인 오목 게임 무료 플레이",
  description:
    "오목 게임을 온라인으로 무료 플레이! AI 대전과 2인 대전을 지원합니다. 15x15 바둑판에서 가로, 세로, 대각선으로 5개를 먼저 놓으면 승리!",
  keywords: ["오목", "오목 온라인", "오목 게임", "gomoku", "바둑판 게임", "무료 게임"],
  openGraph: {
    title: "오목 - 온라인 오목 게임 무료 플레이",
    description: "오목 게임을 온라인으로 무료 플레이! AI 대전과 2인 대전을 지원합니다.",
    url: "https://vibe-revenue.pages.dev/tools/omok",
  },
};

export default function OmokLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "오목",
            description: "AI 대전과 2인 대전을 지원하는 온라인 오목 게임",
            url: "https://vibe-revenue.pages.dev/tools/omok",
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
