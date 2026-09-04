import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/memory-game" },
  title: "기억력 테스트 (카드 뒤집기) - 카드 짝 맞추기 게임",
  description:
    "카드 짝 맞추기 게임으로 기억력을 테스트해보세요. 쉬움, 보통, 어려움 3단계 난이도로 즐길 수 있습니다. 시도 횟수와 소요 시간으로 등급을 확인하세요.",
  keywords: [
    "기억력 테스트",
    "카드 뒤집기 게임",
    "카드 짝 맞추기",
    "기억력 게임",
    "memory game",
    "card matching game",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "기억력 테스트 (카드 뒤집기) - 카드 짝 맞추기 게임",
    description:
      "카드 짝 맞추기 게임으로 기억력을 테스트해보세요. 3단계 난이도로 즐길 수 있습니다.",
    url: "https://modu-dogu.pages.dev/tools/memory-game",
  },
};

export default function MemoryGameLayout({
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
            name: "기억력 테스트 (카드 뒤집기)",
            description:
              "카드 짝 맞추기 게임으로 기억력을 테스트해보세요. 3단계 난이도로 즐길 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/memory-game",
            applicationCategory: "GameApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
