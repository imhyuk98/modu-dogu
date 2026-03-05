"use client";

import { useState, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

interface Purchase {
  id: number;
  price: string;
  quantity: string;
}

interface AveragePriceResult {
  averagePrice: number;
  totalAmount: number;
  totalQuantity: number;
  purchases: { order: number; price: number; quantity: number; amount: number; weight: number }[];
}

function calculateAveragePrice(purchases: Purchase[]): AveragePriceResult | null {
  const parsed = purchases
    .map((p, i) => ({
      order: i + 1,
      price: parseInt(p.price.replace(/,/g, ""), 10) || 0,
      quantity: parseInt(p.quantity.replace(/,/g, ""), 10) || 0,
    }))
    .filter((p) => p.price > 0 && p.quantity > 0);

  if (parsed.length === 0) return null;

  const totalAmount = parsed.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQuantity = parsed.reduce((sum, p) => sum + p.quantity, 0);
  const averagePrice = totalQuantity > 0 ? Math.round(totalAmount / totalQuantity) : 0;

  const purchaseDetails = parsed.map((p) => ({
    ...p,
    amount: p.price * p.quantity,
    weight: totalAmount > 0 ? Math.round((p.price * p.quantity / totalAmount) * 1000) / 10 : 0,
  }));

  return { averagePrice, totalAmount, totalQuantity, purchases: purchaseDetails };
}

export default function AveragePriceCalculator() {
  const nextIdRef = useRef(3);
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 1, price: "", quantity: "" },
    { id: 2, price: "", quantity: "" },
  ]);
  const [result, setResult] = useState<AveragePriceResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    const text = `평균단가: ${formatNumber(result.averagePrice)}원 (총 ${formatNumber(result.totalQuantity)}주 / 총 ${formatNumber(result.totalAmount)}원)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleNumberInput = (
    id: number,
    field: "price" | "quantity",
    value: string
  ) => {
    const raw = value.replace(/[^0-9]/g, "");
    const formatted = raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "";
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: formatted } : p))
    );
  };

  const addPurchase = () => {
    setPurchases((prev) => [...prev, { id: nextIdRef.current++, price: "", quantity: "" }]);
  };

  const removePurchase = (id: number) => {
    if (purchases.length <= 2) return;
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCalculate = () => {
    const r = calculateAveragePrice(purchases);
    setResult(r);
  };

  const handleReset = () => {
    setPurchases([
      { id: nextIdRef.current++, price: "", quantity: "" },
      { id: nextIdRef.current++, price: "", quantity: "" },
    ]);
    setResult(null);
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        물타기 계산기 (평균단가 계산)
      </h1>
      <p className="text-gray-500 mb-8">
        주식 추가 매수(물타기) 시 평균단가와 각 매수 차수별 비중을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          {purchases.map((purchase, index) => (
            <div key={purchase.id} className="flex items-end gap-3">
              <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-700 pb-3">
                {index + 1}차 매수
              </div>
              <div className="flex-1">
                {index === 0 && (
                  <label className="block text-xs text-gray-500 mb-1">매수가</label>
                )}
                <div className="relative">
                  <input
                    type="text"
                    value={purchase.price}
                    onChange={(e) =>
                      handleNumberInput(purchase.id, "price", e.target.value)
                    }
                    placeholder="매수가"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    원
                  </span>
                </div>
              </div>
              <div className="flex-1">
                {index === 0 && (
                  <label className="block text-xs text-gray-500 mb-1">수량</label>
                )}
                <div className="relative">
                  <input
                    type="text"
                    value={purchase.quantity}
                    onChange={(e) =>
                      handleNumberInput(purchase.id, "quantity", e.target.value)
                    }
                    placeholder="수량"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    주
                  </span>
                </div>
              </div>
              <button
                onClick={() => removePurchase(purchase.id)}
                disabled={purchases.length <= 2}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
                title="삭제"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={addPurchase}
            className="flex-1 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 font-medium rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
          >
            + 추가 매수
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCalculate}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            계산하기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">평균단가</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {formatNumber(result.averagePrice)}원
              </p>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-blue-300 rounded hover:bg-white/20 transition-colors text-blue-100"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              총 {formatNumber(result.totalQuantity)}주 / 총{" "}
              {formatNumber(result.totalAmount)}원
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">매수 내역</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 border border-gray-200">차수</th>
                    <th className="text-right py-2 px-3 border border-gray-200">매수가</th>
                    <th className="text-right py-2 px-3 border border-gray-200">수량</th>
                    <th className="text-right py-2 px-3 border border-gray-200">매수금액</th>
                    <th className="text-right py-2 px-3 border border-gray-200">비중</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {result.purchases.map((p) => (
                    <tr key={p.order}>
                      <td className="py-2 px-3 border border-gray-200">
                        {p.order}차
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {formatNumber(p.price)}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {formatNumber(p.quantity)}주
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {formatNumber(p.amount)}원
                      </td>
                      <td className="text-right py-2 px-3 border border-gray-200">
                        {p.weight}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-2 px-3 border border-gray-200">합계</td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      {formatNumber(result.averagePrice)}원
                    </td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      {formatNumber(result.totalQuantity)}주
                    </td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      {formatNumber(result.totalAmount)}원
                    </td>
                    <td className="text-right py-2 px-3 border border-gray-200">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 비중 시각화 */}
            <div className="mt-4 space-y-2">
              {result.purchases.map((p) => (
                <div key={p.order} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12">{p.order}차</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.weight}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{p.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            물타기(평균단가 낮추기)란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            물타기는 주식 투자에서 보유 종목의 주가가 하락했을 때 추가로
            매수하여 평균 매입 단가를 낮추는 전략입니다. 평균단가가
            낮아지면 주가가 조금만 반등해도 수익으로 전환될 가능성이
            높아집니다. 하지만 하락 추세가 지속되면 손실이 커질 수 있으므로
            신중한 판단이 필요합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            평균단가 계산 공식
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 font-mono text-sm">
              평균단가 = 총 매수금액 / 총 매수 수량
            </p>
            <p className="text-gray-500 text-sm mt-2">
              예: 1차 매수 10,000원 x 100주 + 2차 매수 8,000원 x 100주 = 총 1,800,000원 / 200주 = 평균단가 9,000원
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            물타기 투자 시 주의사항
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">1. 기업 분석이 선행되어야 합니다.</strong>{" "}
              단순히 주가가 하락했다고 물타기를 하면 안 됩니다. 기업의 펀더멘털이 건전한지 확인하세요.
            </p>
            <p>
              <strong className="text-gray-900">2. 분할 매수를 권장합니다.</strong>{" "}
              한 번에 큰 금액을 투자하기보다 여러 차례에 나눠 매수하는 것이 리스크를 줄이는 방법입니다.
            </p>
            <p>
              <strong className="text-gray-900">3. 손절 기준을 정해두세요.</strong>{" "}
              무한 물타기는 큰 손실로 이어질 수 있습니다. 미리 손절 기준을 정하고 지키는 것이 중요합니다.
            </p>
            <p>
              <strong className="text-gray-900">4. 투자 비중을 확인하세요.</strong>{" "}
              한 종목에 자산이 과도하게 집중되지 않도록 포트폴리오 비중을 관리하세요.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">물타기와 불타기의 차이는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                물타기는 주가 하락 시 추가 매수하여 평균단가를 낮추는 것이고,
                불타기는 주가 상승 시 추가 매수하여 수익을 극대화하는 전략입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">수수료는 계산에 포함되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                본 계산기는 순수한 평균단가만 계산합니다. 실제 투자 시에는 매수 수수료가
                추가되므로 실질 평균단가는 약간 더 높을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="average-price" />
    </div>
  );
}
