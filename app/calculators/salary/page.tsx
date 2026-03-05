"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

export default function SalaryCalculator() {
  const [salary, setSalary] = useState("40,000,000");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  // Real-time calculation
  const result = useMemo<SalaryResult | null>(() => {
    const amount = parseInt(salary.replace(/,/g, ""), 10);
    if (!amount || amount <= 0) return null;
    return calculateSalary(amount);
  }, [salary]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`월 실수령액: ${formatNumber(result.monthlyNet)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setSalary(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setSalary("");
    }
  };

  // Donut chart data
  const chartData = useMemo(() => {
    if (!result) return null;
    const total = result.monthlyGross;
    const items = [
      { label: "실수령액", value: result.monthlyNet, color: "#3b82f6" },
      { label: "4대보험", value: result.nationalPension + result.healthInsurance + result.longTermCare + result.employmentInsurance, color: "#f59e0b" },
      { label: "소득세", value: result.incomeTax + result.localIncomeTax, color: "#ef4444" },
    ];
    let offset = 0;
    return items.map((item) => {
      const pct = (item.value / total) * 100;
      const seg = { ...item, pct, offset };
      offset += pct;
      return seg;
    });
  }, [result]);

  const quickAmounts = [3000, 4000, 5000, 6000, 8000, 10000];

  const faqs = [
    {
      q: "연봉과 월급의 차이는?",
      a: "연봉은 1년 동안 받는 총 급여이고, 월급은 연봉을 12개월로 나눈 금액입니다. 다만 성과급, 상여금 등이 별도로 지급되는 경우 실제 수령액은 달라질 수 있습니다.",
    },
    {
      q: "국민연금에 상한선이 있나요?",
      a: "네, 국민연금은 월 소득 590만원을 상한으로 합니다. 즉, 월 급여가 590만원 이상이어도 국민연금은 590만원 기준으로 계산됩니다. 하한선은 월 37만원입니다.",
    },
    {
      q: "부양가족 수에 따라 세금이 달라지나요?",
      a: "네, 부양가족이 많을수록 인적공제가 늘어나 소득세가 줄어듭니다. 본 계산기는 부양가족 1인(본인) 기준으로 계산하며, 실제 세금은 부양가족 수에 따라 달라집니다.",
    },
    {
      q: "비과세 수당은 어떻게 되나요?",
      a: "식대(월 20만원), 차량유지비 등 비과세 수당은 소득세 계산에서 제외됩니다. 비과세 수당이 있다면 실제 실수령액은 본 계산 결과보다 다소 많을 수 있습니다.",
    },
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          연봉 실수령액 계산기
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          2025년 기준 4대보험과 소득세를 공제한 월 실수령액을 계산합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          연봉 (세전)
        </label>
        <div className="relative">
          <input
            type="text"
            value={salary}
            onChange={handleInputChange}
            placeholder="예: 50,000,000"
            className="calc-input calc-input-lg pr-10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
            원
          </span>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium self-center mr-1">빠른 선택</span>
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSalary((amount * 10000).toLocaleString("ko-KR"))}
              className="calc-preset"
            >
              {amount.toLocaleString()}만원
            </button>
          ))}
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          {/* 실수령액 하이라이트 */}
          <div className="calc-result-header">
            <p className="text-blue-200 text-sm mb-1 relative z-10">월 실수령액</p>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {formatNumber(result.monthlyNet)}
                <span className="text-xl font-bold ml-1">원</span>
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all active:scale-95"
                title="결과 복사"
                aria-label="결과 복사"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-blue-200/80 text-sm mt-2 relative z-10">
              연봉 {formatNumber(result.annualSalary)}원 기준
            </p>
          </div>

          {/* 도넛 차트 */}
          {chartData && (
            <div className="flex flex-col items-center py-6 border-b border-gray-100">
              <svg viewBox="0 0 36 36" className="w-32 h-32 mb-4">
                {chartData.map((seg, i) => (
                  <circle
                    key={i}
                    cx="18" cy="18" r="15.9155"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="3.5"
                    strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                    strokeDashoffset={`${-seg.offset}`}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="flex gap-5 text-xs">
                {chartData.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                    <span className="text-[var(--muted)]">{seg.label} {seg.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 공제 내역 */}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              공제 내역
            </h3>
            <div className="space-y-1">
              <Row label="월 급여 (세전)" value={result.monthlyGross} bold />
              <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
                <Row label="국민연금" value={-result.nationalPension} />
                <Row label="건강보험" value={-result.healthInsurance} />
                <Row label="장기요양보험" value={-result.longTermCare} />
                <Row label="고용보험" value={-result.employmentInsurance} />
                <Row label="소득세" value={-result.incomeTax} />
                <Row label="지방소득세" value={-result.localIncomeTax} />
              </div>
              <div className="border-t-2 border-gray-200 mt-3 pt-3">
                <Row label="총 공제액" value={-result.totalDeductions} bold highlight />
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mt-3">
                <Row label="월 실수령액" value={result.monthlyNet} bold accent />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">연봉 실수령액이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            연봉 실수령액은 근로자가 회사로부터 받는 연봉에서 국민연금, 건강보험,
            장기요양보험, 고용보험 등 4대보험료와 소득세, 지방소득세를 공제한 후
            실제로 받는 금액입니다. 세전 연봉과 실수령액의 차이는 연봉이 높을수록
            커지며, 이는 누진세율 구조 때문입니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">4대보험 요율 (2025년 기준)</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th className="text-right">근로자 부담</th>
                  <th className="text-right">사업주 부담</th>
                  <th className="text-right">합계</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>국민연금</td><td className="text-right">4.5%</td><td className="text-right">4.5%</td><td className="text-right font-medium">9.0%</td></tr>
                <tr><td>건강보험</td><td className="text-right">3.545%</td><td className="text-right">3.545%</td><td className="text-right font-medium">7.09%</td></tr>
                <tr><td>장기요양보험</td><td className="text-right" colSpan={2}>건강보험료의 12.95%</td><td className="text-right font-medium">12.95%</td></tr>
                <tr><td>고용보험</td><td className="text-right">0.9%</td><td className="text-right">0.9%~</td><td className="text-right font-medium">1.8%~</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">연봉별 실수령액 참고표</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>연봉</th>
                  <th className="text-right">월 급여(세전)</th>
                  <th className="text-right">공제 합계</th>
                  <th className="text-right">월 실수령액</th>
                </tr>
              </thead>
              <tbody>
                {[3000, 4000, 5000, 6000, 8000, 10000].map((sal) => {
                  const r = calculateSalary(sal * 10000);
                  return (
                    <tr key={sal}>
                      <td className="font-medium">{sal.toLocaleString()}만원</td>
                      <td className="text-right">{r.monthlyGross.toLocaleString()}원</td>
                      <td className="text-right text-red-400">{r.totalDeductions.toLocaleString()}원</td>
                      <td className="text-right font-bold text-blue-600">{r.monthlyNet.toLocaleString()}원</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">소득세 누진세율 구조</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            한국의 소득세는 누진세율 구조로, 과세표준이 높을수록 높은 세율이 적용됩니다.
            단, 전체 소득에 최고 세율이 적용되는 것이 아니라 구간별로 다른 세율이 적용됩니다.
          </p>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>과세표준</th>
                  <th className="text-right">세율</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1,400만원 이하</td><td className="text-right font-medium">6%</td></tr>
                <tr><td>1,400만원 ~ 5,000만원</td><td className="text-right font-medium">15%</td></tr>
                <tr><td>5,000만원 ~ 8,800만원</td><td className="text-right font-medium">24%</td></tr>
                <tr><td>8,800만원 ~ 1억5천만원</td><td className="text-right font-medium">35%</td></tr>
                <tr><td>1억5천만원 ~ 3억원</td><td className="text-right font-medium">38%</td></tr>
                <tr><td>3억원 ~ 5억원</td><td className="text-right font-medium">40%</td></tr>
                <tr><td>5억원 ~ 10억원</td><td className="text-right font-medium">42%</td></tr>
                <tr><td>10억원 초과</td><td className="text-right font-medium">45%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="calc-faq mt-3">
            {faqs.map((faq, i) => (
              <div key={i} className="calc-faq-item">
                <button
                  className="calc-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="calc-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedTools current="salary" />

      {/* Mobile sticky result bar */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <p className="text-[10px] text-[var(--muted)]">월 실수령액</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.monthlyNet)}원</p>
            </div>
            <button
              onClick={handleCopy}
              className="calc-btn-primary text-xs px-3 py-2"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
  accent,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  accent?: boolean;
}) {
  const formatted =
    value >= 0
      ? `${value.toLocaleString("ko-KR")}원`
      : `-${Math.abs(value).toLocaleString("ko-KR")}원`;

  return (
    <div className="flex justify-between items-center py-1.5">
      <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-500"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${
          bold ? "font-bold" : "font-medium"
        } ${
          accent ? "text-blue-600 text-base" :
          highlight ? "text-red-500" :
          value < 0 ? "text-red-400" :
          "text-gray-900"
        }`}
      >
        {formatted}
      </span>
    </div>
  );
}
