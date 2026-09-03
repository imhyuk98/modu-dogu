import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퍼스널 스타일 테스트 - 취향으로 찾는 패션 무드",
  description: "사진 없이 6가지 취향 질문으로 나의 패션 무드, 추천 색상과 코디 팁을 찾는 무료 퍼스널 스타일 테스트입니다.",
  keywords: ["퍼스널 스타일 테스트", "패션 취향 테스트", "스타일 유형", "코디 테스트", "퍼스널 컬러 대안"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/personal-style-test" },
  openGraph: { title: "나의 퍼스널 스타일은? | 모두의도구", description: "클린, 소프트, 비비드, 내추럴 중 나의 스타일 무드를 찾아보세요.", url: "https://modu-dogu.pages.dev/tools/personal-style-test" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
