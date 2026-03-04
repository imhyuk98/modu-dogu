import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 포매터 - JSON 정리, 검증, 미니파이",
  description:
    "JSON 데이터를 보기 좋게 정리(포맷)하거나, 유효성을 검증하고, 미니파이(압축)할 수 있는 무료 온라인 도구입니다.",
  keywords: [
    "JSON 포매터",
    "JSON 정리",
    "JSON 검증",
    "JSON 미니파이",
    "JSON beautify",
    "JSON validator",
    "온라인 JSON 도구",
  ],
  openGraph: {
    title: "JSON 포매터 - JSON 정리, 검증, 미니파이",
    description:
      "JSON 데이터를 보기 좋게 정리(포맷)하거나, 유효성을 검증하고, 미니파이(압축)할 수 있는 무료 온라인 도구입니다.",
  },
};

export default function JsonFormatterLayout({
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
            name: "JSON 포매터",
            description:
              "JSON 데이터를 보기 좋게 정리(포맷)하거나, 유효성을 검증하고, 미니파이(압축)할 수 있는 무료 온라인 도구입니다.",
            url: "https://vibe-revenue.pages.dev/tools/json-formatter",
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
