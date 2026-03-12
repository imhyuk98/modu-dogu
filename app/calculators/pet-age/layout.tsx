import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "강아지 고양이 나이 계산기 - 사람 나이 환산 | 모두의도구",
  description:
    "강아지, 고양이 나이를 사람 나이로 환산하세요. 체구별 정확한 계산과 생애 단계, 건강 체크리스트를 확인할 수 있습니다.",
  keywords: [
    "강아지 나이 계산기",
    "고양이 나이 계산기",
    "반려동물 나이 환산",
    "강아지 사람 나이",
    "고양이 사람 나이",
    "펫 나이 계산",
  ],
  openGraph: {
    title: "강아지 고양이 나이 계산기 - 사람 나이 환산 | 모두의도구",
    description:
      "강아지, 고양이 나이를 사람 나이로 환산하세요. 체구별 정확한 계산과 생애 단계, 건강 체크리스트를 확인할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/calculators/pet-age",
  },
};

export default function PetAgeLayout({
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
            name: "강아지 고양이 나이 계산기",
            description:
              "강아지, 고양이 나이를 사람 나이로 환산하세요. 체구별 정확한 계산과 생애 단계, 건강 체크리스트를 확인할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/calculators/pet-age",
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
