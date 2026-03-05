"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface StockReturnResult {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyAmount: number;
  sellAmount: number;
  buyFee: number;
  sellFee: number;
  totalFee: number;
  transactionTax: number;
  grossProfit: number;
  netProfit: number;
  returnRate: number;
}

function calculateStockReturn(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  feeRate: number,
  taxRate: number
): StockReturnResult {
  const buyAmount = buyPrice * quantity;
  const sellAmount = sellPrice * quantity;

  const buyFee = Math.round(buyAmount * (feeRate / 100));
  const sellFee = Math.round(sellAmount * (feeRate / 100));
  const totalFee = buyFee + sellFee;

  const transactionTax = Math.round(sellAmount * (taxRate / 100));

  const grossProfit = sellAmount - buyAmount;
  const netProfit = grossProfit - totalFee - transactionTax;
  const totalCost = buyAmount + buyFee;
  const returnRate = totalCost > 0 ? Math.round((netProfit / totalCost) * 10000) / 100 : 0;

  return {
    buyPrice,
    sellPrice,
    quantity,
    buyAmount,
    sellAmount,
    buyFee,
    sellFee,
    totalFee,
    transactionTax,
    grossProfit,
    netProfit,
    returnRate,
  };
}

export default function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState("50,000");
  const [sellPrice, setSellPrice] = useState("55,000");
  const [quantity, setQuantity] = useState("100");
  const [feeRate, setFeeRate] = useState("0.015");
  const [taxRate, setTaxRate] = useState("0.18");
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

  const result = useMemo<StockReturnResult | null>(() => {
    const bp = parseNumber(buyPrice);
    const sp = parseNumber(sellPrice);
    const q = parseNumber(quantity);
    const fr = parseFloat(feeRate);
    const tr = parseFloat(taxRate);
    if (!bp || bp <= 0 || !sp || sp <= 0 || !q || q <= 0) return null;
    return calculateStockReturn(bp, sp, q, fr || 0, tr || 0);
  }, [buyPrice, sellPrice, quantity, feeRate, taxRate]);

  const handleReset = () => {
    setBuyPrice("");
    setSellPrice("");
    setQuantity("");
    setFeeRate("0.015");
    setTaxRate("0.18");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`순수익: ${result.netProfit >= 0 ? "+" : ""}${formatNumber(result.netProfit)}원 (수익률: ${result.returnRate >= 0 ? "+" : ""}${result.returnRate}%)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        주식 수익률 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        매수가와 매도가를 입력하면 수수료, 증권거래세를 포함한 실제 순수익과 수익률을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 매수가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매수가 (1주당)
            </label>
            <div className="relative">
              <input
                type="text"
                value={buyPrice}
                onChange={(e) => handleNumberInput(e.target.value, setBuyPrice)}
                placeholder="예: 50,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>

          {/* 매도가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매도가 / 현재가 (1주당)
            </label>
            <div className="relative">
              <input
                type="text"
                value={sellPrice}
                onChange={(e) =>
                  handleNumberInput(e.target.value, setSellPrice)
                }
                placeholder="예: 55,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>

          {/* 수량 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수량
            </label>
            <div className="relative">
              <input
                type="text"
                value={quantity}
                onChange={(e) =>
                  handleNumberInput(e.target.value, setQuantity)
                }
                placeholder="예: 100"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                주
              </span>
            </div>
          </div>

          {/* 수수료율 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수수료율 (매수/매도 각각)
            </label>
            <div className="relative">
              <input
                type="text"
                value={feeRate}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  setFeeRate(v);
                }}
                placeholder="0.015"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "MTS 0.015%", value: "0.015" },
                { label: "HTS 0.015%", value: "0.015" },
                { label: "영업점 0.1%", value: "0.1" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setFeeRate(opt.value)}
                  className="calc-preset"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 증권거래세 */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증권거래세 (매도 시)
            </label>
            <div className="relative max-w-xs">
              <input
                type="text"
                value={taxRate}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  setTaxRate(v);
                }}
                placeholder="0.18"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "코스피 0.18%", value: "0.18" },
                { label: "코스닥 0.18%", value: "0.18" },
                { label: "K-OTC 0.18%", value: "0.18" },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setTaxRate(opt.value)}
                  className="calc-preset"
                >
                  {opt.label}
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
        <div className="calc-card overflow-hidden mb-6">
          {/* 하이라이트 */}
          <div
            className={`p-6 text-center text-white ${result.netProfit >= 0 ? "bg-red-500" : "bg-blue-500"}`}
          >
            <p className="text-sm opacity-80 mb-1">순수익</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {result.netProfit >= 0 ? "+" : ""}
                {formatNumber(result.netProfit)}원
              </p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="결과 복사" aria-label="결과 복사">
                {copied ? <span className="text-xs font-medium">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
            <p className="text-lg font-semibold mt-1 opacity-90">
              수익률{" "}
              {result.returnRate >= 0 ? "+" : ""}
              {result.returnRate}%
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">상세 내역</h3>
            <div className="space-y-3">
              <ResultRow label="매수 총액" value={formatNumber(result.buyAmount) + "원"} />
              <ResultRow label="매도 총액" value={formatNumber(result.sellAmount) + "원"} />
              <div className="border-t border-gray-100 pt-3">
                <ResultRow
                  label={`매수 수수료 (${feeRate}%)`}
                  value={"-" + formatNumber(result.buyFee) + "원"}
                  sub
                />
                <ResultRow
                  label={`매도 수수료 (${feeRate}%)`}
                  value={"-" + formatNumber(result.sellFee) + "원"}
                  sub
                />
                <ResultRow
                  label={`증권거래세 (${taxRate}%)`}
                  value={"-" + formatNumber(result.transactionTax) + "원"}
                  sub
                />
                <ResultRow
                  label="수수료 + 세금 합계"
                  value={"-" + formatNumber(result.totalFee + result.transactionTax) + "원"}
                  bold
                  highlight
                />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <ResultRow
                  label="매매 차익"
                  value={
                    (result.grossProfit >= 0 ? "+" : "") +
                    formatNumber(result.grossProfit) + "원"
                  }
                />
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-semibold text-gray-900">
                    순수익
                  </span>
                  <span
                    className={`text-sm font-semibold ${result.netProfit >= 0 ? "text-red-600" : "text-blue-600"}`}
                  >
                    {result.netProfit >= 0 ? "+" : ""}
                    {formatNumber(result.netProfit)}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-semibold text-gray-900">
                    수익률
                  </span>
                  <span
                    className={`text-sm font-semibold ${result.returnRate >= 0 ? "text-red-600" : "text-blue-600"}`}
                  >
                    {result.returnRate >= 0 ? "+" : ""}
                    {result.returnRate}%
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
              <p className="text-[10px] text-[var(--muted)]">순수익 (수익률 {result.returnRate >= 0 ? "+" : ""}{result.returnRate}%)</p>
              <p className={`text-lg font-extrabold ${result.netProfit >= 0 ? "text-red-600" : "text-blue-600"}`}>{result.netProfit >= 0 ? "+" : ""}{formatNumber(result.netProfit)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            주식 수익률 계산 방법
          </h2>
          <p className="text-gray-600 leading-relaxed">
            주식 투자의 실제 수익은 단순한 매매 차익에서 수수료와 세금을
            차감해야 정확하게 계산됩니다. 매수 시와 매도 시 각각 수수료가
            발생하며, 매도 시에는 증권거래세가 추가로 부과됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            계산 공식
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-gray-700 font-mono text-sm">매수금액 = 매수가 x 수량</p>
            <p className="text-gray-700 font-mono text-sm">매도금액 = 매도가 x 수량</p>
            <p className="text-gray-700 font-mono text-sm">매수수수료 = 매수금액 x 수수료율</p>
            <p className="text-gray-700 font-mono text-sm">매도수수료 = 매도금액 x 수수료율</p>
            <p className="text-gray-700 font-mono text-sm">증권거래세 = 매도금액 x 0.18%</p>
            <p className="text-gray-700 font-mono text-sm">순수익 = 매도금액 - 매수금액 - 수수료합계 - 세금</p>
            <p className="text-gray-700 font-mono text-sm">수익률 = 순수익 / (매수금액 + 매수수수료) x 100</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            증권거래세 안내 (2025년 기준)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">시장</th>
                  <th className="text-right py-2 px-3 border border-gray-200">증권거래세</th>
                  <th className="text-right py-2 px-3 border border-gray-200">농어촌특별세</th>
                  <th className="text-right py-2 px-3 border border-gray-200">합계</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">코스피</td>
                  <td className="text-right py-2 px-3 border border-gray-200">0.03%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">0.15%</td>
                  <td className="text-right py-2 px-3 border border-gray-200 font-medium">0.18%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">코스닥</td>
                  <td className="text-right py-2 px-3 border border-gray-200">0.18%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">-</td>
                  <td className="text-right py-2 px-3 border border-gray-200 font-medium">0.18%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">코넥스</td>
                  <td className="text-right py-2 px-3 border border-gray-200">0.10%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">-</td>
                  <td className="text-right py-2 px-3 border border-gray-200 font-medium">0.10%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * 증권거래세는 매도 시에만 부과됩니다. 매수 시에는 부과되지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            증권사 수수료 비교
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            대부분의 온라인 증권사에서 MTS/HTS 거래 시 0.015% 수준의 수수료를
            적용합니다. 이벤트 기간에는 수수료 무료 또는 할인 혜택을 제공하는
            경우도 있습니다. 영업점 창구 거래 시에는 0.1~0.5% 수준의 높은
            수수료가 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">수익이 나면 빨간색, 손실이 나면 파란색인 이유는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                한국 주식시장에서는 전통적으로 상승(수익)을 빨간색, 하락(손실)을 파란색으로 표시합니다.
                이는 미국 등 서양 시장(녹색이 상승)과 반대입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">금융투자소득세(금투세)는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                금융투자소득세는 현재 시행이 유예된 상태입니다. 시행 시 연간 5,000만원
                초과 주식 양도차익에 대해 22~27.5%의 세금이 부과될 예정입니다.
                본 계산기에는 금투세가 포함되어 있지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">해외주식 세금은 다른가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                해외주식은 연간 250만원 초과 양도차익에 대해 22%의 양도소득세가 부과됩니다.
                증권거래세 대신 해당 국가의 세금이 적용되며, 수수료율도 국내와 다릅니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="stock-return" />
    </div>
  );
}

function ResultRow({
  label,
  value,
  bold,
  highlight,
  sub,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  sub?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : sub ? "text-gray-500 pl-2" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold" : ""} ${highlight ? "text-red-400" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
