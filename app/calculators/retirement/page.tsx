"use client";

import { useState, useMemo } from "react";
import { calculateRetirement, type RetirementResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

export default function RetirementCalculator() {
  const [startDate, setStartDate] = useState("2023-03-01");
  const [endDate, setEndDate] = useState("2026-03-01");
  const [pay, setPay] = useState("9,000,000");
  const [days, setDays] = useState("90");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const payNum = parseInt(pay.replace(/,/g, ""), 10);
    const daysNum = parseInt(days, 10);
    if (!payNum || payNum <= 0 || !daysNum || daysNum <= 0) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return null;
    return calculateRetirement(start, end, payNum, daysNum);
  }, [startDate, endDate, pay, days]);

  const handleReset = () => {
    setStartDate("2023-03-01");
    setEndDate("2026-03-01");
    setPay("9,000,000");
    setDays("90");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`예상 퇴직금: ${formatNumber(result.retirementPay)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPay(raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "");
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">퇴직금 계산기</h1>
      <p className="text-gray-500 mb-8">
        입사일, 퇴사일, 최근 3개월 급여를 입력하면 퇴직금을 자동으로 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">입사일</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); }}
              className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴사일</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); }}
              className="calc-input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최근 3개월 총 급여 (세전)
          </label>
          <div className="relative">
            <input type="text" value={pay} onChange={handlePayChange} placeholder="예: 9,000,000"
              className="calc-input calc-input-lg" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">퇴사일 직전 3개월간의 총 급여(세전)를 입력하세요.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최근 3개월 총 일수
          </label>
          <div className="relative">
            <input type="number" value={days} onChange={(e) => { setDays(e.target.value); }} placeholder="90"
              className="calc-input calc-input-lg" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">일</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">보통 89~92일 (3개월의 실제 달력 일수)</p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset}
            className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="calc-card overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">예상 퇴직금</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">{formatNumber(result.retirementPay)}원</p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="결과 복사" aria-label="결과 복사">
                {copied ? <span className="text-xs font-medium">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">근속기간</span>
              <span className="text-sm font-medium text-gray-900">
                {result.years}년 {result.months}개월 {result.days}일 (총 {formatNumber(result.totalDays)}일)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">1일 평균임금</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(result.averageDailyWage)}원</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between py-1">
              <span className="text-sm font-semibold text-gray-900">퇴직금</span>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(result.retirementPay)}원</span>
            </div>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">퇴직금 산정 기준</h2>
          <p className="text-gray-600 leading-relaxed">
            근로기준법 제34조에 따라 퇴직금은 <strong>1일 평균임금 × 30일 × (재직일수 ÷ 365)</strong>로 산정됩니다.
            1년 이상 계속 근무한 근로자에게 지급 의무가 있으며, 1일 평균임금은 퇴직일 직전 3개월간의 총 급여를
            해당 기간의 총 일수(달력 일수)로 나누어 계산합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">평균임금에 포함되는 항목</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">포함되는 것</h3>
              <ul className="text-green-700 space-y-1">
                <li>기본급</li>
                <li>정기 상여금</li>
                <li>고정 수당 (직책수당, 자격수당 등)</li>
                <li>연장/야간/휴일 근로수당</li>
                <li>연차수당</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">포함되지 않는 것</h3>
              <ul className="text-red-700 space-y-1">
                <li>퇴직금</li>
                <li>경조사비 (일시적)</li>
                <li>출장비, 교통비 실비</li>
                <li>회사 복리후생 (식대, 학자금 등)</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">퇴직금 vs 퇴직연금</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="py-2 px-3 border border-gray-200">퇴직금</th>
                  <th className="py-2 px-3 border border-gray-200">퇴직연금 (DB)</th>
                  <th className="py-2 px-3 border border-gray-200">퇴직연금 (DC)</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">운용 주체</td><td className="py-2 px-3 border border-gray-200">회사</td><td className="py-2 px-3 border border-gray-200">금융기관</td><td className="py-2 px-3 border border-gray-200">근로자</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">수령액 결정</td><td className="py-2 px-3 border border-gray-200">퇴직 시 평균임금</td><td className="py-2 px-3 border border-gray-200">퇴직 시 평균임금</td><td className="py-2 px-3 border border-gray-200">운용 수익에 따라</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">회사 도산 시</td><td className="py-2 px-3 border border-gray-200">위험</td><td className="py-2 px-3 border border-gray-200">안전</td><td className="py-2 px-3 border border-gray-200">안전</td></tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">1년 미만 근무해도 퇴직금을 받을 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">원칙적으로 1년 이상 근무해야 퇴직금을 받을 수 있습니다. 다만 계약직의 경우 계약 기간 종료 시 퇴직금이 발생할 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">퇴직금 지급 기한은?</h3>
              <p className="text-gray-600 text-sm mt-1">사용자는 근로자 퇴직일로부터 14일 이내에 퇴직금을 지급해야 합니다. 미지급 시 지연이자(연 20%)가 발생합니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">퇴직금에 세금이 붙나요?</h3>
              <p className="text-gray-600 text-sm mt-1">퇴직소득세가 부과됩니다. 근속연수가 길수록 세금이 줄어드는 구조이며, 퇴직소득세는 일반 소득세보다 세율이 낮습니다.</p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="retirement" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">예상 퇴직금</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.retirementPay)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}
</div>
  );
}
