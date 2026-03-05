"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface LottoTaxResult {
  winningAmount: number;
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;
  netAmount: number;
}

function calculateLottoTax(amount: number): LottoTaxResult {
  // 200만원 이하 비과세
  if (amount <= 2_000_000) {
    return {
      winningAmount: amount,
      incomeTax: 0,
      localIncomeTax: 0,
      totalTax: 0,
      netAmount: amount,
    };
  }

  let incomeTax = 0;

  const nonTaxable = 2_000_000;
  const threshold = 300_000_000;
  const taxableAmount = amount - nonTaxable;

  if (amount <= threshold) {
    // 200만원 초과 ~ 3억원 이하: 소득세 20%
    incomeTax = taxableAmount * 0.2;
  } else {
    // 200만원 초과 ~ 3억원 구간: 20%
    incomeTax = (threshold - nonTaxable) * 0.2;
    // 3억원 초과분: 30%
    incomeTax += (amount - threshold) * 0.3;
  }

  // 지방소득세: 소득세의 10%
  const localIncomeTax = incomeTax * 0.1;
  const totalTax = Math.floor(incomeTax + localIncomeTax);
  const netAmount = amount - totalTax;

  return {
    winningAmount: amount,
    incomeTax: Math.floor(incomeTax),
    localIncomeTax: Math.floor(localIncomeTax),
    totalTax,
    netAmount,
  };
}

export default function LottoTaxCalculator() {
  const [amount, setAmount] = useState("2,000,000,000");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setAmount(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setAmount("");
    }
  };

  const result = useMemo<LottoTaxResult | null>(() => {
    const num = parseInt(amount.replace(/,/g, ""), 10);
    if (!num || num <= 0) return null;
    return calculateLottoTax(num);
  }, [amount]);

  const handleReset = () => {
    setAmount("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.netAmount)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setQuickAmount = (value: number) => {
    setAmount(value.toLocaleString("ko-KR"));
  };

  const quickAmounts = [
    { label: "10억", value: 1_000_000_000 },
    { label: "20억", value: 2_000_000_000 },
    { label: "50억", value: 5_000_000_000 },
    { label: "100억", value: 10_000_000_000 },
  ];

  const rankPresets = [
    { label: "1등 (평균 20억)", value: 2_000_000_000 },
    { label: "2등 (평균 5천만)", value: 50_000_000 },
    { label: "3등 (평균 150만)", value: 1_500_000 },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        로또 세금 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        로또 당첨금에 대한 세금과 실수령액을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          당첨금액
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={amount}
              onChange={handleInputChange}
              placeholder="예: 2,000,000,000"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원
            </span>
          </div>
          <button
            onClick={handleReset}
            className="calc-btn-secondary whitespace-nowrap"
          >
            초기화
          </button>
        </div>
        {/* 빠른 금액 선택 */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">빠른 금액 선택</p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((item) => (
              <button
                key={item.value}
                onClick={() => setQuickAmount(item.value)}
                className="calc-preset"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 등수별 선택 */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">등수별 평균 당첨금</p>
          <div className="flex flex-wrap gap-2">
            {rankPresets.map((item) => (
              <button
                key={item.value}
                onClick={() => setQuickAmount(item.value)}
                className="calc-preset"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          {/* 실수령액 하이라이트 */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">세후 실수령액</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {formatNumber(result.netAmount)}원
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                title="결과 복사"
                aria-label="결과 복사"
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
              당첨금 {formatNumber(result.winningAmount)}원 기준
            </p>
          </div>

          {/* 세금 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">세금 내역</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">당첨금액</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(result.winningAmount)}원
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">소득세 (20~30%)</p>
                  <p className="text-lg font-semibold text-red-500">
                    -{formatNumber(result.incomeTax)}원
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">지방소득세 (소득세의 10%)</p>
                  <p className="text-lg font-semibold text-red-500">
                    -{formatNumber(result.localIncomeTax)}원
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">세금 합계</p>
                  <p className="text-lg font-semibold text-red-600">
                    -{formatNumber(result.totalTax)}원
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">실수령액</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatNumber(result.netAmount)}원
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">실수령 비율</span>
                  <span className="text-sm text-gray-600">
                    {result.winningAmount > 0
                      ? ((result.netAmount / result.winningAmount) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">세후 실수령액</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.netAmount)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      {/* 참고사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">참고사항</h3>
        <ul className="text-sm text-yellow-700 space-y-1.5">
          <li>- 복권 당첨금 200만원 이하는 비과세입니다 (세금 없음).</li>
          <li>- 3억원 이하: 소득세 20% + 지방소득세 2% = 총 22%</li>
          <li>- 3억원 초과분: 소득세 30% + 지방소득세 3% = 총 33%</li>
          <li>- 지방소득세는 소득세의 10%입니다.</li>
        </ul>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            로또 당첨금 세금 구조
          </h2>
          <p className="text-gray-600 leading-relaxed">
            로또 당첨금은 &quot;기타소득&quot;으로 분류되어 소득세와 지방소득세가 부과됩니다.
            당첨금 200만원 이하는 비과세이며, 200만원을 초과하는 당첨금에 대해
            3억원 이하 구간은 22% (소득세 20% + 지방소득세 2%), 3억원 초과 구간은
            33% (소득세 30% + 지방소득세 3%)의 세율이 적용됩니다. 세금은 당첨금
            지급 시 원천징수되므로 별도로 신고할 필요가 없습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            당첨금별 세금 참고표
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">당첨금</th>
                  <th className="text-right py-2 px-3 border border-gray-200">세금</th>
                  <th className="text-right py-2 px-3 border border-gray-200">실수령액</th>
                  <th className="text-right py-2 px-3 border border-gray-200">실수령 비율</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[
                  1_500_000, 50_000_000, 300_000_000, 1_000_000_000,
                  2_000_000_000, 5_000_000_000, 10_000_000_000,
                ].map((val) => {
                  const r = calculateLottoTax(val);
                  return (
                    <tr key={val}>
                      <td className="py-2 px-3 border border-gray-200">
                        {val >= 100_000_000
                          ? `${(val / 100_000_000).toLocaleString()}억원`
                          : `${(val / 10_000).toLocaleString()}만원`}
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {r.totalTax.toLocaleString("ko-KR")}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200 font-medium">
                        {r.netAmount.toLocaleString("ko-KR")}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {((r.netAmount / r.winningAmount) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">로또 당첨금은 종합소득세 신고 대상인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                아닙니다. 복권 당첨금은 원천징수로 납세 의무가 종결되므로, 별도의 종합소득세 신고가 필요하지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">연금복권도 같은 세율이 적용되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 연금복권을 포함한 모든 복권 당첨금에 동일한 세율이 적용됩니다. 연금복권의 경우 매월 지급되는 금액에 대해 세금이 원천징수됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">공동 구매 시 세금은 어떻게 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                공동 구매의 경우 각자의 지분에 대해 세금이 부과됩니다. 예를 들어 10억 당첨금을 2명이 나누면, 각각 5억원에 대한 세금을 납부합니다. 다만 반드시 당첨금 수령 시 공동 수령 신청을 해야 합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">200만원 이하 비과세 기준은 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                복권 및 복권기금법에 따라 당첨금 200만원 이하는 비과세입니다. 로또 4등(5만원)과 5등(5천원)은 세금 없이 전액 수령할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="lotto-tax" />
    </div>
  );
}
