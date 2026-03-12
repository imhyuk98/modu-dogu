import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "출산 예정일 계산기 - 임신 주수 계산 | 모두의도구",
  description:
    "마지막 생리일로 출산 예정일과 현재 임신 주수를 계산하세요. 주요 검사 일정과 태아 발달 정보를 확인할 수 있습니다.",
  keywords: [
    "출산 예정일 계산기",
    "임신 주수 계산",
    "출산 예정일",
    "임신 계산기",
    "네겔레 공식",
    "마지막 생리일",
    "임신 주수",
    "태아 크기",
  ],
  openGraph: {
    title: "출산 예정일 계산기 - 임신 주수 계산 | 모두의도구",
    description:
      "마지막 생리일로 출산 예정일과 현재 임신 주수를 계산하세요. 주요 검사 일정과 태아 발달 정보를 확인할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/calculators/due-date",
  },
};

export default function DueDateLayout({
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
            name: "출산 예정일 계산기",
            description:
              "마지막 생리일로 출산 예정일과 현재 임신 주수를 계산하세요. 주요 검사 일정과 태아 발달 정보를 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/calculators/due-date",
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
