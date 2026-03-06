import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 PDF 변환 - 여러 이미지를 하나의 PDF로 합치기",
  description: "여러 장의 이미지(JPG, PNG, WebP)를 하나의 PDF 파일로 변환하세요. 드래그 앤 드롭으로 이미지 순서를 변경하고, A4/Letter 용지 크기와 여백을 설정할 수 있습니다. 서버 업로드 없이 브라우저에서 안전하게 변환됩니다.",
  keywords: ["이미지 PDF 변환", "이미지 PDF 합치기", "JPG to PDF", "PNG to PDF", "사진 PDF 변환", "이미지 PDF 만들기", "온라인 PDF 변환"],
  openGraph: {
    title: "이미지 PDF 변환 - 여러 이미지를 하나의 PDF로 합치기",
    description: "여러 장의 이미지를 하나의 PDF 파일로 변환하세요. 드래그 앤 드롭, 용지 크기, 여백 설정을 지원합니다.",
    url: "https://vibe-revenue.pages.dev/tools/image-to-pdf",
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
            name: "이미지 PDF 변환기",
            description:
              "여러 장의 이미지(JPG, PNG, WebP)를 하나의 PDF 파일로 변환하세요. 드래그 앤 드롭으로 이미지 순서를 변경하고, A4/Letter 용지 크기와 여백을 설정할 수 있습니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-to-pdf",
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
