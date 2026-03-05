"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type HousingCount = "1주택" | "2주택" | "3주택 이상";

interface AcquisitionTaxResult {
  housePrice: number;
  acquisitionTaxRate: number;
  acquisitionTax: number;
  ruralSpecialTax: number;
  localEducationTax: number;
  total: number;
}

function calculateAcquisitionTax(
  housePrice: number,
  area: number,
  housingCount: HousingCount,
  isRegulated: boolean
): AcquisitionTaxResult {
  let taxRate = 0;

  if (housingCount === "1주택") {
    if (housePrice <= 600_000_000) {
      taxRate = 1;
    } else if (housePrice <= 900_000_000) {
      // 6~9억 구간: 1~3% 선형 보간
      taxRate = 1 + ((housePrice - 600_000_000) / 300_000_000) * 2;
    } else {
      taxRate = 3;
    }
  } else if (housingCount === "2주택") {
    if (isRegulated) {
      taxRate = 8;
    } else {
      if (housePrice <= 600_000_000) {
        taxRate = 1;
      } else if (housePrice <= 900_000_000) {
        taxRate = 1 + ((housePrice - 600_000_000) / 300_000_000) * 2;
      } else {
        taxRate = 3;
      }
    }
  } else {
    // 3주택 이상
    taxRate = isRegulated ? 12 : 8;
  }

  const acquisitionTax = Math.round(housePrice * (taxRate / 100));

  // 농어촌특별세: 85㎡ 이하 면제, 초과 0.2%
  const ruralSpecialTax =
    area <= 85 ? 0 : Math.round(housePrice * 0.002);

  // 지방교육세: 취득세율의 10% (취득세율이 1~3%면 0.1~0.3%)
  const localEducationTaxRate = taxRate * 0.1;
  const localEducationTax = Math.round(
    housePrice * (localEducationTaxRate / 100)
  );

  const total = acquisitionTax + ruralSpecialTax + localEducationTax;

  return {
    housePrice,
    acquisitionTaxRate: Math.round(taxRate * 100) / 100,
    acquisitionTax,
    ruralSpecialTax,
    localEducationTax,
    total,
  };
}

export default function AcquisitionTaxCalculator() {
  const [price, setPrice] = useState("500,000,000");
  const [area, setArea] = useState("84");
  const [housingCount, setHousingCount] = useState<HousingCount>("1주택");
  const [isRegulated, setIsRegulated] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange =
    (setter: (val: string) => void, allowDecimal = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (allowDecimal) {
        const raw = e.target.value.replace(/[^0-9.]/g, "");
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
    const p = parseAmount(price);
    const a = parseFloat(area) || 0;
    if (p <= 0) return null;
    return calculateAcquisitionTax(p, a, housingCount, isRegulated);
  }, [price, area, housingCount, isRegulated]);

  const handleReset = () => {
    setPrice("500,000,000");
    setArea("84");
    setHousingCount("1주택");
    setIsRegulated(false);
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.total)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrices = [
    { label: "3억", value: 300_000_000 },
    { label: "6억", value: 600_000_000 },
    { label: "9억", value: 900_000_000 },
    { label: "12억", value: 1_200_000_000 },
    { label: "15억", value: 1_500_000_000 },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        부동산 취득세 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        2025년 기준 주택 취득세, 농어촌특별세, 지방교육세를 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주택 가격
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={handleInputChange(setPrice)}

                placeholder="예: 500,000,000"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrices.map((q) => (
                <button
                  key={q.value}
                  onClick={() =>
                    setPrice(q.value.toLocaleString("ko-KR"))
                  }
                  className="calc-preset"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주택 면적
            </label>
            <div className="relative">
              <input
                type="text"
                value={area}
                onChange={handleInputChange(setArea, true)}
                placeholder="예: 84"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ㎡
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              85㎡ 이하 시 농어촌특별세 면제
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주택 수
            </label>
            <div className="flex gap-2">
              {(["1주택", "2주택", "3주택 이상"] as HousingCount[]).map(
                (count) => (
                  <button
                    key={count}
                    onClick={() => setHousingCount(count)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      housingCount === count
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {count}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              조정대상지역 여부
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRegulated(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isRegulated
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                비조정지역
              </button>
              <button
                onClick={() => setIsRegulated(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRegulated
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                조정대상지역
              </button>
            </div>
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
            <p className="text-blue-100 text-sm mb-1">취득 시 납부 세금 합계</p>
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
              주택 가격 {formatNumber(result.housePrice)}원 기준
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">세금 내역</h3>
            <div className="space-y-3">
              <Row label="주택 가격" value={result.housePrice} bold />
              <Row label="적용 취득세율" text={`${result.acquisitionTaxRate}%`} />
              <div className="border-t border-gray-100 pt-3">
                <Row label="취득세" value={result.acquisitionTax} />
                <Row label="농어촌특별세" value={result.ruralSpecialTax} />
                <Row label="지방교육세" value={result.localEducationTax} />
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
            부동산 취득세란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            취득세는 부동산을 취득할 때 납부하는 지방세입니다. 주택의 경우 주택
            가격, 보유 주택 수, 조정대상지역 여부에 따라 세율이 달라집니다.
            취득세 외에도 농어촌특별세와 지방교육세가 함께 부과되며, 취득일로부터
            60일 이내에 신고 및 납부해야 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            주택 수별 취득세율 (2025년 기준)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="text-right py-2 px-3 border border-gray-200">비조정지역</th>
                  <th className="text-right py-2 px-3 border border-gray-200">조정대상지역</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">1주택 (6억 이하)</td><td className="text-right py-2 px-3 border border-gray-200">1%</td><td className="text-right py-2 px-3 border border-gray-200">1%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1주택 (6~9억)</td><td className="text-right py-2 px-3 border border-gray-200">1~3%</td><td className="text-right py-2 px-3 border border-gray-200">1~3%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1주택 (9억 초과)</td><td className="text-right py-2 px-3 border border-gray-200">3%</td><td className="text-right py-2 px-3 border border-gray-200">3%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">2주택</td><td className="text-right py-2 px-3 border border-gray-200">1~3%</td><td className="text-right py-2 px-3 border border-gray-200">8%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">3주택 이상</td><td className="text-right py-2 px-3 border border-gray-200">8%</td><td className="text-right py-2 px-3 border border-gray-200">12%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">농어촌특별세는 모든 주택에 적용되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">전용면적 85㎡ 이하의 주택은 농어촌특별세가 면제됩니다. 85㎡를 초과하는 경우 취득가액의 0.2%가 부과됩니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">조정대상지역이란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">주택 가격 상승률이 높은 지역으로 정부가 지정하는 지역입니다. 조정대상지역에서 다주택을 취득하면 중과세율이 적용됩니다. 지정 현황은 국토교통부 홈페이지에서 확인할 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">취득세 납부 기한은?</h3>
              <p className="text-gray-600 text-sm mt-1">부동산 취득일(잔금 지급일 또는 등기일 중 빠른 날)로부터 60일 이내에 신고 및 납부해야 합니다. 기한을 초과하면 가산세가 부과됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="acquisition-tax" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">취득세 합계</p>
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
