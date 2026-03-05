"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Relationship =
  | "배우자"
  | "직계존속(성인)"
  | "직계존속(미성년)"
  | "직계비속"
  | "기타친족"
  | "타인";

interface GiftTaxResult {
  giftAmount: number;
  relationship: Relationship;
  deduction: number;
  taxableIncome: number;
  taxRate: number;
  progressiveDeduction: number;
  giftTax: number;
  filingDiscount: number;
  finalTax: number;
}

function getDeduction(relationship: Relationship): number {
  switch (relationship) {
    case "배우자":
      return 600_000_000;
    case "직계존속(성인)":
      return 50_000_000;
    case "직계존속(미성년)":
      return 20_000_000;
    case "직계비속":
      return 50_000_000;
    case "기타친족":
      return 10_000_000;
    case "타인":
      return 0;
  }
}

function calculateGiftTax(
  giftAmount: number,
  relationship: Relationship
): GiftTaxResult {
  const deduction = getDeduction(relationship);
  const taxableIncome = Math.max(0, giftAmount - deduction);

  // 증여세율 + 누진공제
  let taxRate = 0;
  let progressiveDeduction = 0;
  let tax = 0;

  if (taxableIncome <= 100_000_000) {
    taxRate = 10;
    progressiveDeduction = 0;
    tax = taxableIncome * 0.1;
  } else if (taxableIncome <= 500_000_000) {
    taxRate = 20;
    progressiveDeduction = 10_000_000;
    tax = taxableIncome * 0.2 - progressiveDeduction;
  } else if (taxableIncome <= 1_000_000_000) {
    taxRate = 30;
    progressiveDeduction = 60_000_000;
    tax = taxableIncome * 0.3 - progressiveDeduction;
  } else if (taxableIncome <= 3_000_000_000) {
    taxRate = 40;
    progressiveDeduction = 160_000_000;
    tax = taxableIncome * 0.4 - progressiveDeduction;
  } else {
    taxRate = 50;
    progressiveDeduction = 460_000_000;
    tax = taxableIncome * 0.5 - progressiveDeduction;
  }

  const giftTax = Math.round(Math.max(0, tax));
  // 신고세액공제 3%
  const filingDiscount = Math.round(giftTax * 0.03);
  const finalTax = giftTax - filingDiscount;

  return {
    giftAmount,
    relationship,
    deduction,
    taxableIncome,
    taxRate,
    progressiveDeduction,
    giftTax,
    filingDiscount,
    finalTax,
  };
}

