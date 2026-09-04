import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/random-roulette" },
  title: "랜덤 룰렛 돌리기 - 점심 메뉴, 벌칙 뽑기 온라인 룰렛",
  description:
    "항목을 직접 추가하고 랜덤 룰렛을 돌려보세요! 점심 메뉴 정하기, 벌칙 뽑기, 순서 정하기 등 다양한 결정을 재미있게 할 수 있습니다.",
  keywords: [
    "랜덤 룰렛",
    "룰렛 돌리기",
    "점심 메뉴 룰렛",
    "랜덤 뽑기",
    "온라인 룰렛",
    "벌칙 뽑기",
    "순서 정하기",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "랜덤 룰렛 돌리기 - 점심 메뉴, 벌칙 뽑기 온라인 룰렛",
    description:
      "항목을 직접 추가하고 랜덤 룰렛을 돌려보세요! 다양한 결정을 재미있게 할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/tools/random-roulette",
  },
};

export default function RandomRouletteLayout({
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
            name: "랜덤 룰렛 돌리기",
            description:
              "항목을 직접 추가하고 랜덤 룰렛을 돌려보세요! 점심 메뉴 정하기, 벌칙 뽑기, 순서 정하기 등 다양한 결정을 재미있게 할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/random-roulette",
            applicationCategory: "EntertainmentApplication",
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
