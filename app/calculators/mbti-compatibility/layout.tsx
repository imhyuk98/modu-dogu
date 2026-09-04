import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/mbti-compatibility" },
  title: "MBTI 궁합 테스트 - 나와 상대의 MBTI 궁합 점수 확인",
  description:
    "16가지 MBTI 유형별 궁합 점수와 분석 코멘트를 확인하세요. 천생연분부터 상극까지, 나와 상대의 성격 궁합을 테스트합니다.",
  keywords: [
    "MBTI 궁합",
    "MBTI 궁합 테스트",
    "MBTI 궁합표",
    "MBTI 연애 궁합",
    "MBTI 성격 궁합",
    "MBTI 잘 맞는 유형",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "MBTI 궁합 테스트 - 나와 상대의 MBTI 궁합 점수 확인",
    description:
      "16가지 MBTI 유형별 궁합 점수와 분석 코멘트를 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/mbti-compatibility",
  },
};

export default function MbtiCompatibilityLayout({
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
            name: "MBTI 궁합 테스트",
            description:
              "16가지 MBTI 유형별 궁합 점수와 분석 코멘트를 확인하세요. 천생연분부터 상극까지, 나와 상대의 성격 궁합을 테스트합니다.",
            url: "https://modu-dogu.pages.dev/calculators/mbti-compatibility",
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
