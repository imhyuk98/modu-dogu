import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "러닝 페이스 계산기 - 1km 페이스·마라톤 예상 기록",
  description: "거리와 달리기 기록을 입력해 1km 평균 페이스, 속도, 5km·10km·하프·풀코스 예상 기록을 무료로 계산하세요.",
  keywords: ["러닝 페이스 계산기", "달리기 페이스", "마라톤 기록 계산기", "5km 페이스", "10km 예상 기록"],
  alternates: { canonical: "https://modu-dogu.pages.dev/calculators/running-pace" },
  openGraph: {
    images: ["/og-image.png"], title: "러닝 페이스 계산기 | 모두의도구", description: "내 러닝 기록의 평균 페이스와 거리별 예상 기록을 확인하세요.", url: "https://modu-dogu.pages.dev/calculators/running-pace" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
