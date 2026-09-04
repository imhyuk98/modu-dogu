import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "제작·검수 정책",
  description: "모두의도구가 계산기와 콘텐츠를 제작하고 공식 출처, 경계값 테스트, 변경 이력으로 검수하는 방법입니다.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12 text-gray-700">
    <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">EDITORIAL POLICY</p>
    <h1 className="mt-2 text-3xl font-black text-gray-950">제작·검수 정책</h1>
    <p className="mt-4 leading-7">모두의도구는 공개 저장소에서 운영하는 독립 도구 프로젝트입니다. 사용자가 가입이나 설치 없이 반복 업무를 줄이고, 계산 결과가 어디에서 왔는지 직접 확인할 수 있도록 만드는 것이 목적입니다.</p>
    <div className="mt-8 space-y-6">
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">누가 만들고 관리하나요?</h2><p className="mt-3 leading-7">저장소 운영자 <a href="https://github.com/imhyuk98" target="_blank" rel="noreferrer" className="font-bold underline">imhyuk98</a>가 코드와 콘텐츠를 관리합니다. 정부기관·금융기관·의료기관이 운영하거나 보증하는 서비스가 아닙니다.</p></section>
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">어떻게 검수하나요?</h2><ol className="mt-3 list-decimal space-y-2 pl-5 leading-7"><li>세율·보험료·노동 기준은 법령과 담당 정부기관 원문을 먼저 확인합니다.</li><li>기준일, 반영 항목, 제외 조건을 계산기 화면에 공개합니다.</li><li>정상값뿐 아니라 최솟값·최댓값·구간 경계·날짜 경계를 자동 테스트합니다.</li><li>빌드 후 내부 링크, 메타데이터, 구조화 데이터와 모바일 상호작용을 검사합니다.</li><li>오류 수정이나 기준 변경은 <Link href="/changelog" className="font-bold underline">변경 이력</Link>에 기록합니다.</li></ol></section>
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">콘텐츠 원칙</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7"><li>규칙표나 고정 데이터로 만든 결과를 인공지능이라고 부르지 않습니다.</li><li>공식기관 자료와 독립 프로젝트의 설명을 명확히 구분합니다.</li><li>전문가 판단이 필요한 세무·노무·의료 결과는 참고용 한계를 표시합니다.</li><li>검색어를 겨냥한 중복 페이지나 확인할 수 없는 최상급 표현을 만들지 않습니다.</li></ul></section>
    </div>
  </main>;
}
