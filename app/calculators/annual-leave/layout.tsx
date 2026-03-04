import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연차 계산기 - 입사일 기준 연차 일수 자동 계산",
  description:
    "입사일을 입력하면 근로기준법에 따라 발생한 연차 휴가 일수를 자동으로 계산합니다.",
  keywords: ["연차 계산기", "연차 일수 계산", "연차 휴가", "연차 발생 기준", "근로기준법 연차"],
};

export default function AnnualLeaveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "연차 계산기",
            description:
              "입사일을 입력하면 근로기준법에 따라 발생한 연차 휴가 일수를 자동으로 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/annual-leave",
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
