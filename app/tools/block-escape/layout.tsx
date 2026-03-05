import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블록 탈출 - 온라인 슬라이딩 블록 퍼즐 무료 플레이",
  description:
    "블록 탈출 퍼즐 게임! 블록을 밀어서 빨간 블록을 출구로 이동시키세요. 다양한 난이도의 레벨을 무료로 즐길 수 있습니다.",
  keywords: ["블록 탈출", "블록 퍼즐", "슬라이딩 퍼즐", "퍼즐 게임", "무료 게임"],
  openGraph: {
    title: "블록 탈출 - 온라인 슬라이딩 블록 퍼즐 무료 플레이",
    description: "블록을 밀어서 빨간 블록을 출구로 이동시키는 퍼즐 게임!",
    url: "https://vibe-revenue.pages.dev/tools/block-escape",
  },
};

export default function BlockEscapeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "블록 탈출",
            description: "블록을 밀어서 빨간 블록을 출구로 이동시키는 슬라이딩 퍼즐 게임",
            url: "https://vibe-revenue.pages.dev/tools/block-escape",
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
