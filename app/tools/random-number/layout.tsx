import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/random-number" },
  title: "랜덤 숫자 생성기 - 로또 번호, 숫자 범위, 여러 개 뽑기",
  description:
    "랜덤 숫자를 생성합니다. 숫자 범위 지정, 여러 개 뽑기(중복 허용/불가), 로또 번호 자동 생성 기능을 제공합니다.",
  keywords: [
    "랜덤 숫자 생성기",
    "로또 번호 생성기",
    "난수 생성기",
    "랜덤 번호",
    "로또 자동 번호",
    "추첨기",
    "무작위 숫자",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "랜덤 숫자 생성기 - 로또 번호, 숫자 범위, 여러 개 뽑기",
    description:
      "랜덤 숫자를 생성합니다. 숫자 범위, 여러 개 뽑기, 로또 번호 자동 생성까지.",
    url: "https://modu-dogu.pages.dev/tools/random-number",
  },
};

export default function RandomNumberLayout({
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
            name: "랜덤 숫자 생성기",
            description:
              "랜덤 숫자를 생성합니다. 숫자 범위 지정, 여러 개 뽑기(중복 허용/불가), 로또 번호 자동 생성 기능을 제공합니다.",
            url: "https://modu-dogu.pages.dev/tools/random-number",
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
