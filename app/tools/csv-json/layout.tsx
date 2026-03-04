import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV JSON 변환기 - CSV를 JSON으로, JSON을 CSV로 변환",
  description:
    "CSV 데이터를 JSON으로, JSON 데이터를 CSV로 간편하게 변환할 수 있는 무료 온라인 도구입니다.",
  keywords: [
    "CSV JSON 변환",
    "CSV to JSON",
    "JSON to CSV",
    "CSV 변환기",
    "JSON 변환기",
    "데이터 변환",
  ],
  openGraph: {
    title: "CSV JSON 변환기 - CSV를 JSON으로, JSON을 CSV로 변환",
    description:
      "CSV 데이터를 JSON으로, JSON 데이터를 CSV로 간편하게 변환할 수 있는 무료 온라인 도구입니다.",
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
            name: "CSV JSON 변환기",
            description:
              "CSV 데이터를 JSON으로, JSON 데이터를 CSV로 간편하게 변환할 수 있는 무료 온라인 도구입니다.",
            url: "https://vibe-revenue.pages.dev/tools/csv-json",
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
