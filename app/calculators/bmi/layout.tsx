import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI 계산기 - 체질량지수 비만도 측정",
  description:
    "키와 몸무게를 입력하면 체질량지수(BMI)를 계산하고 저체중, 정상, 과체중, 비만 여부를 확인할 수 있습니다.",
  keywords: ["BMI 계산기", "체질량지수", "비만도 측정", "BMI 계산", "비만 계산기"],
  openGraph: {
    title: "BMI 계산기 - 체질량지수 비만도 측정",
    description: "키와 몸무게를 입력하면 체질량지수(BMI)를 계산하고 저체중, 정상, 과체중, 비만 여부를 확인할 수 있습니다.",
  },
};

export default function BMILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "BMI 계산기",
            description:
              "키와 몸무게를 입력하면 체질량지수(BMI)를 계산하고 저체중, 정상, 과체중, 비만 여부를 확인할 수 있습니다.",
            url: "https://vibe-revenue.pages.dev/calculators/bmi",
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
