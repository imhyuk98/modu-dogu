import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "밸런스 게임 - 계산기나라",
  description:
    "연애, 일상, 직장, 음식 등 다양한 주제의 밸런스 게임! 두 가지 선택지 중 하나를 골라보세요.",
  keywords: [
    "밸런스 게임",
    "밸런스게임",
    "이것저것 게임",
    "선택 게임",
    "연애 밸런스 게임",
    "직장 밸런스 게임",
    "음식 밸런스 게임",
    "극한 선택",
    "파티 게임",
  ],
  openGraph: {
    title: "밸런스 게임 - 계산기나라",
    description:
      "연애, 일상, 직장, 음식 등 다양한 주제의 밸런스 게임! 두 가지 선택지 중 하나를 골라보세요.",
    url: "https://vibe-revenue.pages.dev/tools/balance-game",
  },
};

export default function BalanceGameLayout({
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
            name: "밸런스 게임",
            description:
              "연애, 일상, 직장, 음식 등 다양한 주제의 밸런스 게임! 두 가지 선택지 중 하나를 골라보세요.",
            url: "https://vibe-revenue.pages.dev/tools/balance-game",
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
