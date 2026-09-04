import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/truth-or-dare" },
  title: "진실 or 도전 - 온라인 진실게임 무료 플레이",
  description:
    "진실 or 도전 게임을 스마트폰으로 바로 즐기세요! 50개 이상의 진실 질문과 도전 미션이 준비되어 있습니다. 앱 설치 없이 무료로 플레이 가능.",
  keywords: [
    "진실 or 도전",
    "진실게임",
    "진실 or 거짓",
    "진실 혹은 도전",
    "술게임",
    "술자리 게임",
    "파티 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "진실 or 도전 - 온라인 진실게임 무료 플레이",
    description:
      "진실 or 도전 게임을 스마트폰으로 바로 즐기세요! 50개 이상의 진실 질문과 도전 미션이 준비되어 있습니다.",
    url: "https://modu-dogu.pages.dev/tools/truth-or-dare",
  },
};

export default function TruthOrDareLayout({
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
            name: "진실 or 도전",
            description:
              "50개 이상의 진실 질문과 도전 미션이 준비된 온라인 진실게임.",
            url: "https://modu-dogu.pages.dev/tools/truth-or-dare",
            applicationCategory: "GameApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
