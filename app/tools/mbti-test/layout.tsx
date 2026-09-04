import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/mbti-test" },
  title: "MBTI 성격유형 검사 - 20문항으로 알아보는 나의 MBTI",
  description:
    "20개의 질문에 답하고 나의 MBTI 성격유형을 알아보세요. E/I, S/N, T/F, J/P 각 축별 비율과 성격 분석, 궁합 유형까지 한눈에 확인할 수 있습니다.",
  keywords: [
    "MBTI 검사",
    "MBTI 테스트",
    "MBTI 성격유형",
    "무료 MBTI 검사",
    "MBTI 자가진단",
    "성격유형 테스트",
    "16가지 성격유형",
    "MBTI 무료",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "MBTI 성격유형 검사 - 20문항으로 알아보는 나의 MBTI",
    description:
      "20개의 질문에 답하고 나의 MBTI 성격유형을 알아보세요. 각 축별 비율과 성격 분석까지 제공합니다.",
    url: "https://modu-dogu.pages.dev/tools/mbti-test",
  },
};

export default function MbtiTestLayout({
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
            name: "MBTI 성격유형 검사",
            description:
              "20개의 질문에 답하고 나의 MBTI 성격유형을 알아보세요. E/I, S/N, T/F, J/P 각 축별 비율과 성격 분석, 궁합 유형까지 한눈에 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/mbti-test",
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
