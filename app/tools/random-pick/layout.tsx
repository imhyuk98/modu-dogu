import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/random-pick" },
  title: "랜덤 지목 - 온라인 랜덤 뽑기 무료 플레이",
  description:
    "랜덤 지목 게임으로 술자리를 더 재미있게! 참가자 이름을 입력하면 룰렛처럼 돌아가며 한 명이 선택됩니다. 랜덤 미션까지 자동으로 부여. 앱 설치 없이 무료 플레이.",
  keywords: [
    "랜덤 지목",
    "랜덤 뽑기",
    "랜덤 선택",
    "사람 뽑기",
    "술게임",
    "술자리 게임",
    "파티 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "랜덤 지목 - 온라인 랜덤 뽑기 무료 플레이",
    description:
      "랜덤 지목 게임으로 술자리를 더 재미있게! 참가자 중 한 명을 랜덤으로 선택하고 미션을 부여하세요.",
    url: "https://modu-dogu.pages.dev/tools/random-pick",
  },
};

export default function RandomPickLayout({
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
            name: "랜덤 지목",
            description:
              "참가자 중 한 명을 랜덤으로 선택하고 미션을 부여하는 술자리 게임.",
            url: "https://modu-dogu.pages.dev/tools/random-pick",
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
