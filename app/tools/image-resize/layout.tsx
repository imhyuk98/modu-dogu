import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/tools/image-resize",
    languages: { ko: "/tools/image-resize", en: "/en/tools/image-resize", "x-default": "/tools/image-resize" },
  },
  title: "이미지 크기 조절 - 온라인 이미지 리사이즈",
  description:
    "이미지 크기를 원하는 사이즈로 조절할 수 있는 무료 온라인 도구입니다. 가로세로 비율 유지, 프리셋 사이즈 지원. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
  keywords: [
    "이미지 크기 조절",
    "이미지 리사이즈",
    "사진 크기 줄이기",
    "이미지 사이즈 변경",
    "온라인 이미지 리사이저",
    "image resize",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "이미지 크기 조절 - 온라인 이미지 리사이즈",
    description:
      "이미지 크기를 원하는 사이즈로 조절할 수 있는 무료 온라인 도구입니다. 비율 유지, 프리셋 사이즈를 지원합니다.",
    url: "https://modu-dogu.pages.dev/tools/image-resize",
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
            name: "이미지 크기 조절",
            description:
              "이미지 크기를 원하는 사이즈로 조절할 수 있는 무료 온라인 도구입니다. 가로세로 비율 유지, 프리셋 사이즈 지원. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.",
            url: "https://modu-dogu.pages.dev/tools/image-resize",
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
