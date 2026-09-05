import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/alcohol" },
  title: "음주 측정기 - 혈중 알코올 농도 계산기",
  description: "음주량과 시간을 입력해 예상 혈중알코올농도(BAC)를 참고용으로 계산합니다. 운전 가능 여부를 판단하는 도구가 아닙니다.",
  keywords: ["음주 측정기", "혈중 알코올 농도", "음주 운전 기준", "BAC 계산기", "알코올 분해 시간"],
  openGraph: {
    images: ["/og-image.png"],
    title: "음주 측정기 - 혈중 알코올 농도 계산기",
    description: "음주량과 시간을 입력해 예상 혈중알코올농도(BAC)를 참고용으로 계산합니다. 운전 가능 여부를 판단하는 도구가 아닙니다.",
    url: "https://modu-dogu.pages.dev/calculators/alcohol",
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
            name: "음주 측정기",
            description:
              "음주량과 시간을 입력해 예상 혈중알코올농도(BAC)를 참고용으로 계산합니다. 운전 가능 여부를 판단하는 도구가 아닙니다.",
            url: "https://modu-dogu.pages.dev/calculators/alcohol",
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
