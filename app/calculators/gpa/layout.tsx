import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "학점 계산기 - 대학교 평균 학점(GPA) 계산",
  description:
    "대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산할 수 있는 무료 온라인 학점 계산기입니다.",
  keywords: [
    "학점 계산기",
    "GPA 계산기",
    "평균 학점 계산",
    "대학 학점 계산",
    "4.5 학점 계산",
    "평점 계산기",
  ],
  openGraph: {
    title: "학점 계산기 - 대학교 평균 학점(GPA) 계산",
    description:
      "대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산할 수 있는 무료 온라인 학점 계산기입니다.",
  },
};

export default function GpaLayout({
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
            name: "학점 계산기",
            description:
              "대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산할 수 있는 무료 온라인 학점 계산기입니다.",
            url: "https://vibe-revenue.pages.dev/calculators/gpa",
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
