import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "계산 기준",
  description: "모두의도구 계산기의 기준일, 반올림, 공식 출처, 테스트와 결과 한계를 설명합니다.",
  alternates: { canonical: "/calculation-policy" },
};

export default function CalculationPolicyPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12 text-gray-700">
    <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">CALCULATION POLICY</p>
    <h1 className="mt-2 text-3xl font-black text-gray-950">계산 기준</h1>
    <p className="mt-4 leading-7">계산기는 입력값을 공개된 산식에 대입한 참고 도구입니다. 공식 고지서, 신고 결과, 계약서, 진단을 대신하지 않습니다.</p>
    <div className="mt-8 space-y-6">
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">기준일과 출처</h2><p className="mt-3 leading-7">요율이 바뀌는 계산기는 화면 하단에 적용 기준일과 최종 검증일을 표시합니다. 법률은 국가법령정보센터, 세금은 국세청·위택스, 노동은 고용노동부, 사회보험은 각 공단처럼 담당 기관의 원문을 사용합니다. 링크를 열어 시행일을 다시 확인할 수 있습니다.</p></section>
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">반올림과 입력값</h2><p className="mt-3 leading-7">화면에 표시하는 원화는 계산기 성격에 맞춰 원 단위 반올림·절사 규칙을 적용합니다. 실제 기관은 기준소득월액, 일수, 납부 시점에 따라 다른 절사 순서를 쓸 수 있습니다. 비율·면적·GPA는 내부 계산값을 유지하고 표시 단계에서만 소수 자릿수를 줄입니다.</p></section>
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">자동 테스트</h2><p className="mt-3 leading-7">핵심 계산에는 일반값, 0 또는 최솟값, 상한값, 세율 구간 직전·직후, 월 말·윤년·근속 경계 같은 회귀 테스트를 둡니다. 테스트 통과는 입력하지 않은 개인 조건까지 맞는다는 뜻이 아닙니다.</p></section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h2 className="text-xl font-bold">결과가 다를 때</h2><p className="mt-3 leading-7">화면의 반영·제외 항목을 먼저 확인하고, 실제 문서와 다른 재현 절차를 <Link href="/feedback" className="font-bold underline">오류 제보</Link>에 남겨 주세요. 개인정보, 주민등록번호, 계좌번호, 급여명세서 원본은 올리지 마세요.</p></section>
    </div>
  </main>;
}
