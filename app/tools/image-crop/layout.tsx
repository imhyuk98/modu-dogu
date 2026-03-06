import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 자르기 - 온라인 이미지 크롭 도구",
  description: "브라우저에서 이미지를 자유롭게 자를 수 있는 무료 온라인 도구입니다. 1:1, 16:9, 4:3 등 비율 프리셋을 지원하며, 서버 업로드 없이 안전하게 처리됩니다.",
  keywords: ["이미지 자르기", "이미지 크롭", "사진 자르기", "온라인 이미지 편집", "image crop", "이미지 잘라내기"],
  openGraph: {
    title: "이미지 자르기 - 온라인 이미지 크롭 도구",
    description: "브라우저에서 이미지를 자유롭게 자를 수 있는 무료 온라인 도구입니다. 1:1, 16:9, 4:3 등 비율 프리셋 지원.",
    url: "https://vibe-revenue.pages.dev/tools/image-crop",
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
            name: "이미지 자르기",
            description:
              "브라우저에서 이미지를 자유롭게 자를 수 있는 무료 온라인 도구입니다. 1:1, 16:9, 4:3 등 비율 프리셋을 지원하며, 서버 업로드 없이 안전하게 처리됩니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-crop",
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
