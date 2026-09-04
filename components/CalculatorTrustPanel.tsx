"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { calculatorTrustRecords } from "@/lib/calculator-trust";

export default function CalculatorTrustPanel() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean)[1] ?? "";
  const record = calculatorTrustRecords[slug];
  if (!record) return null;

  return (
    <aside className="mt-10 overflow-hidden rounded-2xl border border-[#d8d1c5] bg-[#fffcf7]" aria-labelledby="calculator-trust-title">
      <div className="border-b border-[#d8d1c5] bg-[#f4f0e8] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="calculator-trust-title" className="text-lg font-black text-[#1d1c19]">계산 기준과 검수 정보</h2>
          <span className="rounded-full border border-[#d8d1c5] bg-white px-3 py-1 text-xs font-bold text-[#6d655d]">{record.category} · 참고용</span>
        </div>
      </div>
      <dl className="grid gap-px bg-[#e9e2d9] sm:grid-cols-2">
        <div className="bg-white p-5"><dt className="text-xs font-black text-[#a93d28]">적용 기준일</dt><dd className="mt-1 text-sm font-bold text-gray-900">{record.effectiveDate}</dd></div>
        <div className="bg-white p-5"><dt className="text-xs font-black text-[#a93d28]">최종 검증일</dt><dd className="mt-1 text-sm font-bold text-gray-900">{record.verifiedAt}</dd></div>
        <div className="bg-white p-5 sm:col-span-2"><dt className="text-xs font-black text-[#a93d28]">계산식</dt><dd className="mt-2 text-sm leading-6 text-gray-700">{record.formula}</dd></div>
        <div className="bg-white p-5"><dt className="text-xs font-black text-emerald-700">반영 항목</dt><dd><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">{record.included.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
        <div className="bg-white p-5"><dt className="text-xs font-black text-amber-700">제외·단순화 조건</dt><dd><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">{record.excluded.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
      </dl>
      <div className="border-t border-[#d8d1c5] p-5 sm:p-6">
        <h3 className="text-sm font-black text-gray-900">공식 원문 출처</h3>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">{record.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-bold text-[#8f2f20] underline underline-offset-4">{source.label}</a></li>)}</ul>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">이 결과는 입력값과 공개된 기준을 단순화한 참고용 추정치이며 공식 기관의 결정·고지·진단을 대신하지 않습니다. 중요한 결정 전에는 원문과 담당 기관을 다시 확인하세요.</p>
        <div className="mt-3 text-right"><Link href="/calculation-policy" className="text-xs font-bold text-gray-600 underline underline-offset-4">전체 계산·검수 정책 보기</Link></div>
      </div>
    </aside>
  );
}
