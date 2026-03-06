import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 워터마크 - 사진에 텍스트 워터마크 추가",
  description: "이미지에 텍스트 워터마크를 추가할 수 있는 무료 온라인 도구입니다. 글꼴 크기, 색상, 투명도, 위치, 대각선 배치, 타일 반복 등 다양한 옵션을 지원합니다. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
  keywords: ["이미지 워터마크", "사진 워터마크", "텍스트 워터마크", "워터마크 추가", "온라인 워터마크", "image watermark", "copyright"],
  openGraph: {
    title: "이미지 워터마크 - 사진에 텍스트 워터마크 추가",
    description: "이미지에 텍스트 워터마크를 추가할 수 있는 무료 온라인 도구입니다. 다양한 옵션을 지원합니다.",
    url: "https://vibe-revenue.pages.dev/tools/image-watermark",
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
            name: "이미지 워터마크",
            description:
              "이미지에 텍스트 워터마크를 추가할 수 있는 무료 온라인 도구입니다. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-watermark",
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
