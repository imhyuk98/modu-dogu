import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 색상 추출 - 이미지에서 색상 코드 추출하기",
  description: "이미지를 업로드하고 원하는 위치를 클릭하면 해당 픽셀의 색상을 HEX, RGB, HSL 코드로 추출합니다. 확대 돋보기로 정확한 픽셀을 선택할 수 있으며, 최근 추출한 색상 이력을 저장합니다.",
  keywords: ["이미지 색상 추출", "색상 코드 추출", "color picker", "이미지 컬러 피커", "HEX 코드 추출", "RGB 추출", "스포이드 도구"],
  openGraph: {
    title: "이미지 색상 추출 - 이미지에서 색상 코드 추출하기",
    description: "이미지를 업로드하고 클릭하면 해당 픽셀의 색상을 HEX, RGB, HSL로 추출합니다.",
    url: "https://vibe-revenue.pages.dev/tools/image-color-picker",
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
            name: "이미지 색상 추출기",
            description:
              "이미지를 업로드하고 원하는 위치를 클릭하면 해당 픽셀의 색상을 HEX, RGB, HSL 코드로 추출합니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-color-picker",
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
