import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/reaction-test" },
  title: "반응속도 테스트 - 나의 반응 속도를 측정해보세요",
  description:
    "화면이 초록색으로 바뀌면 클릭! 5회 측정으로 평균 반응속도를 확인하고 등급을 받아보세요. 번개급 반응속도에 도전하세요.",
  keywords: [
    "반응속도 테스트",
    "반응속도 측정",
    "반응 속도 게임",
    "클릭 속도 테스트",
    "reaction time test",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "반응속도 테스트 - 나의 반응 속도를 측정해보세요",
    description:
      "화면이 초록색으로 바뀌면 클릭! 5회 측정으로 평균 반응속도를 확인하고 등급을 받아보세요.",
    url: "https://modu-dogu.pages.dev/tools/reaction-test",
  },
};

export default function ReactionTestLayout({
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
            name: "반응속도 테스트",
            description:
              "화면이 초록색으로 바뀌면 클릭! 5회 측정으로 평균 반응속도를 확인하고 등급을 받아보세요.",
            url: "https://modu-dogu.pages.dev/tools/reaction-test",
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
