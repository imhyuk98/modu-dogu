import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "텔레파시 게임 온라인 - 제시어 62개 무료 플레이",
  description:
    "설치 없이 무료로 즐기는 텔레파시 게임입니다. 친구·커플과 62개 제시어 또는 직접 만든 주제로 같은 답을 맞춰보세요.",
  keywords: [
    "텔레파시게임",
    "텔레파시 게임",
    "술게임",
    "커플 게임",
    "짝꿍 게임",
    "마음 맞추기",
  ],
  alternates: {
    canonical: "https://modu-dogu.pages.dev/tools/telepathy-game",
  },
  openGraph: {
    title: "텔레파시 게임 온라인 - 제시어 62개 무료 플레이 | 모두의도구",
    description:
      "친구·커플과 62개 제시어 또는 직접 만든 주제로 같은 답을 맞춰보세요.",
    url: "https://modu-dogu.pages.dev/tools/telepathy-game",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
