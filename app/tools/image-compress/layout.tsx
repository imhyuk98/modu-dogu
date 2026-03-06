import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 압축 - JPG, PNG, WebP 이미지 용량 줄이기",
  description:
    "JPG, PNG, WebP 이미지를 브라우저에서 무료로 압축합니다. 품질 조절 슬라이더로 원하는 용량으로 줄이고, 서버 업로드 없이 안전하게 처리됩니다.",
  keywords: [
    "이미지 압축",
    "이미지 용량 줄이기",
    "JPG 압축",
    "PNG 압축",
    "WebP 압축",
    "온라인 이미지 압축",
    "image compress",
  ],
  openGraph: {
    title: "이미지 압축 - JPG, PNG, WebP 이미지 용량 줄이기",
    description:
      "JPG, PNG, WebP 이미지를 브라우저에서 무료로 압축합니다. 품질 조절로 원하는 용량으로 줄여보세요.",
    url: "https://vibe-revenue.pages.dev/tools/image-compress",
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
            name: "이미지 압축",
            description:
              "JPG, PNG, WebP 이미지를 브라우저에서 무료로 압축합니다. 품질 조절 슬라이더로 원하는 용량으로 줄이고, 서버 업로드 없이 안전하게 처리됩니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-compress",
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
