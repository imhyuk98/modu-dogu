import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/image-game" },
  title: "이미지 게임 - 술자리 질문 카드",
  description:
    "이미지 게임을 온라인으로! '가장 ~할 것 같은 사람은?' 질문 카드를 랜덤으로 제공합니다. 술자리, 친구 모임에서 즐기세요.",
  keywords: [
    "이미지게임",
    "이미지 게임 질문",
    "술자리 게임",
    "술게임 질문",
    "파티 게임",
    "모임 게임",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "이미지 게임 - 술자리 질문 카드 - 모두의도구",
    description:
      "'가장 ~할 것 같은 사람은?' 질문 카드를 랜덤으로 제공합니다.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
