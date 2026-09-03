import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "베스킨라빈스 31 게임 온라인",
  description:
    "베스킨라빈스 31 게임을 온라인으로 즐기세요! AI 대전, 2인 대전 모드를 지원합니다. 1~3개씩 숫자를 부르고 31을 말하면 지는 술게임입니다.",
  keywords: [
    "베스킨라빈스 31",
    "베스킨라빈스 게임",
    "31게임",
    "술게임",
    "온라인 술게임",
    "배스킨라빈스 게임",
  ],
  openGraph: {
    title: "베스킨라빈스 31 게임 온라인 - 모두의도구",
    description:
      "베스킨라빈스 31 게임을 온라인으로 즐기세요! AI 대전, 2인 대전 모드를 지원합니다.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
