import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/nickname-generator" },
  title: "AI 닉네임 생성기 - 랜덤 닉네임 만들기 (귀여운/멋진/웃긴/게임용)",
  description:
    "AI가 귀여운, 멋진, 웃긴, 게임용 스타일별 닉네임을 자동으로 생성합니다. 한국어 닉네임과 영어 게임 닉네임을 클릭 한 번으로 만들어 보세요.",
  keywords: [
    "AI 닉네임 생성기",
    "닉네임 생성기",
    "랜덤 닉네임",
    "게임 닉네임",
    "닉네임 추천",
    "닉네임 만들기",
    "AI 닉네임 추천",
    "멋진 닉네임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 닉네임 생성기 - 랜덤 닉네임 만들기 (귀여운/멋진/웃긴/게임용)",
    description:
      "AI가 스타일별 닉네임을 자동으로 생성합니다. 귀여운, 멋진, 웃긴, 게임용 닉네임을 클릭 한 번으로!",
    url: "https://modu-dogu.pages.dev/tools/nickname-generator",
  },
};

export default function NicknameGeneratorLayout({
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
            name: "AI 닉네임 생성기",
            description:
              "AI가 귀여운, 멋진, 웃긴, 게임용 스타일별 닉네임을 자동으로 생성합니다.",
            url: "https://modu-dogu.pages.dev/tools/nickname-generator",
            applicationCategory: "UtilityApplication",
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
