import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/tarot" },
  title: "AI 타로 카드 - 오늘의 타로 운세 무료",
  description:
    "AI 타로 카드로 오늘의 운세를 확인하세요. 메이저 아르카나 22장으로 연애운, 재물운, 직업운을 무료로 점쳐보세요. 오늘의 타로, 연애 타로, 결정 타로까지.",
  keywords: [
    "AI 타로",
    "타로 카드",
    "오늘의 타로",
    "연애 타로",
    "무료 타로",
    "타로 운세",
    "타로 점",
    "타로 카드 해석",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 타로 카드 - 오늘의 타로 운세 무료",
    description:
      "AI 타로 카드로 오늘의 운세를 확인하세요. 메이저 아르카나 22장으로 연애운, 재물운, 직업운을 무료로 점쳐보세요.",
    url: "https://modu-dogu.pages.dev/tools/tarot",
  },
};

export default function TarotLayout({
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
            name: "AI 타로 카드 - 오늘의 타로 운세",
            description:
              "AI 타로 카드로 오늘의 운세를 확인하세요. 메이저 아르카나 22장으로 연애운, 재물운, 직업운을 무료로 점쳐보세요.",
            url: "https://modu-dogu.pages.dev/tools/tarot",
            applicationCategory: "EntertainmentApplication",
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