export default function GiftTaxCalculator() {
  const [giftAmount, setGiftAmount] = useState("50,000,000");
  const [relationship, setRelationship] =
    useState<Relationship>("직계존속(성인)");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setGiftAmount(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setGiftAmount("");
    }
    setError("");
  };

  const parseAmount = (val: string) =>
    parseInt(val.replace(/,/g, ""), 10) || 0;

  const result = useMemo(() => {
    const amount = parseAmount(giftAmount);
    if (amount <= 0) return null;
    return calculateGiftTax(amount, relationship);
  }, [giftAmount, relationship]);

  const handleReset = () => {
    setGiftAmount("50,000,000");
    setRelationship("직계존속(성인)");
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.finalTax)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relationships: { label: string; value: Relationship }[] = [
    { label: "배우자", value: "배우자" },
    { label: "직계존속 (성인)", value: "직계존속(성인)" },
    { label: "직계존속 (미성년)", value: "직계존속(미성년)" },
    { label: "직계비속", value: "직계비속" },
    { label: "기타 친족", value: "기타친족" },
    { label: "타인", value: "타인" },
  ];

  const quickAmounts = [
    { label: "5천만", value: 50_000_000 },
    { label: "1억", value: 100_000_000 },
    { label: "3억", value: 300_000_000 },
    { label: "5억", value: 500_000_000 },
    { label: "10억", value: 1_000_000_000 },
    { label: "30억", value: 3_000_000_000 },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">증여세 계산기</h1>
      <p className="text-gray-500 mb-8">
        2025년 기준 증여재산가액과 증여자와의 관계에 따른 증여세를 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            증여재산가액
          </label>
          <div className="relative">
            <input
              type="text"
              value={giftAmount}
              onChange={handleInputChange}
              placeholder="예: 500,000,000"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {quickAmounts.map((q) => (
              <button
                key={q.value}
                onClick={() =>
                  setGiftAmount(q.value.toLocaleString("ko-KR"))
                }
                className="calc-preset"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            증여자와의 관계
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {relationships.map((rel) => (
              <button
                key={rel.value}
                onClick={() => setRelationship(rel.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  relationship === rel.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {rel.label}
              </button>
            ))}
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
            <p className="text-blue-100 text-sm mb-1">최종 납부 증여세</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {formatNumber(result.finalTax)}원
              </p>
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
              증여재산 {formatNumber(result.giftAmount)}원 기준
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">계산 내역</h3>
            <div className="space-y-3">
              <Row label="증여재산가액" value={result.giftAmount} bold />
              <Row
                label={`공제액 (${result.relationship})`}
                value={result.deduction}
              />
              <div className="border-t border-gray-100 pt-3">
                <Row label="과세표준" value={result.taxableIncome} bold />
                <Row label="적용 세율" text={`${result.taxRate}%`} />
                <Row
                  label="누진공제"
                  value={result.progressiveDeduction}
                />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="증여세" value={result.giftTax} />
                <Row
                  label="신고세액공제 (3%)"
                  value={result.filingDiscount}
                />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="최종 납부세액" value={result.finalTax} bold />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            증여세란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            증여세는 타인으로부터 재산을 무상으로 받은 경우(증여) 수증자(받는
            사람)에게 부과되는 세금입니다. 증여재산가액에서 관계별 공제액을
            차감한 과세표준에 세율을 적용하여 계산합니다. 증여일이 속하는 달의
            말일부터 3개월 이내에 신고하면 3%의 신고세액공제를 받을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            관계별 증여재산 공제 한도 (10년 합산)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">증여자와의 관계</th>
                  <th className="text-right py-2 px-3 border border-gray-200">공제 한도</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">배우자</td><td className="text-right py-2 px-3 border border-gray-200">6억원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">직계존속 (성인 자녀에게)</td><td className="text-right py-2 px-3 border border-gray-200">5천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">직계존속 (미성년 자녀에게)</td><td className="text-right py-2 px-3 border border-gray-200">2천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">직계비속 (부모에게)</td><td className="text-right py-2 px-3 border border-gray-200">5천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">기타 친족 (6촌 이내)</td><td className="text-right py-2 px-3 border border-gray-200">1천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">타인</td><td className="text-right py-2 px-3 border border-gray-200">없음</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * 공제 한도는 동일 관계의 증여자로부터 10년간 합산하여 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            증여세 세율표
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
                <tr><td className="py-2 px-3 border border-gray-200">1억원 이하</td><td className="text-right py-2 px-3 border border-gray-200">10%</td><td className="text-right py-2 px-3 border border-gray-200">-</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1억~5억원</td><td className="text-right py-2 px-3 border border-gray-200">20%</td><td className="text-right py-2 px-3 border border-gray-200">1천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5억~10억원</td><td className="text-right py-2 px-3 border border-gray-200">30%</td><td className="text-right py-2 px-3 border border-gray-200">6천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">10억~30억원</td><td className="text-right py-2 px-3 border border-gray-200">40%</td><td className="text-right py-2 px-3 border border-gray-200">1억 6천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">30억원 초과</td><td className="text-right py-2 px-3 border border-gray-200">50%</td><td className="text-right py-2 px-3 border border-gray-200">4억 6천만원</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">증여세 신고 기한은 언제인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">증여일이 속하는 달의 말일부터 3개월 이내에 신고해야 합니다. 기한 내 신고하면 산출세액의 3%를 공제받을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">10년 합산 과세란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">동일인(직계존속의 경우 그 배우자 포함)으로부터 10년 이내에 받은 증여재산을 합산하여 세금을 계산합니다. 따라서 공제 한도도 10년 단위로 적용됩니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">부동산을 증여할 때 가액은 어떻게 산정하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">부동산의 증여재산 가액은 시가가 원칙이며, 시가를 알 수 없는 경우 기준시가(공시지가, 공시가격 등)로 평가합니다. 아파트의 경우 국토교통부 실거래가를 참고합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="gift-tax" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">최종 납부 증여세</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNumber(result.finalTax)}원</p>
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
