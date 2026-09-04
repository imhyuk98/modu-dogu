import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/rent-conversion" },
  title: "전월세 전환 계산기 - 전세 월세 전환율 계산",
  description: "전세 보증금을 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.",
  keywords: ["전월세 전환 계산기", "전세 월세 전환", "전환율 계산", "월세 계산기", "전세 계산기"],
  openGraph: {
    images: ["/og-image.png"],
    title: "전월세 전환 계산기 - 전세 월세 전환율 계산",
    description: "전세 보증금을 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/rent-conversion",
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
            name: "전월세 전환 계산기",
            description:
              "전세 보증금을 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/rent-conversion",
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
