import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "손병호 게임 질문 82개 - 온라인 술자리 게임",
  description:
    "연애·학교·직장 등 6개 카테고리, 82개 질문 카드로 즐기는 무료 손병호 게임입니다. 설치 없이 온라인 술자리 게임을 시작하세요.",
  keywords: [
    "손병호게임",
    "손병호 게임",
    "나는 한적있다",
    "술게임",
    "never have i ever",
    "파티 게임",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/never-have-i-ever",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "손병호 게임 질문 82개 - 온라인 술자리 게임 | 모두의도구",
    description:
      "6개 카테고리, 82개 질문 카드로 즐기는 무료 손병호 게임입니다.",
    url: "https://modu-dogu.pages.dev/tools/never-have-i-ever",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
