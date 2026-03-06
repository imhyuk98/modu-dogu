import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 회전/뒤집기 - 온라인 이미지 회전 도구",
  description: "브라우저에서 이미지를 회전하고 뒤집을 수 있는 무료 온라인 도구입니다. 90도, 180도 회전과 좌우/상하 반전, 자유 각도 회전을 지원하며 서버 업로드 없이 안전하게 처리됩니다.",
  keywords: ["이미지 회전", "사진 회전", "이미지 뒤집기", "사진 반전", "온라인 이미지 편집", "image rotate", "image flip"],
  openGraph: {
    title: "이미지 회전/뒤집기 - 온라인 이미지 회전 도구",
    description: "브라우저에서 이미지를 회전하고 뒤집을 수 있는 무료 온라인 도구입니다. 90도, 180도 회전과 좌우/상하 반전 지원.",
    url: "https://vibe-revenue.pages.dev/tools/image-rotate",
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
            name: "이미지 회전/뒤집기",
            description:
              "브라우저에서 이미지를 회전하고 뒤집을 수 있는 무료 온라인 도구입니다. 90도, 180도 회전과 좌우/상하 반전, 자유 각도 회전을 지원합니다.",
            url: "https://vibe-revenue.pages.dev/tools/image-rotate",
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
