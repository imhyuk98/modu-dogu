import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아재개그 생성기 - 계산기나라",
  description:
    "매일 새로운 아재개그! 동물, 음식, 일상, 클래식, 말장난 등 100가지 이상의 아재개그를 즐겨보세요. 친구, 가족과 함께 웃음 가득한 시간을 보내세요.",
  keywords: [
    "아재개그",
    "아재개그 모음",
    "아빠 개그",
    "아재 유머",
    "말장난",
    "넌센스 퀴즈",
    "재미있는 퀴즈",
    "웃긴 개그",
    "dad joke",
    "한국 아재개그",
  ],
  openGraph: {
    title: "아재개그 생성기 - 계산기나라",
    description:
      "매일 새로운 아재개그! 동물, 음식, 일상, 클래식, 말장난 등 100가지 이상의 아재개그를 즐겨보세요.",
    url: "https://vibe-revenue.pages.dev/tools/dad-joke",
  },
};

export default function DadJokeLayout({
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
            name: "아재개그 생성기",
            description:
              "매일 새로운 아재개그! 동물, 음식, 일상, 클래식, 말장난 등 100가지 이상의 아재개그를 즐겨보세요.",
            url: "https://vibe-revenue.pages.dev/tools/dad-joke",
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
