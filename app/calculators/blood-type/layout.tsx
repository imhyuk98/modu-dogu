import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/blood-type" },
  title: "아기 혈액형 계산기 - 부모 혈액형으로 자녀 혈액형 확률 계산",
  description:
    "부모의 혈액형(A, B, O, AB)을 입력하면 유전학 기반으로 태어날 아기의 혈액형과 확률을 자동으로 계산합니다. ABO 혈액형 유전 원리를 쉽게 확인하세요.",
  keywords: [
    "아기 혈액형 계산기",
    "혈액형 유전",
    "부모 혈액형",
    "자녀 혈액형 확률",
    "ABO 혈액형",
    "혈액형 궁합",
    "혈액형 조합",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "아기 혈액형 계산기 - 부모 혈액형으로 자녀 혈액형 확률 계산",
    description:
      "부모의 혈액형을 입력하면 유전학 기반으로 태어날 아기의 혈액형과 확률을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/blood-type",
  },
};

export default function BloodTypeLayout({
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
            name: "아기 혈액형 계산기",
            description:
              "부모의 혈액형(A, B, O, AB)을 입력하면 유전학 기반으로 태어날 아기의 혈액형과 확률을 자동으로 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/blood-type",
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
