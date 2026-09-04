import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/dream-interpretation" },
  title: "꿈 키워드 풀이 - 꿈풀이 꿈해석 무료",
  description:
    "꿈 키워드를 입력하면 고정된 풀이 데이터와 오락용 점수·숫자를 보여주는 꿈 키워드 찾기입니다. 미래 예측이나 전문 해석이 아닙니다.",
  keywords: [
    "꿈 키워드 풀이",
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
    title: "꿈 키워드 풀이 - 꿈풀이 꿈해석 무료",
    description:
      "80가지 이상의 고정된 꿈 키워드 풀이를 찾습니다. 오락용이며 미래를 예측하지 않습니다.",
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
            name: "꿈 키워드 풀이",
            description:
              "80가지 이상의 고정된 꿈 키워드 풀이를 찾습니다. 오락용이며 미래를 예측하지 않습니다.",
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
