import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "눈치 게임 - 친구와 바로 하는 온라인 숫자 게임",
  description:
    "참가자 수를 정하고 1부터 차례로 외치는 눈치 게임을 설치 없이 바로 시작하세요. 클래식·랜덤 숫자 모드와 참가자·벌칙 기록을 지원합니다.",
  keywords: [
    "눈치게임",
    "눈치 게임",
    "술게임",
    "숫자 게임",
    "파티 게임",
    "술자리 게임",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/nunchi-game",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "눈치 게임 - 친구와 바로 하는 온라인 숫자 게임 | 모두의도구",
    description:
      "클래식·랜덤 숫자 모드와 참가자·벌칙 기록을 지원하는 무료 눈치 게임입니다.",
    url: "https://modu-dogu.pages.dev/tools/nunchi-game",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "눈치 게임",
            description: "친구들과 클래식 또는 랜덤 숫자 모드로 즐기는 온라인 눈치 게임",
            url: "https://modu-dogu.pages.dev/tools/nunchi-game",
            applicationCategory: "GameApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
