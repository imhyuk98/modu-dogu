"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type TransactionType = "매매" | "전세" | "월세";

interface BrokerageResult {
  transactionAmount: number;
  rate: number;
  fee: number;
  vat: number;
  total: number;
}

function calculateBrokerageFee(
  type: TransactionType,
  amount: number,
  deposit?: number,
  monthlyRent?: number
): BrokerageResult {
  let targetAmount = amount;

  if (type === "월세" && deposit !== undefined && monthlyRent !== undefined) {
    // 환산보증금 = 보증금 + (월세 × 100)
    targetAmount = deposit + monthlyRent * 100;
  }

  let rate = 0;
  let limit = Infinity;

  if (type === "매매") {
    if (targetAmount < 50_000_000) {
      rate = 0.006;
      limit = 250_000;
    } else if (targetAmount < 200_000_000) {
      rate = 0.005;
      limit = 800_000;
    } else if (targetAmount < 900_000_000) {
      rate = 0.004;
    } else if (targetAmount < 1_200_000_000) {
      rate = 0.005;
    } else if (targetAmount < 1_500_000_000) {
      rate = 0.006;
    } else {
      rate = 0.007;
    }
  } else {
    // 전세 또는 월세(환산보증금 기준)
    if (targetAmount < 50_000_000) {
      rate = 0.005;
      limit = 200_000;
    } else if (targetAmount < 100_000_000) {
      rate = 0.004;
      limit = 300_000;
    } else if (targetAmount < 600_000_000) {
      rate = 0.003;
    } else if (targetAmount < 1_200_000_000) {
      rate = 0.004;
    } else if (targetAmount < 1_500_000_000) {
      rate = 0.005;
    } else {
      rate = 0.006;
    }
  }

  let fee = Math.round(targetAmount * rate);
  if (limit !== Infinity) {
    fee = Math.min(fee, limit);
  }

  const vat = Math.round(fee * 0.1);
  const total = fee + vat;

  return {
    transactionAmount: targetAmount,
    rate: rate * 100,
    fee,
    vat,
    total,
  };
}

