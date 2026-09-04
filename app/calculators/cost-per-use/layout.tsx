import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1회당 비용 계산기 - Cost Per Use 소비 검증",
  description: "구매 가격, 사용 횟수, 관리비와 중고 판매가를 반영해 1회당 실제 비용을 계산하고 충동구매를 점검하세요.",
  keywords: ["1회당 비용 계산기", "cost per use", "충동구매 테스트", "무지출 챌린지", "소비 계산기"],
  alternates: { canonical: "https://modu-dogu.pages.dev/calculators/cost-per-use" },
  openGraph: {
    images: ["/og-image.png"], title: "이거 사도 될까? 1회당 비용 계산기", description: "가격표를 실제 사용 비용으로 바꿔보세요.", url: "https://modu-dogu.pages.dev/calculators/cost-per-use" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
