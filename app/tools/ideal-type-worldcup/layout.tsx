import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취향 월드컵 만들기 - 직접 만드는 8강 이상형 월드컵",
  description: "원하는 후보 8개를 직접 입력하고 토너먼트로 최종 취향을 고르는 무료 월드컵 만들기입니다.",
  keywords: ["이상형 월드컵 만들기", "취향 월드컵", "8강 월드컵", "밸런스 게임 만들기", "최애 월드컵"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/ideal-type-worldcup" },
  openGraph: {
    images: ["/og-image.png"], title: "나만의 취향 월드컵 만들기", description: "후보 8개를 적고 진짜 1위를 골라보세요.", url: "https://modu-dogu.pages.dev/tools/ideal-type-worldcup" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
