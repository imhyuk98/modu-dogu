import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "적금 이자 계산기 - 단리 복리 이자 계산",
  description: "월 납입금, 이자율, 기간을 입력하면 단리/복리 방식의 적금 만기 수령액과 이자를 자동으로 계산합니다.",
  keywords: ["적금 이자 계산기", "적금 계산기", "복리 계산기", "단리 계산기", "적금 만기 수령액"],
  openGraph: {
    title: "적금 이자 계산기 - 단리 복리 이자 계산",
    description: "월 납입금, 이자율, 기간을 입력하면 단리/복리 방식의 적금 만기 수령액과 이자를 자동으로 계산합니다.",
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
            name: "적금 이자 계산기",
            description:
              "월 납입금, 이자율, 기간을 입력하면 단리/복리 방식의 적금 만기 수령액과 이자를 자동으로 계산합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/savings",
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
