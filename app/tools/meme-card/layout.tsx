import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "밈 카드 만들기 - 감정 영수증·상장·프로필 이미지",
  description: "문구를 입력해 요즘 나 프로필, 감정 영수증, 셀프 상장, 속보 밈을 1:1 또는 9:16 PNG로 만드는 무료 카드 생성기입니다.",
  keywords: ["밈 만들기", "감정 영수증", "상장 만들기", "인스타 스토리 카드", "짤 만들기", "밈 생성기"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/meme-card" },
  openGraph: { title: "내 문구로 밈 카드 만들기", description: "저작권 걱정 없이 1:1·9:16 밈 카드를 만들어보세요.", url: "https://modu-dogu.pages.dev/tools/meme-card" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
