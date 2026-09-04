import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/ladder-game" },
  title: "사다리 타기 - 온라인 사다리 게임 (랜덤 결과 뽑기)",
  description:
    "온라인 사다리 타기 게임입니다. 참가자와 결과를 입력하고 사다리를 타보세요. 애니메이션으로 경로를 확인할 수 있습니다. 최대 8명까지 참여 가능합니다.",
  keywords: [
    "사다리 타기",
    "사다리 게임",
    "온라인 사다리",
    "랜덤 뽑기",
    "사다리 타기 게임",
    "무료 사다리",
    "결과 뽑기",
    "랜덤 결정",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "사다리 타기 - 온라인 사다리 게임 (랜덤 결과 뽑기)",
    description:
      "온라인 사다리 타기 게임입니다. 참가자와 결과를 입력하고 사다리를 타보세요.",
    url: "https://modu-dogu.pages.dev/tools/ladder-game",
  },
};

export default function LadderGameLayout({
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
            name: "사다리 타기",
            description:
              "온라인 사다리 타기 게임입니다. 참가자와 결과를 입력하고 사다리를 타보세요. 애니메이션으로 경로를 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/ladder-game",
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
