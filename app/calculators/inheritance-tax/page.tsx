"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface InheritanceTaxResult {
  totalAssets: number;
  debts: number;
  netAssets: number;
  basicDeduction: number;
  personalDeduction: number;
  lumpSumDeduction: number;
  spouseDeduction: number;
  totalDeduction: number;
  taxableIncome: number;
  taxRate: number;
  progressiveDeduction: number;
  inheritanceTax: number;
  filingDiscount: number;
  finalTax: number;
}

function calculateInheritanceTax(
  totalAssets: number,
  debts: number,
  hasSpouse: boolean,
  childrenCount: number
): InheritanceTaxResult {
  // 순상속재산
  const netAssets = Math.max(0, totalAssets - debts);

  // 기초공제 2억
  const basicDeduction = 200_000_000;

  // 인적공제: 자녀 1인당 5천만원
  const personalDeduction = childrenCount * 50_000_000;

  // 일괄공제 5억 vs (기초공제 + 인적공제) 중 큰 금액
  const itemizedDeduction = basicDeduction + personalDeduction;
  const lumpSumDeduction = 500_000_000;
  const appliedGeneralDeduction = Math.max(itemizedDeduction, lumpSumDeduction);

  // 배우자공제: 법정상속지분 (최소 5억, 최대 30억)
  // 간이 계산: 배우자 법정상속지분 = 순상속재산 × 배우자지분율
  // 배우자지분율 = 1.5 / (1.5 + 자녀수 × 1) (배우자 1.5, 자녀 각 1)
  let spouseDeduction = 0;
  if (hasSpouse) {
    const spouseShareRate =
      childrenCount > 0 ? 1.5 / (1.5 + childrenCount) : 1;
    const spouseShare = Math.round(netAssets * spouseShareRate);
    spouseDeduction = Math.max(500_000_000, Math.min(spouseShare, 3_000_000_000));
    // 배우자공제는 순상속재산에서 다른 공제를 차감한 금액을 초과할 수 없음
    spouseDeduction = Math.min(spouseDeduction, Math.max(0, netAssets - appliedGeneralDeduction));
    spouseDeduction = Math.max(0, spouseDeduction);
    // 최소 5억 보장 (순상속재산 범위 내)
    if (netAssets >= 500_000_000) {
      spouseDeduction = Math.max(spouseDeduction, 500_000_000);
    }
  }

  const totalDeduction = appliedGeneralDeduction + spouseDeduction;

  // 과세표준
  const taxableIncome = Math.max(0, netAssets - totalDeduction);

  // 상속세율 (증여세와 동일)
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

  const inheritanceTax = Math.round(Math.max(0, tax));
  // 신고세액공제 3%
  const filingDiscount = Math.round(inheritanceTax * 0.03);
  const finalTax = inheritanceTax - filingDiscount;

  return {
    totalAssets,
    debts,
    netAssets,
    basicDeduction,
    personalDeduction,
    lumpSumDeduction: appliedGeneralDeduction,
    spouseDeduction,
    totalDeduction,
    taxableIncome,
    taxRate,
    progressiveDeduction,
    inheritanceTax,
    filingDiscount,
    finalTax,
  };
}

