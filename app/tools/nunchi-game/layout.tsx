import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "눈치 게임 온라인 - 친구들과 무료 숫자 게임",
  description:
    "친구들과 설치 없이 무료로 즐기는 온라인 눈치 게임입니다. 숫자가 겹치면 벌칙! 참가자·벌칙 기록과 랜덤 숫자 모드도 지원합니다.",
  keywords: [
    "눈치게임",
    "눈치 게임",
    "술게임",
    "숫자 게임",
    "파티 게임",
    "술자리 게임",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/nunchi-game",
  },
  openGraph: {
    title: "눈치 게임 온라인 - 친구들과 무료 숫자 게임 | 모두의도구",
    description:
      "숫자가 겹치면 벌칙! 참가자·벌칙 기록을 지원하는 무료 온라인 눈치 게임입니다.",
    url: "https://modu-dogu.pages.dev/tools/nunchi-game",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
