import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/deposit" },
  title: "예금이자 계산기 - 정기예금 세후 수령액 자동 계산",
  description:
    "정기예금 예치금액, 연이율, 기간을 입력하면 세전이자, 이자소득세, 세후이자, 세후 수령액을 자동으로 계산합니다. 일반과세, 비과세, 세금우대 선택 가능.",
  keywords: [
    "예금이자 계산기",
    "정기예금 이자 계산",
    "예금 세후이자",
    "예금 수령액",
    "이자소득세 계산",
    "비과세 예금",
    "세금우대 예금",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "예금이자 계산기 - 정기예금 세후 수령액 자동 계산",
    description:
      "정기예금 예치금액과 이율을 입력하면 세후 수령액을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/deposit",
  },
};

export default function DepositLayout({
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
            name: "예금이자 계산기",
            description:
              "정기예금 예치금액, 연이율, 기간을 입력하면 세전이자, 이자소득세, 세후이자, 세후 수령액을 자동으로 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/deposit",
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
