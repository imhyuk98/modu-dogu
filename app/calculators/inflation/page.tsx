"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface YearlyData {
  year: number;
  futurePrice: number;
  realValue: number;
  purchasePowerLoss: number;
}

interface InflationResult {
  currentAmount: number;
  rate: number;
  years: number;
  futurePrice: number;
  realValue: number;
  purchasePowerLossPercent: number;
  yearlyData: YearlyData[];
}

function calculateInflation(
  currentAmount: number,
  annualRate: number,
  years: number
): InflationResult {
  const rate = annualRate / 100;
  const futurePrice = Math.round(currentAmount * Math.pow(1 + rate, years));
  const realValue = Math.round(currentAmount / Math.pow(1 + rate, years));
  const purchasePowerLossPercent =
    Math.round((1 - realValue / currentAmount) * 10000) / 100;

  const yearlyData: YearlyData[] = [];
  for (let y = 1; y <= years; y++) {
    const fp = Math.round(currentAmount * Math.pow(1 + rate, y));
    const rv = Math.round(currentAmount / Math.pow(1 + rate, y));
    const loss = Math.round((1 - rv / currentAmount) * 10000) / 100;
    yearlyData.push({ year: y, futurePrice: fp, realValue: rv, purchasePowerLoss: loss });
  }

  return {
    currentAmount,
    rate: annualRate,
    years,
    futurePrice,
    realValue,
    purchasePowerLossPercent,
    yearlyData,
  };
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState("10,000,000");
  const [rate, setRate] = useState("3");
  const [years, setYears] = useState("10");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw) {
      setter(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setter("");
    }
  };

  const parseNumber = (value: string) =>
    parseInt(value.replace(/,/g, ""), 10) || 0;

  const result = useMemo<InflationResult | null>(() => {
    const a = parseNumber(amount);
    const r = parseFloat(rate);
    const y = parseInt(years.replace(/,/g, ""), 10);
    if (!a || a <= 0 || !r || r <= 0 || !y || y <= 0 || y > 100) return null;
    return calculateInflation(a, r, y);
  }, [amount, rate, years]);

  const handleReset = () => {
    setAmount("");
    setRate("3");
    setYears("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${result.years}년 후 실질 구매력: ${formatNumber(result.realValue)}원 (구매력 감소: -${result.purchasePowerLossPercent}%)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [1000, 5000, 10000, 50000];
  const quickYears = [5, 10, 20, 30];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        인플레이션 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        물가상승률(인플레이션)에 따라 현재 돈의 미래 가치와 구매력 변화를 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 현재 금액 */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 금액
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleNumberInput(e.target.value, setAmount)}
                placeholder="예: 10,000,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() =>
                    setAmount((amt * 10000).toLocaleString("ko-KR"))
                  }
                  className="calc-preset"
                >
                  {amt.toLocaleString()}만원
                </button>
              ))}
            </div>
          </div>

          {/* 연간 물가상승률 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연간 물가상승률
            </label>
            <div className="relative">
              <input
                type="text"
                value={rate}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  setRate(v);
                              }}
                placeholder="예: 3"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r.toString())}
                  className="calc-preset"
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* 기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기간
            </label>
            <div className="relative">
              <input
                type="text"
                value={years}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setYears(v);
                              }}
                placeholder="예: 10"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                년
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {quickYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y.toString())}
                  className="calc-preset"
                >
                  {y}년
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
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
        <div className="space-y-6 mb-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="calc-card p-6">
              <p className="text-sm text-gray-500 mb-1">
                {result.years}년 후 같은 물건 가격
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(result.futurePrice)}원
                </p>
                <button onClick={handleCopy} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" title="결과 복사" aria-label="결과 복사">
                  {copied ? <span className="text-xs font-medium text-green-600">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                현재 {formatNumber(result.currentAmount)}원짜리 물건이
                {result.years}년 후에는 이 가격이 됩니다
              </p>
            </div>
            <div className="calc-card p-6">
              <p className="text-sm text-gray-500 mb-1">
                현재 돈의 {result.years}년 후 실질 구매력
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(result.realValue)}원
              </p>
              <p className="text-xs text-gray-400 mt-1">
                현재 {formatNumber(result.currentAmount)}원의 {result.years}년
                후 실질 가치
              </p>
            </div>
          </div>

          {/* 구매력 감소율 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                구매력 감소율
              </span>
              <span className="text-lg font-bold text-red-600">
                -{result.purchasePowerLossPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(result.purchasePowerLossPercent, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              연 {result.rate}% 물가상승 시 {result.years}년 후 구매력이{" "}
              {result.purchasePowerLossPercent}% 감소합니다
            </p>
          </div>

          {/* 연도별 테이블 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              연도별 가치 변화
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 border border-gray-200">
                      경과
                    </th>
                    <th className="text-right py-2 px-3 border border-gray-200">
                      미래 물가
                    </th>
                    <th className="text-right py-2 px-3 border border-gray-200">
                      실질 구매력
                    </th>
                    <th className="text-right py-2 px-3 border border-gray-200">
                      구매력 감소
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="py-2 px-3 border border-gray-200">현재</td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      {formatNumber(result.currentAmount)}원
                    </td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      {formatNumber(result.currentAmount)}원
                    </td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      0%
                    </td>
                  </tr>
                  {result.yearlyData.map((d) => (
                    <tr key={d.year}>
                      <td className="py-2 px-3 border border-gray-200">
                        {d.year}년 후
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200 text-red-600">
                        {formatNumber(d.futurePrice)}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200 text-blue-600">
                        {formatNumber(d.realValue)}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        -{d.purchasePowerLoss}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">{result.years}년 후 실질 구매력</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.realValue)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            인플레이션(물가상승)이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            인플레이션은 시간이 지남에 따라 물가가 지속적으로 상승하는 현상입니다.
            물가가 오르면 같은 금액으로 살 수 있는 물건의 양이 줄어들어 화폐의
            구매력이 떨어집니다. 한국의 소비자물가 상승률은 최근 10년간 평균
            약 2~3% 수준이며, 한국은행의 물가안정목표는 2%입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            계산 공식
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-gray-700 font-mono text-sm">
              미래 명목가치 = 현재금액 x (1 + 물가상승률)^기간
            </p>
            <p className="text-gray-700 font-mono text-sm">
              실질 구매력 = 현재금액 / (1 + 물가상승률)^기간
            </p>
            <p className="text-gray-500 text-sm mt-2">
              예: 1,000만원, 연 3%, 10년 → 미래 물가 약 1,344만원 / 실질 구매력 약 744만원
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            인플레이션에 대비하는 방법
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">1. 투자를 통한 자산 증식</strong> - 예금만으로는 인플레이션을 이기기 어렵습니다. 주식, 부동산, 채권 등 다양한 자산에 분산 투자하세요.
            </p>
            <p>
              <strong className="text-gray-900">2. 물가연동 상품 활용</strong> - 물가연동국채(TIPS)는 물가상승률만큼 원금이 조정되어 인플레이션 위험을 줄여줍니다.
            </p>
            <p>
              <strong className="text-gray-900">3. 연금 계획 시 인플레이션 반영</strong> - 노후 자금을 계획할 때 반드시 인플레이션을 고려하여 필요 자금을 산정하세요.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">한국의 평균 물가상승률은?</h3>
              <p className="text-gray-600 text-sm mt-1">
                최근 10년(2014~2023) 한국의 평균 소비자물가 상승률은 약 2~3%입니다.
                다만 2022년에는 5.1%로 높은 상승률을 기록했습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">디플레이션은 좋은 건가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                물가가 하락하는 디플레이션은 소비자에게 단기적으로 유리할 수 있지만,
                경제 전체로는 소비 위축, 기업 수익 감소, 실업 증가 등 부정적 영향이 큽니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">72의 법칙이란?</h3>
              <p className="text-gray-600 text-sm mt-1">
                72를 물가상승률로 나누면 물가가 2배가 되는 대략적인 기간을 구할 수 있습니다.
                예를 들어 연 3% 상승 시 72/3 = 약 24년 후 물가가 2배가 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="inflation" />
    </div>
  );
}
