import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/bomb-game" },
  title: "폭탄 돌리기 게임 - 온라인 폭탄돌리기 무료 플레이",
  description:
    "폭탄 돌리기 게임을 스마트폰으로 즐기세요! 랜덤 타이머로 긴장감 넘치는 폭탄돌리기를 앱 설치 없이 무료로 플레이할 수 있습니다. 2명 이상 참여 가능.",
  keywords: [
    "폭탄돌리기",
    "폭탄 돌리기",
    "폭탄 돌리기 게임",
    "폭탄돌리기 게임",
    "술게임",
    "술자리 게임",
    "파티 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "폭탄 돌리기 게임 - 온라인 폭탄돌리기 무료 플레이",
    description:
      "폭탄 돌리기 게임을 스마트폰으로 즐기세요! 랜덤 타이머로 긴장감 넘치는 폭탄돌리기를 무료로 플레이하세요.",
    url: "https://modu-dogu.pages.dev/tools/bomb-game",
  },
};

export default function BombGameLayout({
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
            name: "폭탄 돌리기 게임",
            description:
              "랜덤 타이머로 긴장감 넘치는 폭탄돌리기를 스마트폰으로 즐기세요.",
            url: "https://modu-dogu.pages.dev/tools/bomb-game",
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
