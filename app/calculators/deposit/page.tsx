"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

type TaxType = "normal" | "taxFree" | "taxFavored";

interface DepositRateEntry {
  rate: number;
  label: string;
}

interface InterestRatesData {
  updatedAt: string;
  dataMonth: string;
  baseRate: number;
  deposit: {
    "6m_under": DepositRateEntry;
    "6m_1y": DepositRateEntry;
    "1y_2y": DepositRateEntry;
    "2y_3y": DepositRateEntry;
    avg: DepositRateEntry;
  };
}

interface DepositResult {
  principal: number;
  grossInterest: number;
  taxAmount: number;
  netInterest: number;
  totalAmount: number;
  monthlyAvgInterest: number;
}

function calculateDeposit(
  principal: number,
  annualRate: number,
  months: number,
  taxType: TaxType
): DepositResult {
  // 단리 이자 = 원금 x 이율 x 기간/12
  const grossInterest = Math.round(principal * (annualRate / 100) * (months / 12));

  let taxRate = 0;
  if (taxType === "normal") taxRate = 15.4;
  else if (taxType === "taxFavored") taxRate = 9.5;

  const taxAmount = Math.round(grossInterest * (taxRate / 100));
  const netInterest = grossInterest - taxAmount;
  const totalAmount = principal + netInterest;
  const monthlyAvgInterest = months > 0 ? Math.round(netInterest / months) : 0;

  return {
    principal,
    grossInterest,
    taxAmount,
    netInterest,
    totalAmount,
    monthlyAvgInterest,
  };
}

function formatDataMonth(dataMonth: string): string {
  const year = dataMonth.slice(0, 4);
  const month = parseInt(dataMonth.slice(4, 6), 10);
  return `${year}년 ${month}월 기준`;
}

