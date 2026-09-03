import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "디지털 키캡 피젯 - 키보드 ASMR 클릭 게임",
  description: "화면 속 컬러 키캡을 누르며 소리와 진동을 즐기는 무료 디지털 피젯. 30초 클릭 챌린지와 오늘의 기록을 제공합니다.",
  keywords: ["디지털 피젯", "키캡 게임", "키보드 ASMR", "클릭 게임", "팝잇 게임", "말랑이 게임"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/digital-fidget" },
  openGraph: { title: "디지털 키캡 피젯 | 모두의도구", description: "손끝으로 누르는 작은 휴식, 30초 클릭에도 도전해보세요.", url: "https://modu-dogu.pages.dev/tools/digital-fidget" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
