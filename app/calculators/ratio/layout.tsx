import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비율 계산기 - 비율, 비례식, 화면 비율 계산",
  description:
    "비율 계산, 비례식 풀기, 화면 해상도 비율 계산을 간편하게 할 수 있는 무료 온라인 비율 계산기입니다.",
  keywords: [
    "비율 계산기",
    "비례식 계산",
    "비율 구하기",
    "화면 비율 계산",
    "종횡비 계산",
    "ratio calculator",
  ],
  openGraph: {
    title: "비율 계산기 - 비율, 비례식, 화면 비율 계산",
    description:
      "비율 계산, 비례식 풀기, 화면 해상도 비율 계산을 간편하게 할 수 있는 무료 온라인 비율 계산기입니다.",
  },
};

export default function RatioLayout({
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
            name: "비율 계산기",
            description:
              "비율 계산, 비례식 풀기, 화면 해상도 비율 계산을 간편하게 할 수 있는 무료 온라인 비율 계산기입니다.",
            url: "https://vibe-revenue.pages.dev/calculators/ratio",
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
