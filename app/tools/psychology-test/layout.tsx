import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/psychology-test" },
  title: "심리 성향 테스트 - 성격 유형, 연애 스타일, 스트레스 지수 테스트",
  description:
    "도구가 나의 성격 유형, 연애 스타일, 스트레스 지수를 분석합니다. 간단한 질문에 답하고 심리 성향 테스트 결과를 확인해보세요.",
  keywords: [
    "심리 성향 테스트",
    "심리 성향 테스트",
    "성격 유형 테스트",
    "연애 스타일 테스트",
    "스트레스 테스트",
    "무료 심리테스트",
    "성격 테스트",
    "성격 성향 테스트",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "심리 성향 테스트 - 성격 유형, 연애 스타일, 스트레스 지수 테스트",
    description:
      "도구가 나의 성격 유형, 연애 스타일, 스트레스 지수를 분석합니다.",
    url: "https://modu-dogu.pages.dev/tools/psychology-test",
  },
};

export default function PsychologyTestLayout({
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
            name: "심리 성향 테스트",
            description:
              "도구가 나의 성격 유형, 연애 스타일, 스트레스 지수를 분석합니다.",
            url: "https://modu-dogu.pages.dev/tools/psychology-test",
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
