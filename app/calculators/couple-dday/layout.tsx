import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/couple-dday" },
  title: "커플 D-day 계산기 - 사귄 날짜로 기념일 자동 계산",
  description:
    "사귄 날짜를 입력하면 함께한 일수, 100일·200일·1주년 등 다가오는 기념일과 남은 일수를 자동으로 계산합니다.",
  keywords: [
    "커플 디데이",
    "커플 D-day 계산기",
    "사귄 날짜 계산",
    "100일 계산",
    "기념일 계산기",
    "연애 기념일",
    "200일 300일 500일",
    "1000일 계산",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "커플 D-day 계산기 - 사귄 날짜로 기념일 자동 계산",
    description:
      "사귄 날짜를 입력하면 함께한 일수와 다가오는 기념일을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/couple-dday",
  },
};

export default function CoupleDdayLayout({
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
            name: "커플 D-day 계산기",
            description:
              "사귄 날짜를 입력하면 함께한 일수, 100일·200일·1주년 등 다가오는 기념일과 남은 일수를 자동으로 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/couple-dday",
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
