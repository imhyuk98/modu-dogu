import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "군대 전역일 계산기 - 입대일 기준 전역일·복무일수 계산 | 모두의도구",
  description:
    "입대일과 군종을 선택하면 전역일, 남은 복무일수, 복무 진행률을 자동으로 계산합니다. 육군, 해군, 공군, 해병대, 의무경찰, 사회복무요원 복무기간을 지원합니다.",
  keywords: [
    "군대 전역일 계산기",
    "전역일 계산",
    "입대일",
    "복무기간",
    "육군",
    "해군",
    "공군",
    "해병대",
    "D-day",
  ],
  openGraph: {
    title: "군대 전역일 계산기 - 입대일 기준 전역일·복무일수 계산 | 모두의도구",
    description:
      "입대일과 군종을 선택하면 전역일, 남은 복무일수, 복무 진행률을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/military",
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
            name: "군대 전역일 계산기",
            description:
              "입대일과 군종을 선택하면 전역일, 남은 복무일수, 복무 진행률을 자동으로 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/military",
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
