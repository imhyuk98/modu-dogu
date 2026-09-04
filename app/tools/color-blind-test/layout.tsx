import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/color-blind-test" },
  title: "색맹 테스트 (색각 검사) - 이시하라 스타일 온라인 검사",
  description:
    "이시하라(Ishihara) 스타일의 색각 검사를 온라인으로 체험해보세요. 10문제로 적록색맹, 청황색맹 여부를 간편하게 확인할 수 있습니다.",
  keywords: [
    "색맹 테스트",
    "색각 검사",
    "색약 테스트",
    "이시하라 테스트",
    "적록색맹",
    "color blind test",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "색맹 테스트 (색각 검사) - 이시하라 스타일 온라인 검사",
    description:
      "이시하라 스타일의 색각 검사를 온라인으로 체험해보세요. 10문제로 색각 이상 여부를 간편하게 확인합니다.",
    url: "https://modu-dogu.pages.dev/tools/color-blind-test",
  },
};

export default function ColorBlindTestLayout({
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
            name: "색맹 테스트 (색각 검사)",
            description:
              "이시하라 스타일의 색각 검사를 온라인으로 체험해보세요. 10문제로 색각 이상 여부를 간편하게 확인합니다.",
            url: "https://modu-dogu.pages.dev/tools/color-blind-test",
            applicationCategory: "HealthApplication",
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