export default function InheritanceTaxCalculator() {
  const [totalAssets, setTotalAssets] = useState("");
  const [debts, setDebts] = useState("");
  const [hasSpouse, setHasSpouse] = useState(true);
  const [childrenCount, setChildrenCount] = useState("2");
  const [result, setResult] = useState<InheritanceTaxResult | null>(null);
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

  const handleCalculate = () => {
    const assets = parseAmount(totalAssets);
    const debt = parseAmount(debts);
    const children = parseInt(childrenCount, 10) || 0;
    if (assets <= 0) {
      setError("상속재산 총액을 입력해주세요");
      return;
    }
    setError("");
    setResult(calculateInheritanceTax(assets, debt, hasSpouse, children));
  };

  const handleReset = () => {
    setTotalAssets("");
    setDebts("");
    setHasSpouse(true);
    setChildrenCount("2");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.finalTax)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [
    { label: "5억", value: 500_000_000 },
    { label: "10억", value: 1_000_000_000 },
    { label: "20억", value: 2_000_000_000 },
    { label: "30억", value: 3_000_000_000 },
    { label: "50억", value: 5_000_000_000 },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">상속세 계산기</h1>
      <p className="text-gray-500 mb-8">
        2025년 기준 상속재산에 대한 상속세를 각종 공제를 적용하여 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상속재산 총액
            </label>
            <div className="relative">
              <input
                type="text"
                value={totalAssets}
                onChange={handleInputChange(setTotalAssets)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                placeholder="예: 1,000,000,000"
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
                  onClick={() =>
                    setTotalAssets(q.value.toLocaleString("ko-KR"))
                  }
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              채무 (부채, 장례비 등)
            </label>
            <div className="relative">
              <input
                type="text"
                value={debts}
                onChange={handleInputChange(setDebts)}
                placeholder="예: 100,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배우자 유무
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHasSpouse(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  hasSpouse
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                있음
              </button>
              <button
                onClick={() => setHasSpouse(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !hasSpouse
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                없음
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자녀 수
            </label>
            <div className="relative">
              <input
                type="text"
                value={childrenCount}
                onChange={handleInputChange(setChildrenCount, true)}
                placeholder="예: 2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                명
              </span>
            </div>
          </div>
        </div>

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
            <p className="text-blue-100 text-sm mb-1">최종 납부 상속세</p>
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
              순상속재산 {formatNumber(result.netAssets)}원 기준
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">계산 내역</h3>
            <div className="space-y-3">
              <Row label="상속재산 총액" value={result.totalAssets} bold />
              <Row label="채무 공제" value={result.debts} />
              <div className="border-t border-gray-100 pt-3">
                <Row label="순상속재산" value={result.netAssets} bold />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row
                  label="일반공제 (기초+인적 또는 일괄공제 중 큰 금액)"
                  value={result.lumpSumDeduction}
                />
                {hasSpouse && (
                  <Row
                    label="배우자 공제"
                    value={result.spouseDeduction}
                  />
                )}
                <Row label="공제 합계" value={result.totalDeduction} bold />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="과세표준" value={result.taxableIncome} bold />
                <Row label="적용 세율" text={`${result.taxRate}%`} />
                <Row
                  label="누진공제"
                  value={result.progressiveDeduction}
                />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="상속세" value={result.inheritanceTax} />
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
            상속세란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            상속세는 피상속인(사망자)의 재산을 상속인이 물려받을 때 부과되는
            세금입니다. 상속재산 총액에서 채무, 각종 공제를 차감한 과세표준에
            세율을 적용하여 계산합니다. 상속개시일이 속하는 달의 말일부터
            6개월 이내에 신고하면 3%의 신고세액공제를 받을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            상속세 공제 항목
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">공제 항목</th>
                  <th className="text-right py-2 px-3 border border-gray-200">금액</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">기초공제</td><td className="text-right py-2 px-3 border border-gray-200">2억원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">자녀공제 (1인당)</td><td className="text-right py-2 px-3 border border-gray-200">5천만원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">일괄공제 (기초+인적 대신 선택 가능)</td><td className="text-right py-2 px-3 border border-gray-200">5억원</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">배우자공제 (법정상속지분)</td><td className="text-right py-2 px-3 border border-gray-200">최소 5억 ~ 최대 30억원</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * 기초공제 + 인적공제와 일괄공제(5억원) 중 큰 금액이 자동으로 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            상속세 세율표
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
              <h3 className="font-medium text-gray-900">상속세 신고 기한은 언제인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">상속개시일(사망일)이 속하는 달의 말일부터 6개월 이내에 신고해야 합니다. 기한 내 신고하면 산출세액의 3%를 공제받을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">배우자공제는 어떻게 계산되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">배우자의 법정상속지분에 해당하는 금액을 공제합니다. 최소 5억원이 보장되며 최대 30억원까지 공제 가능합니다. 배우자 법정상속지분은 자녀 1인당 1, 배우자 1.5의 비율로 계산합니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">일괄공제란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">기초공제(2억원)와 인적공제(자녀 1인당 5천만원 등)를 합산한 금액 대신 5억원을 일괄 공제받을 수 있습니다. 둘 중 유리한 쪽이 자동으로 적용됩니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">상속세를 분할 납부할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">납부세액이 1천만원을 초과하는 경우 2개월 이내에 분할납부할 수 있으며, 2천만원을 초과하면 연부연납(최대 5~10년)도 가능합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="inheritance-tax" />
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
