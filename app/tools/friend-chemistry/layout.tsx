import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "친구 케미 테스트 - 링크로 비교하는 우정 궁합",
  description: "8가지 선택을 남기고 친구에게 링크를 보내 우정 케미 점수와 서로 다른 취향을 비교하는 무료 친구 테스트입니다.",
  keywords: ["친구 케미 테스트", "우정 테스트", "친구 궁합", "친구 비교 테스트", "친구 도전장"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/friend-chemistry" },
  openGraph: {
    images: [{url:"https://modu-dogu.pages.dev/og/social/friend-chemistry.png",width:1200,height:630,alt:"우리 둘의 취향 교집합"}], title: "우리 우정 케미는 몇 점? | 모두의도구", description: "각자 자신의 취향을 고르고 링크로 비교해보세요.", url: "https://modu-dogu.pages.dev/tools/friend-chemistry" },
  twitter: {card:"summary_large_image",title:"우리 둘의 취향 교집합",images:["https://modu-dogu.pages.dev/og/social/friend-chemistry.png"]},
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
