import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "초성 퀴즈 게임 온라인",
  description:
    "초성 퀴즈를 온라인으로 즐기세요! 랜덤 초성이 주어지면 해당하는 단어를 맞추는 게임입니다. 술자리, 모임에서 활용하세요.",
  keywords: [
    "초성퀴즈",
    "초성 퀴즈 온라인",
    "초성게임",
    "훈민정음 게임",
    "술게임",
    "단어 맞추기",
  ],
  openGraph: {
    title: "초성 퀴즈 게임 온라인 - 모두의도구",
    description:
      "랜덤 초성이 주어지면 해당하는 단어를 맞추는 게임! 술자리, 모임에서 활용하세요.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
