import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 변환기 - PNG, JPG, WebP 이미지 포맷 변환",
  description: "PNG, JPG, WebP, GIF 등 이미지 파일 포맷을 브라우저에서 무료로 변환할 수 있는 온라인 이미지 변환기입니다. 서버 업로드 없이 안전하게 변환됩니다.",
  keywords: ["이미지 변환기", "PNG JPG 변환", "WebP 변환", "이미지 포맷 변환", "온라인 이미지 변환", "image converter"],
  openGraph: {
    title: "이미지 변환기 - PNG, JPG, WebP 이미지 포맷 변환",
    description: "PNG, JPG, WebP, GIF 등 이미지 파일 포맷을 브라우저에서 무료로 변환할 수 있는 온라인 이미지 변환기입니다.",
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
            name: "이미지 변환기",
            description:
              "PNG, JPG, WebP, GIF 등 이미지 파일 포맷을 브라우저에서 무료로 변환할 수 있는 온라인 이미지 변환기입니다. 서버 업로드 없이 안전하게 변환됩니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-converter",
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
