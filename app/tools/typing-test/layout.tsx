import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/typing-test" },
  title: "타자 속도 측정기 - 한글 타자 연습, 타이핑 속도 테스트",
  description:
    "한글 타자 속도를 무료로 측정하세요. 다양한 난이도의 한국어 문장으로 분당 타수(타/분), 정확도, 등급을 확인할 수 있습니다.",
  keywords: [
    "타자 속도 측정",
    "타자 연습",
    "타이핑 테스트",
    "한글 타자",
    "타자 속도",
    "분당 타수",
    "타자 등급",
    "타자 속도 측정기",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "타자 속도 측정기 - 한글 타자 연습, 타이핑 속도 테스트",
    description:
      "한글 타자 속도를 무료로 측정하세요. 다양한 난이도의 한국어 문장으로 분당 타수, 정확도, 등급을 확인할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/tools/typing-test",
  },
};

export default function TypingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "타자 속도 측정기",
            description:
              "한글 타자 속도를 무료로 측정하세요. 다양한 난이도의 한국어 문장으로 분당 타수(타/분), 정확도, 등급을 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/typing-test",
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
