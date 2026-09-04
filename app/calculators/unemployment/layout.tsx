import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/unemployment" },
  title: "실업급여 계산기 - 예상 실업급여 자동 계산",
  description: "2026년 7월 이후 기준으로 나이, 근속연수, 평균 월급에 따른 실업급여 일액과 수급 기간을 예상합니다.",
  keywords: ["실업급여 계산기", "실업급여 계산", "고용보험 실업급여", "구직급여 계산"],
  openGraph: {
    images: ["/og-image.png"],
    title: "실업급여 계산기 - 예상 실업급여 자동 계산",
    description: "2026년 7월 이후 기준으로 실업급여 일액과 수급 기간을 예상합니다.",
    url: "https://modu-dogu.pages.dev/calculators/unemployment",
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
            name: "실업급여 계산기",
            description:
              "2026년 7월 이후 기준으로 나이, 근속연수, 평균 월급에 따른 실업급여 일액과 수급 기간을 예상합니다.",
            url: "https://modu-dogu.pages.dev/calculators/unemployment",
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
