import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/exercise" },
  title: "운동 루틴 추천 - 맞춤 운동 루틴 생성기",
  description:
    "도구가 체형, 목표, 경험 수준에 맞는 맞춤 운동 루틴을 추천합니다. 다이어트, 근력 증가, 체력 향상 등 목표에 최적화된 주간 운동 계획을 무료로 생성하세요.",
  keywords: [
    "운동 루틴 추천",
    "운동 루틴",
    "홈트레이닝",
    "맞춤 운동",
    "운동 계획",
    "다이어트 운동",
    "헬스 루틴",
    "운동 프로그램",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "운동 루틴 추천 - 맞춤 운동 루틴 생성기",
    description:
      "도구가 체형, 목표, 경험 수준에 맞는 맞춤 운동 루틴을 추천합니다.",
    url: "https://modu-dogu.pages.dev/calculators/exercise",
  },
};

export default function ExerciseLayout({
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
            name: "운동 루틴 추천 - 맞춤 운동 루틴 생성기",
            description:
              "도구가 체형, 목표, 경험 수준에 맞는 맞춤 운동 루틴을 추천합니다. 다이어트, 근력 증가, 체력 향상 등 목표에 최적화된 주간 운동 계획을 무료로 생성하세요.",
            url: "https://modu-dogu.pages.dev/calculators/exercise",
            applicationCategory: "HealthApplication",
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
