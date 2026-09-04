import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/updown-game" },
  title: "업다운 게임 - 온라인 숫자 맞추기 무료 플레이",
  description:
    "업다운 게임을 스마트폰으로 바로 즐기세요! 1~100 사이 숫자를 맞추는 스릴 넘치는 게임입니다. 앱 설치 없이 무료로 플레이 가능. 숫자를 맞추는 사람이 벌칙!",
  keywords: [
    "업다운 게임",
    "업다운",
    "숫자 맞추기",
    "숫자 맞추기 게임",
    "술게임",
    "술자리 게임",
    "파티 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "업다운 게임 - 온라인 숫자 맞추기 무료 플레이",
    description:
      "업다운 게임을 스마트폰으로 바로 즐기세요! 1~100 사이 숫자를 맞추는 스릴 넘치는 게임입니다.",
    url: "https://modu-dogu.pages.dev/tools/updown-game",
  },
};

export default function UpdownGameLayout({
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
            name: "업다운 게임",
            description:
              "1~100 사이 숫자를 맞추는 스릴 넘치는 업다운 게임을 스마트폰으로 즐기세요.",
            url: "https://modu-dogu.pages.dev/tools/updown-game",
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
