import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/dream-interpretation" },
  title: "AI 꿈 해몽 - 꿈풀이 꿈해석 무료",
  description:
    "AI가 꿈을 해석해드립니다. 꿈 키워드를 입력하면 해몽 결과, 행운 점수, 행운의 숫자, 재물운/연애운/건강운을 알려드립니다. 80가지 이상의 꿈 키워드 데이터베이스로 정확한 꿈풀이를 제공합니다.",
  keywords: [
    "AI 꿈 해몽",
    "꿈 풀이",
    "꿈 해석",
    "꿈 의미",
    "태몽",
    "무료 해몽",
    "꿈풀이",
    "꿈해석",
    "꿈 점",
    "꿈 사전",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 꿈 해몽 - 꿈풀이 꿈해석 무료",
    description:
      "AI가 꿈을 해석해드립니다. 80가지 이상의 꿈 키워드 데이터베이스로 정확한 꿈풀이를 제공합니다.",
    url: "https://modu-dogu.pages.dev/tools/dream-interpretation",
  },
};

export default function DreamInterpretationLayout({
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
            name: "AI 꿈 해몽",
            description:
              "AI가 꿈을 해석해드립니다. 80가지 이상의 꿈 키워드 데이터베이스로 정확한 꿈풀이를 제공합니다.",
            url: "https://modu-dogu.pages.dev/tools/dream-interpretation",
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
