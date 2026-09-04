import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/vat" },
  title: "부가세 계산기 - 부가가치세 자동 계산 (VAT)",
  description:
    "공급가액에서 부가가치세(VAT 10%)를 계산하거나, 합계금액에서 공급가액과 부가세를 역산합니다. 간이과세자 부가세율 안내 포함.",
  keywords: [
    "부가세 계산기",
    "부가가치세 계산기",
    "VAT 계산기",
    "부가세 역산",
    "공급가액 계산",
    "세금계산서",
    "간이과세자 부가세",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "부가세 계산기 - 부가가치세 자동 계산 (VAT)",
    description:
      "공급가액에서 부가세를 계산하거나, 합계금액에서 공급가액과 부가세를 역산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/vat",
  },
};

export default function VatLayout({
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
            name: "부가세 계산기",
            description:
              "공급가액에서 부가가치세(VAT 10%)를 계산하거나, 합계금액에서 공급가액과 부가세를 역산합니다. 간이과세자 부가세율 안내 포함.",
            url: "https://modu-dogu.pages.dev/calculators/vat",
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
