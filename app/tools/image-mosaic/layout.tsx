import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 모자이크 - 사진 모자이크 & 블러 처리 도구",
  description: "이미지에 모자이크 또는 블러 효과를 적용할 수 있는 무료 온라인 도구입니다. 얼굴, 개인정보 등 민감한 부분을 드래그하여 간편하게 모자이크 처리하세요. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
  keywords: ["이미지 모자이크", "사진 모자이크", "블러 처리", "얼굴 모자이크", "개인정보 보호", "온라인 모자이크", "image mosaic", "image blur"],
  openGraph: {
    title: "이미지 모자이크 - 사진 모자이크 & 블러 처리 도구",
    description: "이미지에 모자이크 또는 블러 효과를 적용할 수 있는 무료 온라인 도구입니다. 드래그하여 간편하게 모자이크 처리하세요.",
    url: "https://vibe-revenue.pages.dev/tools/image-mosaic",
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
            name: "이미지 모자이크",
            description:
              "이미지에 모자이크 또는 블러 효과를 적용할 수 있는 무료 온라인 도구입니다. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-mosaic",
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
