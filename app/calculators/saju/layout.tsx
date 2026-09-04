import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "간단 오행 성향 테스트 - 생년월일 규칙 테스트",
  description: "생년월일과 선택한 출생시간을 공개된 고정 규칙에 대입하는 오락용 오행 성향 테스트입니다. 정통 사주·운세 감정이 아닙니다.",
  keywords: ["오행 성향 테스트", "생년월일 테스트", "간단 오행", "사주 대신 성향 테스트"],
  alternates: { canonical: "/calculators/saju" },
  openGraph: { title: "간단 오행 성향 테스트 | 모두의도구", description: "정통 사주가 아닌, 계산 규칙을 공개한 오락용 오행 성향 테스트", url: "https://modu-dogu.pages.dev/calculators/saju", images: ["/og-image.png"] },
};

export default function SajuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
