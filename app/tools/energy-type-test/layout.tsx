import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "에너지 성향 테스트 - 나의 행동·관계 유형 찾기",
  description: "8가지 질문으로 추진 속도와 관계 방식을 알아보는 무료 에너지 성향 테스트. 결과 카드와 고유 링크를 공유해보세요.",
  keywords: ["성향 테스트", "에너지 유형 테스트", "성격 테스트", "심리테스트", "테토 에겐 테스트 대안"],
  alternates: { canonical: "https://modu-dogu.pages.dev/tools/energy-type-test" },
  openGraph: {
    images: ["/og-image.png"], title: "나의 에너지 성향 테스트 | 모두의도구", description: "나는 스파크, 브리즈, 앵커, 그로브 중 어떤 유형일까?", url: "https://modu-dogu.pages.dev/tools/energy-type-test" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
