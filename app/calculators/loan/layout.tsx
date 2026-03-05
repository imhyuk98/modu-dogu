import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대출이자 계산기 - 원리금균등 원금균등 상환 계산",
  description:
    "대출 원금, 이자율, 기간을 입력하면 원리금균등상환과 원금균등상환 방식의 월 상환금과 총 이자를 자동으로 계산합니다.",
  keywords: ["대출이자 계산기", "원리금균등상환", "원금균등상환", "대출 상환 계산", "이자 계산기"],
  openGraph: {
    title: "대출이자 계산기 - 원리금균등 원금균등 상환 계산",
    description: "대출 원금, 이자율, 기간을 입력하면 원리금균등상환과 원금균등상환 방식의 월 상환금과 총 이자를 자동으로 계산합니다.",
  },
};

export default function LoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "대출이자 계산기",
            description:
              "대출 원금, 이자율, 기간을 입력하면 원리금균등상환과 원금균등상환 방식의 월 상환금과 총 이자를 자동으로 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/loan",
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
