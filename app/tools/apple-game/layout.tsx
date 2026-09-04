import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/apple-game" },
  title: "사과 게임 - 숫자 합치기 퍼즐 | 온라인 무료",
  description:
    "사과 게임을 온라인으로 무료 플레이! 숫자의 합이 10이 되도록 사과를 선택해 제거하세요. 드래그로 영역을 선택하는 중독성 있는 숫자 퍼즐 게임입니다.",
  keywords: ["사과 게임", "숫자 퍼즐", "합이 10", "apple game", "무료 게임", "온라인 퍼즐"],
  openGraph: {
    images: ["/og-image.png"],
    title: "사과 게임 - 숫자 합치기 퍼즐 | 온라인 무료",
    description: "숫자의 합이 10이 되도록 사과를 선택해 제거하세요! 드래그로 영역을 선택하는 중독성 있는 퍼즐 게임.",
    url: "https://modu-dogu.pages.dev/tools/apple-game",
  },
};

export default function AppleGameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "사과 게임",
            description: "숫자의 합이 10이 되도록 사과를 선택해 제거하는 온라인 퍼즐 게임",
            url: "https://modu-dogu.pages.dev/tools/apple-game",
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
