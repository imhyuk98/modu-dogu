import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 인코더/디코더 - 텍스트 변환 도구",
  description:
    "텍스트를 Base64로 인코딩하거나 Base64 문자열을 원본 텍스트로 디코딩할 수 있는 무료 온라인 도구입니다.",
  keywords: [
    "Base64 인코더",
    "Base64 디코더",
    "Base64 변환",
    "Base64 encode",
    "Base64 decode",
    "온라인 Base64",
  ],
  openGraph: {
    title: "Base64 인코더/디코더 - 텍스트 변환 도구",
    description:
      "텍스트를 Base64로 인코딩하거나 Base64 문자열을 원본 텍스트로 디코딩할 수 있는 무료 온라인 도구입니다.",
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
            name: "Base64 인코더/디코더",
            description:
              "텍스트를 Base64로 인코딩하거나 Base64 문자열을 원본 텍스트로 디코딩할 수 있는 무료 온라인 도구입니다.",
            url: "https://vibe-revenue.pages.dev/tools/base64",
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
