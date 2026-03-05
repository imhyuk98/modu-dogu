import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공학용 계산기 - 삼각함수, 로그, 지수 무료 계산",
  description:
    "sin, cos, tan 삼각함수, log, ln 로그, 거듭제곱, 제곱근, 팩토리얼 등 공학용 계산을 무료로 할 수 있는 온라인 공학 계산기입니다. 각도/라디안 전환, 계산 이력 지원.",
  keywords: [
    "공학용 계산기",
    "공학 계산기",
    "삼각함수 계산기",
    "과학 계산기",
    "온라인 계산기",
    "sin cos tan",
    "로그 계산기",
    "제곱근 계산기",
  ],
  openGraph: {
    title: "공학용 계산기 - 삼각함수, 로그, 지수 무료 계산",
    description:
      "sin, cos, tan 삼각함수, log, ln 로그, 거듭제곱, 제곱근, 팩토리얼 등 공학용 계산을 무료로 할 수 있는 온라인 공학 계산기입니다.",
    url: "https://vibe-revenue.pages.dev/calculators/scientific",
  },
};

export default function ScientificLayout({
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
            name: "공학용 계산기",
            description:
              "삼각함수, 로그, 지수, 팩토리얼 등 공학용 계산을 무료로 제공하는 온라인 계산기",
            url: "https://vibe-revenue.pages.dev/calculators/scientific",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
