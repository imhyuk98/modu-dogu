import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "날짜 계산기 - D-day 디데이 계산",
  description: "D-day 카운트다운, 두 날짜 사이의 일수 차이를 계산합니다.",
  keywords: ["D-day 계산기", "디데이 계산", "날짜 계산기", "날짜 차이 계산", "디데이 카운터"],
  openGraph: {
    title: "날짜 계산기 - D-day 디데이 계산",
    description: "D-day 카운트다운, 두 날짜 사이의 일수 차이를 계산합니다.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "날짜 계산기",
            description:
              "D-day 카운트다운, 두 날짜 사이의 일수 차이를 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/dday",
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
