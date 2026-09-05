"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import {
  calculateAnnualLeave,
  type AnnualLeaveBasis,
  type AnnualLeaveMode,
} from "@/lib/calculations";

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export default function AnnualLeaveCalculator() {
  const [mode, setMode] = useState<AnnualLeaveMode>("employed");
  const [basis, setBasis] = useState<AnnualLeaveBasis>("hire-date");
  const [startDate, setStartDate] = useState("2023-09-04");
  const [referenceDate, setReferenceDate] = useState(today);
  const [usedLeave, setUsedLeave] = useState("0");
  const [attendanceAtLeast80, setAttendanceAtLeast80] = useState(true);
  const [perfectAttendanceMonths, setPerfectAttendanceMonths] = useState("11");

  const result = useMemo(() => calculateAnnualLeave({
    startDate,
    referenceDate,
    basis,
    mode,
    usedLeave: Number(usedLeave) || 0,
    attendanceAtLeast80,
    perfectAttendanceMonths: Number(perfectAttendanceMonths) || 0,
  }), [attendanceAtLeast80, basis, mode, perfectAttendanceMonths, referenceDate, startDate, usedLeave]);

  const hasValidRange = Boolean(startDate && referenceDate && referenceDate >= startDate);

  return (
    <div className="py-6">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">근로기준법 제60조 기준</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">연차 계산기</h1>
        <p className="mt-2 max-w-2xl text-gray-600">재직 중 사용 가능 연차와 퇴사 정산 검토분을 입사일·회계연도 기준으로 나누어 확인합니다.</p>
      </header>

      <section className="calc-card mb-6 space-y-6 p-5 sm:p-6" aria-labelledby="annual-leave-input-title">
        <h2 id="annual-leave-input-title" className="text-lg font-bold text-gray-900">1. 계산 조건</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-sm font-bold text-gray-700">계산 유형</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["employed", "separation"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setMode(value)} aria-pressed={mode === value} className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${mode === value ? "border-[#a93d28] bg-[#fff0e9] text-[#8f2f20]" : "border-gray-200 bg-white text-gray-600"}`}>
                  {value === "employed" ? "재직 중" : "퇴사 정산"}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-bold text-gray-700">부여 기준</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["hire-date", "fiscal-year"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setBasis(value)} aria-pressed={basis === value} className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${basis === value ? "border-[#a93d28] bg-[#fff0e9] text-[#8f2f20]" : "border-gray-200 bg-white text-gray-600"}`}>
                  {value === "hire-date" ? "입사일 기준" : "회계연도(1월 1일)"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-gray-700">입사일
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="calc-input mt-2" />
          </label>
          <label className="text-sm font-bold text-gray-700">{mode === "employed" ? "계산 기준일" : "마지막 근무일(퇴직일)"}
            <input type="date" value={referenceDate} onChange={(event) => setReferenceDate(event.target.value)} className="calc-input mt-2" />
          </label>
          <label className="text-sm font-bold text-gray-700">현재 사용기간에 사용한 연차
            <span className="relative mt-2 block"><input type="number" min="0" max="40" step="0.5" value={usedLeave} onChange={(event) => setUsedLeave(event.target.value)} className="calc-input pr-12" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">일</span></span>
          </label>
          <label className="text-sm font-bold text-gray-700">직전 산정기간 출근 조건
            <select value={attendanceAtLeast80 ? "eligible" : "monthly"} onChange={(event) => setAttendanceAtLeast80(event.target.value === "eligible")} className="calc-input mt-2 bg-white">
              <option value="eligible">출근율 80% 이상</option>
              <option value="monthly">80% 미만 · 개근한 달로 계산</option>
            </select>
          </label>
        </div>

        {!attendanceAtLeast80 && (
          <label className="block text-sm font-bold text-gray-700">산정기간 중 개근한 달
            <span className="relative mt-2 block max-w-xs"><input type="number" min="0" max="12" value={perfectAttendanceMonths} onChange={(event) => setPerfectAttendanceMonths(event.target.value)} className="calc-input pr-12" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">개월</span></span>
          </label>
        )}
        {!hasValidRange && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">계산 기준일은 입사일보다 빠를 수 없습니다.</p>}
      </section>

      {hasValidRange && (
        <section className="calc-card mb-6 overflow-hidden" aria-labelledby="annual-leave-result-title">
          <div className="bg-[#2c211c] p-6 text-white">
            <p className="text-xs font-bold text-[#ffd9c9]">{mode === "employed" ? "현재 사용 가능" : "퇴사 정산 검토 대상"}</p>
            <h2 id="annual-leave-result-title" className="mt-1 text-4xl font-black">{result.currentAvailable}일</h2>
            <p className="mt-2 text-sm text-white/70">현재 사용기간 발생 {result.currentGranted}일 − 입력한 사용 {Number(usedLeave) || 0}일</p>
          </div>
          <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
            <div className="bg-white p-4"><small className="text-gray-500">과거 포함 총 발생</small><strong className="mt-1 block text-xl text-gray-900">{result.historicalGenerated}일</strong></div>
            <div className="bg-white p-4"><small className="text-gray-500">완료 근속</small><strong className="mt-1 block text-xl text-gray-900">{result.completedYears}년 {Math.max(0, result.completedMonths - result.completedYears * 12)}개월</strong></div>
            <div className="bg-white p-4"><small className="text-gray-500">입사일 법정 기준 잔여</small><strong className="mt-1 block text-xl text-gray-900">{result.statutoryCurrentAvailable}일</strong></div>
          </div>
          {result.warning && <p className="border-t border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{result.warning}</p>}
        </section>
      )}

      {hasValidRange && (
        <section className="calc-card mb-8 p-5 sm:p-6" aria-labelledby="annual-leave-schedule-title">
          <h2 id="annual-leave-schedule-title" className="text-lg font-bold text-gray-900">2. 발생 내역</h2>
          <p className="mt-1 text-sm text-gray-500">총 발생은 과거 발생 이력이며, 지금 남아 있는 연차와 같지 않습니다.</p>
          <div className="mt-4 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" tabIndex={0} role="region" aria-label="연차 발생 내역 표">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead><tr className="border-y border-gray-200 bg-gray-50 text-gray-600"><th className="px-3 py-2">기준일</th><th className="px-3 py-2">구분</th><th className="px-3 py-2">발생</th><th className="px-3 py-2">산정 내용</th></tr></thead>
              <tbody>{result.details.map((detail, index) => <tr key={`${detail.grantDate}-${detail.kind}-${index}`} className="border-b border-gray-100"><td className="px-3 py-3 font-mono text-xs">{detail.grantDate}</td><td className="px-3 py-3">{detail.kind === "monthly" ? "1년 미만" : detail.kind === "fiscal" ? "회계연도 참고" : "연 단위"}</td><td className="px-3 py-3 font-bold text-[#a93d28]">{detail.days}일</td><td className="px-3 py-3 text-gray-600">{detail.description}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      <section className="space-y-6 text-sm leading-7 text-gray-600">
        <div className="calc-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">계산 기준과 경계일</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>1년 미만은 1개월을 개근한 다음 날 1일씩, 최대 11일이 발생합니다. 월 말 입사일은 다음 달의 마지막 날을 월 단위 경계로 처리합니다.</li>
            <li>1년 80% 이상 출근분 15일은 1년을 마친 다음 날에도 근로관계가 있어야 발생합니다. 365일 계약 종료와 366일째 재직을 구분합니다.</li>
            <li>3년 이상 계속 근로하면 최초 1년을 넘긴 계속근로연수 매 2년마다 1일을 더하며, 연 단위 부여분은 최대 25일입니다.</li>
            <li>회계연도 기준은 법정 단일 산식이 아닙니다. 이 계산기는 첫해 재직일수 비례 예시를 보여주고 입사일 기준 결과를 함께 비교합니다.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
          <strong>중요한 한계</strong>
          <p className="mt-2">연차 사용촉진, 휴직·휴업, 출근 간주기간, 단체협약, 이월 약정, 회계연도 보정은 회사별 사실관계가 필요합니다. 퇴직 정산 전에는 급여 담당자나 고용노동부 상담으로 확인하세요.</p>
          <div className="mt-3 flex flex-wrap gap-3 font-bold">
            <a href="https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029727971" target="_blank" rel="noreferrer" className="underline">근로기준법 제60조</a>
            <a href="https://www.moel.go.kr/news/enews/report/enewsView.do?bbs_id=12&news_seq=13052" target="_blank" rel="noreferrer" className="underline">고용노동부 행정해석 변경 안내</a>
          </div>
        </div>
      </section>

      <RelatedTools current="annual-leave" />
    </div>
  );
}
