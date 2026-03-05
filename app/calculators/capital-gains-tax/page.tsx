"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface CapitalGainsTaxResult {
  acquisitionPrice: number;
  sellingPrice: number;
  expenses: number;
  capitalGain: number;
  longTermDeductionRate: number;
  longTermDeduction: number;
  basicDeduction: number;
  taxableIncome: number;
  taxRate: number;
  progressiveDeduction: number;
  capitalGainsTax: number;
  localIncomeTax: number;
  total: number;
}

function calculateCapitalGainsTax(
  acquisitionPrice: number,
  sellingPrice: number,
  expenses: number,
  holdingYears: number,
  isOneHousehold: boolean
): CapitalGainsTaxResult {
  // 양도차익
  const capitalGain = sellingPrice - acquisitionPrice - expenses;

  if (capitalGain <= 0) {
    return {
      acquisitionPrice,
      sellingPrice,
      expenses,
      capitalGain: Math.max(0, capitalGain),
      longTermDeductionRate: 0,
      longTermDeduction: 0,
      basicDeduction: 0,
      taxableIncome: 0,
      taxRate: 0,
      progressiveDeduction: 0,
      capitalGainsTax: 0,
      localIncomeTax: 0,
      total: 0,
    };
  }

  // 장기보유특별공제
  let longTermDeductionRate = 0;
  if (isOneHousehold && holdingYears >= 2) {
    // 1세대 1주택: 보유기간별 연 8%, 거주기간별 연 8%, 합산 최대 80%
    // 여기서는 보유기간 기준 간이 계산 (거주기간 = 보유기간으로 가정)
    const holdingRate = Math.min(holdingYears, 10) * 4; // 보유: 연 4%, 최대 40%
    const residenceRate = Math.min(holdingYears, 10) * 4; // 거주: 연 4%, 최대 40%
    longTermDeductionRate = Math.min(holdingRate + residenceRate, 80);
  } else if (holdingYears >= 3) {
    // 일반: 연 2%, 최대 30% (15년)
    longTermDeductionRate = Math.min((holdingYears) * 2, 30);
  }

  const longTermDeduction = Math.round(
    capitalGain * (longTermDeductionRate / 100)
  );

  // 기본공제 250만원
  const basicDeduction = 2_500_000;

  // 과세표준
  const taxableIncome = Math.max(
    0,
    capitalGain - longTermDeduction - basicDeduction
  );

  // 종합소득세율 적용
  let tax = 0;
  let taxRate = 0;
  let progressiveDeduction = 0;

  if (taxableIncome <= 14_000_000) {
    taxRate = 6;
    progressiveDeduction = 0;
    tax = taxableIncome * 0.06;
  } else if (taxableIncome <= 50_000_000) {
    taxRate = 15;
    progressiveDeduction = 1_260_000;
    tax = taxableIncome * 0.15 - progressiveDeduction;
  } else if (taxableIncome <= 88_000_000) {
    taxRate = 24;
    progressiveDeduction = 5_760_000;
    tax = taxableIncome * 0.24 - progressiveDeduction;
  } else if (taxableIncome <= 150_000_000) {
    taxRate = 35;
    progressiveDeduction = 15_440_000;
    tax = taxableIncome * 0.35 - progressiveDeduction;
  } else if (taxableIncome <= 300_000_000) {
    taxRate = 38;
    progressiveDeduction = 19_940_000;
    tax = taxableIncome * 0.38 - progressiveDeduction;
  } else if (taxableIncome <= 500_000_000) {
    taxRate = 40;
    progressiveDeduction = 25_940_000;
    tax = taxableIncome * 0.4 - progressiveDeduction;
  } else if (taxableIncome <= 1_000_000_000) {
    taxRate = 42;
    progressiveDeduction = 35_940_000;
    tax = taxableIncome * 0.42 - progressiveDeduction;
  } else {
    taxRate = 45;
    progressiveDeduction = 65_940_000;
    tax = taxableIncome * 0.45 - progressiveDeduction;
  }

  const capitalGainsTax = Math.round(Math.max(0, tax));
  const localIncomeTax = Math.round(capitalGainsTax * 0.1);
  const total = capitalGainsTax + localIncomeTax;

  return {
    acquisitionPrice,
    sellingPrice,
    expenses,
    capitalGain,
    longTermDeductionRate,
    longTermDeduction,
    basicDeduction,
    taxableIncome,
    taxRate,
    progressiveDeduction,
    capitalGainsTax,
    localIncomeTax,
    total,
  };
}