export default function BrokerageFeeCalculator() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("매매");
  const [amount, setAmount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [result, setResult] = useState<BrokerageResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange = (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setter(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setter("");
    }
    setError("");
  };

  const parseAmount = (val: string) =>
    parseInt(val.replace(/,/g, ""), 10) || 0;

  const handleCalculate = () => {
    if (transactionType === "월세") {
      const dep = parseAmount(deposit);
      const rent = parseAmount(monthlyRent);
      if (dep <= 0 && rent <= 0) {
        setError("보증금 또는 월세를 입력해주세요");
        return;
      }
      setError("");
      setResult(calculateBrokerageFee("월세", 0, dep, rent));
    } else {
      const amt = parseAmount(amount);
      if (amt <= 0) {
        setError("거래금액을 입력해주세요");
        return;
      }
      setError("");
      setResult(calculateBrokerageFee(transactionType, amt));
    }
  };

  const handleReset = () => {
    setTransactionType("매매");
    setAmount("");
    setDeposit("");
    setMonthlyRent("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.total)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [
    { label: "1억", value: 100_000_000 },
    { label: "3억", value: 300_000_000 },
    { label: "5억", value: 500_000_000 },
    { label: "9억", value: 900_000_000 },
    { label: "12억", value: 1_200_000_000 },
    { label: "15억", value: 1_500_000_000 },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        부동산 중개수수료 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        2025년 기준 매매, 전세, 월세 거래의 중개수수료(복비)를 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 거래 유형 선택 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          거래 유형
        </label>
        <div className="flex gap-2 mb-6">
          {(["매매", "전세", "월세"] as TransactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTransactionType(type);
                setResult(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                transactionType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {transactionType === "월세" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보증금
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deposit}
                  onChange={handleInputChange(setDeposit)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                  placeholder="예: 10,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  원
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월세
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={monthlyRent}
                  onChange={handleInputChange(setMonthlyRent)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                  placeholder="예: 500,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  원
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래금액
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleInputChange(setAmount)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                placeholder="예: 500,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((q) => (
                <button
                  key={q.value}
                  onClick={() => {
                    setAmount(q.value.toLocaleString("ko-KR"));
                    setResult(
                      calculateBrokerageFee(transactionType, q.value)
                    );
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            계산하기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">중개수수료 합계 (부가세 포함)</p>
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
              거래금액 {formatNumber(result.transactionAmount)}원 기준
              {transactionType === "월세" && " (환산보증금)"}
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">수수료 내역</h3>
            <div className="space-y-3">
              <Row label="거래 유형" text={transactionType} />
              <Row
                label={transactionType === "월세" ? "환산보증금" : "거래금액"}
                value={result.transactionAmount}
                bold
              />
              <div className="border-t border-gray-100 pt-3">
                <Row label="적용 요율" text={`${result.rate}%`} />
                <Row label="중개수수료" value={result.fee} />
                <Row label="부가세 (10%)" value={result.vat} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="합계" value={result.total} bold />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            부동산 중개수수료란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            부동산 중개수수료(중개보수)는 부동산 거래 시 공인중개사에게 지급하는
            보수입니다. 거래 유형(매매, 전세, 월세)과 거래금액에 따라 상한요율이
            다르게 적용되며, 부가가치세 10%가 별도로 부과됩니다. 중개수수료는
            매도인과 매수인(또는 임대인과 임차인) 각각이 부담합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2025년 매매 중개수수료 요율표
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">거래금액</th>
                  <th className="text-right py-2 px-3 border border-gray-200">상한요율</th>
                  <th className="text-right py-2 px-3 border border-gray-200">한도액</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">5천만원 미만</td><td className="text-right py-2 px-3 border border-gray-200">0.6%</td><td className="text-right py-2 px-3 border border-gray-200">25만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5천만원 ~ 2억원</td><td className="text-right py-2 px-3 border border-gray-200">0.5%</td><td className="text-right py-2 px-3 border border-gray-200">80만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">2억원 ~ 9억원</td><td className="text-right py-2 px-3 border border-gray-200">0.4%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">9억원 ~ 12억원</td><td className="text-right py-2 px-3 border border-gray-200">0.5%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">12억원 ~ 15억원</td><td className="text-right py-2 px-3 border border-gray-200">0.6%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">15억원 이상</td><td className="text-right py-2 px-3 border border-gray-200">0.7%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2025년 전세/월세 중개수수료 요율표
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">거래금액</th>
                  <th className="text-right py-2 px-3 border border-gray-200">상한요율</th>
                  <th className="text-right py-2 px-3 border border-gray-200">한도액</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">5천만원 미만</td><td className="text-right py-2 px-3 border border-gray-200">0.5%</td><td className="text-right py-2 px-3 border border-gray-200">20만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5천만원 ~ 1억원</td><td className="text-right py-2 px-3 border border-gray-200">0.4%</td><td className="text-right py-2 px-3 border border-gray-200">30만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1억원 ~ 6억원</td><td className="text-right py-2 px-3 border border-gray-200">0.3%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">6억원 ~ 12억원</td><td className="text-right py-2 px-3 border border-gray-200">0.4%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">12억원 ~ 15억원</td><td className="text-right py-2 px-3 border border-gray-200">0.5%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">15억원 이상</td><td className="text-right py-2 px-3 border border-gray-200">0.6%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            월세 환산보증금이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            월세 거래 시 중개수수료는 환산보증금을 기준으로 계산합니다.
            환산보증금은 &quot;보증금 + (월세 x 100)&quot;으로 산출하며, 이 금액에
            전세 요율표를 적용합니다. 예를 들어 보증금 1,000만원에 월세 50만원이면
            환산보증금은 1,000만 + 5,000만 = 6,000만원이 됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">중개수수료는 누가 부담하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">매매의 경우 매도인과 매수인이 각각 중개수수료를 부담합니다. 임대차의 경우 임대인과 임차인이 각각 부담합니다. 위 계산 결과는 한쪽이 부담하는 금액입니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">부가세는 별도인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">공인중개사가 일반과세자인 경우 부가가치세 10%가 별도로 부과됩니다. 간이과세자인 경우 부가세가 면제될 수 있으므로 중개사에게 확인하세요.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">중개수수료를 협상할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">위 요율표는 상한요율입니다. 실제 수수료는 상한요율 범위 내에서 중개사와 의뢰인이 협의하여 결정할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="brokerage-fee" />
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