function getSuggestedRateForMonths(
  months: number,
  deposit: InterestRatesData["deposit"]
): number | null {
  if (months < 6) return deposit["6m_under"].rate;
  if (months < 12) return deposit["6m_1y"].rate;
  if (months < 24) return deposit["1y_2y"].rate;
  if (months < 36) return deposit["2y_3y"].rate;
  return deposit["2y_3y"].rate;
}

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState("10,000,000");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("12");
  const [taxType, setTaxType] = useState<TaxType>("normal");
  const [copied, setCopied] = useState(false);
  const [ratesData, setRatesData] = useState<InterestRatesData | null>(null);
  const [rateManuallySet, setRateManuallySet] = useState(false);

  useEffect(() => {
    fetch("/interest-rates.json")
      .then((res) => res.json())
      .then((data: InterestRatesData) => {
        setRatesData(data);
        setRate(data.deposit.avg.rate.toString());
      })
      .catch(() => {
        // 실패 시 기본값 유지
      });
  }, []);

  const suggestRateForMonths = useCallback(
    (m: number) => {
      if (!ratesData || rateManuallySet) return;
      const suggested = getSuggestedRateForMonths(m, ratesData.deposit);
      if (suggested !== null) {
        setRate(suggested.toString());
      }
    },
    [ratesData, rateManuallySet]
  );

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleNumberInput = (
    value: string,
    setter: (v: string) => void
  ) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw) {
      setter(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setter("");
    }
  };

  const parseNumber = (value: string) =>
    parseInt(value.replace(/,/g, ""), 10) || 0;

  const result = useMemo(() => {
    const p = parseNumber(principal);
    const r = parseFloat(rate);
    const m = parseInt(months.replace(/,/g, ""), 10);
    if (!p || p <= 0 || !r || r <= 0 || !m || m <= 0) return null;
    return calculateDeposit(p, r, m, taxType);
  }, [principal, rate, months, taxType]);

  const handleReset = () => {
    setPrincipal("10,000,000");
    setRate(ratesData ? ratesData.deposit.avg.rate.toString() : "3.5");
    setMonths("12");
    setTaxType("normal");
    setCopied(false);
    setRateManuallySet(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`세후 수령액: ${formatNumber(result.totalAmount)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [1000, 3000, 5000, 10000];
  const quickMonths = [6, 12, 24, 36];

  const ratePresets = ratesData
    ? [
        { label: "6개월", rate: ratesData.deposit["6m_under"].rate },
        { label: "1년", rate: ratesData.deposit["6m_1y"].rate },
        { label: "2년", rate: ratesData.deposit["1y_2y"].rate },
      ]
    : null;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        예금이자 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        정기예금의 세후 수령액과 이자를 계산합니다. 목돈을 한 번에 예치하는 예금 상품에 적합합니다.
      </p>

      {/* 시중 평균 예금금리 카드 */}
      {ratesData && (
        <div className="calc-card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              시중 평균 예금금리
            </h2>
            <span className="text-xs text-gray-400">
              {formatDataMonth(ratesData.dataMonth)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              기준금리 {ratesData.baseRate}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              6개월 미만 {ratesData.deposit["6m_under"].rate}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              6개월~1년 {ratesData.deposit["6m_1y"].rate}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              1~2년 {ratesData.deposit["1y_2y"].rate}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              2~3년 {ratesData.deposit["2y_3y"].rate}%
            </span>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 예치금액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예치금액
            </label>
            <div className="relative">
              <input
                type="text"
                value={principal}
                onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
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
                  onClick={() => {
                    setPrincipal((amt * 10000).toLocaleString("ko-KR"));
                  }}
                  className="calc-preset"
                >
                  {amt.toLocaleString()}만원
                </button>
              ))}
            </div>
          </div>

          {/* 연이율 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연이율
            </label>
            <div className="relative">
              <input
                type="text"
                value={rate}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  setRate(v);
                  setRateManuallySet(true);
                }}
                placeholder="예: 3.5"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {ratePresets ? (
                ratePresets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setRate(p.rate.toString());
                      setRateManuallySet(false);
                    }}
                    className={`calc-preset ${rate === p.rate.toString() ? "ring-1 ring-blue-400 bg-blue-50 text-blue-700" : ""}`}
                  >
                    {p.label} {p.rate}%
                  </button>
                ))
              ) : (
                [2.5, 3.0, 3.5, 4.0, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r.toString())}
                    className="calc-preset"
                  >
                    {r}%
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 예치기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예치기간
            </label>
            <div className="relative">
              <input
                type="text"
                value={months}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setMonths(v);
                  const m = parseInt(v, 10);
                  if (m > 0) suggestRateForMonths(m);
                }}
                placeholder="예: 12"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                개월
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {quickMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMonths(m.toString());
                    if (ratesData && !rateManuallySet) {
                      const suggested = getSuggestedRateForMonths(m, ratesData.deposit);
                      if (suggested !== null) setRate(suggested.toString());
                    }
                  }}
                  className="calc-preset"
                >
                  {m}개월
                </button>
              ))}
            </div>
          </div>

          {/* 이자과세 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이자과세
            </label>
            <div className="space-y-2">
              {[
                { value: "normal" as TaxType, label: "일반과세 (15.4%)" },
                { value: "taxFree" as TaxType, label: "비과세 (0%)" },
                { value: "taxFavored" as TaxType, label: "세금우대 (9.5%)" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="taxType"
                    value={option.value}
                    checked={taxType === option.value}
                    onChange={() => setTaxType(option.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
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
        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">세후 수령액</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {formatNumber(result.totalAmount)}원
              </p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="결과 복사" aria-label="결과 복사">
                {copied ? <span className="text-xs font-medium">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              원금 {formatNumber(result.principal)}원 + 세후이자{" "}
              {formatNumber(result.netInterest)}원
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">상세 내역</h3>
            <div className="space-y-3">
              <Row label="예치금액 (원금)" value={formatNumber(result.principal) + "원"} bold />
              <div className="border-t border-gray-100 pt-3">
                <Row label="세전이자" value={formatNumber(result.grossInterest) + "원"} />
                <Row
                  label={`이자소득세 (${taxType === "normal" ? "15.4%" : taxType === "taxFavored" ? "9.5%" : "0%"})`}
                  value={"-" + formatNumber(result.taxAmount) + "원"}
                  highlight
                />
                <Row label="세후이자" value={formatNumber(result.netInterest) + "원"} bold />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="세후 수령액" value={formatNumber(result.totalAmount) + "원"} bold />
                <Row label="월평균 이자 (세후)" value={formatNumber(result.monthlyAvgInterest) + "원"} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            예금이자 계산기란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            예금이자 계산기는 정기예금에 목돈을 예치했을 때 만기 시 받을 수 있는
            이자와 수령액을 계산합니다. 예금은 적금과 달리 목돈을 한 번에
            예치하고 만기일에 원금과 이자를 함께 수령하는 금융 상품입니다.
            단리 방식으로 이자가 계산되며, 이자소득세를 차감한 세후 수령액을
            확인할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            예금과 적금의 차이
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="text-left py-2 px-3 border border-gray-200">예금</th>
                  <th className="text-left py-2 px-3 border border-gray-200">적금</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">납입 방식</td>
                  <td className="py-2 px-3 border border-gray-200">목돈 일시 예치</td>
                  <td className="py-2 px-3 border border-gray-200">매월 일정 금액 납입</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">이자 계산</td>
                  <td className="py-2 px-3 border border-gray-200">전체 원금에 대해 이자 계산</td>
                  <td className="py-2 px-3 border border-gray-200">매월 납입금에 대해 개별 이자 계산</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">이자 수익</td>
                  <td className="py-2 px-3 border border-gray-200">같은 이율 대비 높음</td>
                  <td className="py-2 px-3 border border-gray-200">같은 이율 대비 낮음</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">적합 대상</td>
                  <td className="py-2 px-3 border border-gray-200">여유 자금 운용</td>
                  <td className="py-2 px-3 border border-gray-200">저축 습관 형성</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            이자과세 유형 안내
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">일반과세 (15.4%)</strong>: 이자소득세 14% + 지방소득세 1.4%가 원천징수됩니다. 대부분의 예금 상품에 적용됩니다.
            </p>
            <p>
              <strong className="text-gray-900">비과세 (0%)</strong>: 조합 출자금, 비과세 종합저축(만 65세 이상, 장애인 등) 등 특정 조건을 충족하면 이자소득세가 면제됩니다.
            </p>
            <p>
              <strong className="text-gray-900">세금우대 (9.5%)</strong>: 농어촌특별세 포함 9.5%만 과세됩니다. 조합원 예탁금 등 일부 상품에 적용됩니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">예금 이자는 어떻게 계산되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                정기예금은 단리 방식으로 계산됩니다. 이자 = 원금 x 연이율 x (예치기간/12개월)입니다.
                예를 들어 1,000만원을 연 3.5%로 12개월 예치하면 세전이자는 350,000원입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">예금자보호가 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                예금자보호법에 따라 1인당 5,000만원까지 보호됩니다. 여러 은행에 분산 예치하면
                각 은행별로 5,000만원까지 보호받을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">중도해지하면 이자는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                중도해지 시 약정 이율보다 낮은 중도해지 이율이 적용됩니다. 일반적으로 가입 기간과
                해지 시점에 따라 다르며, 은행별 약관을 확인해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="deposit" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">세후 수령액</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.totalAmount)}원</p>
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

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : ""} ${highlight ? "text-red-400" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