export default function CapitalGainsTaxCalculator() {
  const [acquisitionPrice, setAcquisitionPrice] = useState("300,000,000");
  const [sellingPrice, setSellingPrice] = useState("500,000,000");
  const [expenses, setExpenses] = useState("10,000,000");
  const [holdingYears, setHoldingYears] = useState("5");
  const [isOneHousehold, setIsOneHousehold] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange =
    (setter: (val: string) => void, isNumber = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumber) {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setter(raw);
      } else {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw) {
          setter(parseInt(raw, 10).toLocaleString("ko-KR"));
        } else {
          setter("");
        }
      }
      setError("");
    };

  const parseAmount = (val: string) =>
    parseInt(val.replace(/,/g, ""), 10) || 0;

  const result = useMemo(() => {
    const acq = parseAmount(acquisitionPrice);
    const sell = parseAmount(sellingPrice);
    const exp = parseAmount(expenses);
    const years = parseInt(holdingYears, 10) || 0;
    if (acq <= 0 || sell <= 0) return null;
    return calculateCapitalGainsTax(acq, sell, exp, years, isOneHousehold);
  }, [acquisitionPrice, sellingPrice, expenses, holdingYears, isOneHousehold]);

  const handleReset = () => {
    setAcquisitionPrice("300,000,000");
    setSellingPrice("500,000,000");
    setExpenses("10,000,000");
    setHoldingYears("5");
    setIsOneHousehold(false);
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.total)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        양도소득세 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        2025년 기준 부동산 양도소득세를 장기보유특별공제를 적용하여 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              취득가액 (매입가)
            </label>
            <div className="relative">
              <input
                type="text"
                value={acquisitionPrice}
                onChange={handleInputChange(setAcquisitionPrice)}

                placeholder="예: 300,000,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              양도가액 (매도가)
            </label>
            <div className="relative">
              <input
                type="text"
                value={sellingPrice}
                onChange={handleInputChange(setSellingPrice)}

                placeholder="예: 500,000,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              필요경비 (취득세, 중개수수료, 수리비 등)
            </label>
            <div className="relative">
              <input
                type="text"
                value={expenses}
                onChange={handleInputChange(setExpenses)}
                placeholder="예: 10,000,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              보유기간
            </label>
            <div className="relative">
              <input
                type="text"
                value={holdingYears}
                onChange={handleInputChange(setHoldingYears, true)}
                placeholder="예: 5"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                년
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1세대 1주택 여부
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOneHousehold(false)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isOneHousehold
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              해당 없음
            </button>
            <button
              onClick={() => setIsOneHousehold(true)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isOneHousehold
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              1세대 1주택 (2년 이상 거주)
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="calc-btn-secondary"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">양도소득세 합계 (지방소득세 포함)</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">{formatNumber(result.total)}원</p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                title="결과 복사"
              >
                {copied ? (
                  <span className="text-xs text-white font-medium px-1">복사됨!</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              양도차익 {formatNumber(result.capitalGain)}원 기준
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">계산 내역</h3>
            <div className="space-y-3">
              <Row label="양도가액" value={result.sellingPrice} />
              <Row label="취득가액" value={result.acquisitionPrice} />
              <Row label="필요경비" value={result.expenses} />
              <div className="border-t border-gray-100 pt-3">
                <Row label="양도차익" value={result.capitalGain} bold />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row
                  label={`장기보유특별공제 (${result.longTermDeductionRate}%)`}
                  value={result.longTermDeduction}
                />
                <Row label="기본공제" value={result.basicDeduction} />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="과세표준" value={result.taxableIncome} bold />
                <Row label="적용 세율" text={`${result.taxRate}%`} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="양도소득세" value={result.capitalGainsTax} />
                <Row label="지방소득세 (10%)" value={result.localIncomeTax} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="납부 세금 합계" value={result.total} bold />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            양도소득세란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            양도소득세는 부동산 등 자산을 양도(매도)하여 발생한 이익에 대해
            부과되는 세금입니다. 양도가액에서 취득가액과 필요경비를 차감한
            양도차익에 장기보유특별공제와 기본공제를 적용한 후 종합소득세율로
            과세합니다. 지방소득세는 양도소득세의 10%가 추가로 부과됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            장기보유특별공제율
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">보유기간</th>
                  <th className="text-right py-2 px-3 border border-gray-200">일반 (연 2%)</th>
                  <th className="text-right py-2 px-3 border border-gray-200">1세대 1주택 (보유+거주)</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">3년</td><td className="text-right py-2 px-3 border border-gray-200">6%</td><td className="text-right py-2 px-3 border border-gray-200">24%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5년</td><td className="text-right py-2 px-3 border border-gray-200">10%</td><td className="text-right py-2 px-3 border border-gray-200">40%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">10년</td><td className="text-right py-2 px-3 border border-gray-200">20%</td><td className="text-right py-2 px-3 border border-gray-200">80%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">15년</td><td className="text-right py-2 px-3 border border-gray-200">30%</td><td className="text-right py-2 px-3 border border-gray-200">80%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            양도소득세 세율 (종합소득세율)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">과세표준</th>
                  <th className="text-right py-2 px-3 border border-gray-200">세율</th>
                  <th className="text-right py-2 px-3 border border-gray-200">누진공제</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">1,400만원 이하</td><td className="text-right py-2 px-3 border border-gray-200">6%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1,400만~5,000만원</td><td className="text-right py-2 px-3 border border-gray-200">15%</td><td className="text-right py-2 px-3 border border-gray-200">126만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5,000만~8,800만원</td><td className="text-right py-2 px-3 border border-gray-200">24%</td><td className="text-right py-2 px-3 border border-gray-200">576만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">8,800만~1.5억원</td><td className="text-right py-2 px-3 border border-gray-200">35%</td><td className="text-right py-2 px-3 border border-gray-200">1,544만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1.5억~3억원</td><td className="text-right py-2 px-3 border border-gray-200">38%</td><td className="text-right py-2 px-3 border border-gray-200">1,994만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">3억~5억원</td><td className="text-right py-2 px-3 border border-gray-200">40%</td><td className="text-right py-2 px-3 border border-gray-200">2,594만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5억~10억원</td><td className="text-right py-2 px-3 border border-gray-200">42%</td><td className="text-right py-2 px-3 border border-gray-200">3,594만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">10억원 초과</td><td className="text-right py-2 px-3 border border-gray-200">45%</td><td className="text-right py-2 px-3 border border-gray-200">6,594만원</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">1세대 1주택 비과세 요건은?</h3>
              <p className="text-gray-600 text-sm mt-1">1세대 1주택으로 2년 이상 보유(조정대상지역은 2년 거주 포함)하고 양도가액이 12억원 이하인 경우 양도소득세가 비과세됩니다. 12억원을 초과하는 부분에 대해서만 과세됩니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">필요경비에 포함되는 항목은?</h3>
              <p className="text-gray-600 text-sm mt-1">취득 시 납부한 취득세, 중개수수료, 법무사 비용, 주택 수리비(자본적 지출) 등이 필요경비에 포함됩니다. 영수증 등 증빙 서류를 보관해야 인정받을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">양도소득세 신고 기한은?</h3>
              <p className="text-gray-600 text-sm mt-1">부동산 양도일이 속하는 달의 말일부터 2개월 이내에 예정신고를 해야 합니다. 기한 내 신고하지 않으면 가산세가 부과됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="capital-gains-tax" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">양도소득세 합계</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.total)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  text,
  bold,
}: {
  label: string;
  value?: number;
  text?: string;
  bold?: boolean;
}) {
  const display = text
    ? text
    : value !== undefined
    ? `${value.toLocaleString("ko-KR")}원`
    : "";

  return (
    <div className="flex justify-between items-center py-1">
      <span
        className={`text-sm ${
          bold ? "font-semibold text-gray-900" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-900"}`}
      >
        {display}
      </span>
    </div>
  );
}
