import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown HTML 변환기 - 마크다운을 HTML로 변환",
  description:
    "마크다운(Markdown) 텍스트를 HTML 코드로 변환하고 미리보기할 수 있는 무료 온라인 도구입니다.",
  keywords: [
    "마크다운 변환기",
    "Markdown HTML 변환",
    "마크다운 미리보기",
    "Markdown to HTML",
    "마크다운 에디터",
  ],
  openGraph: {
    title: "Markdown HTML 변환기 - 마크다운을 HTML로 변환",
    description:
      "마크다운(Markdown) 텍스트를 HTML 코드로 변환하고 미리보기할 수 있는 무료 온라인 도구입니다.",
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
            name: "Markdown HTML 변환기",
            description:
              "마크다운(Markdown) 텍스트를 HTML 코드로 변환하고 미리보기할 수 있는 무료 온라인 도구입니다.",
            url: "https://vibe-revenue.pages.dev/tools/markdown-html",
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
