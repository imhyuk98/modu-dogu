import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "텔레파시 게임 - 친구·커플 제시어 62개 바로 플레이",
  description:
    "한 기기에서 번갈아 답하거나 초대 링크를 보내 즐기는 무료 텔레파시 게임입니다. 친구·커플과 62개 제시어 또는 직접 만든 주제로 같은 답을 맞춰보세요.",
  keywords: [
    "텔레파시게임",
    "텔레파시 게임",
    "술게임",
    "커플 게임",
    "짝꿍 게임",
    "마음 맞추기",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/telepathy-game",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "텔레파시 게임 - 친구·커플과 바로 플레이 | 모두의도구",
    description:
      "한 기기 또는 초대 링크로 친구·커플과 62개 제시어의 같은 답을 맞춰보세요.",
    url: "https://modu-dogu.pages.dev/tools/telepathy-game",
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
            name: "텔레파시 게임",
            description: "친구·커플과 한 기기 또는 초대 링크로 같은 답을 맞히는 62개 제시어 게임",
            url: "https://modu-dogu.pages.dev/tools/telepathy-game",
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
