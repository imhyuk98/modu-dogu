"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

const REGIONS = ["서울/경기", "충청", "경상", "전라", "강원", "제주"] as const;
type Region = (typeof REGIONS)[number];

interface CarrierResult {
  name: string;
  price: number;
  note: string;
}

// CJ대한통운, 한진택배, 롯데택배: 크기(가로+세로+높이) 기반 요금
// 우체국택배: 무게 기반 요금
const SIZE_TIERS = [
  { maxSize: 60, cj: 4000, hanjin: 4500, lotte: 4000 },
  { maxSize: 80, cj: 5000, hanjin: 5500, lotte: 5000 },
  { maxSize: 100, cj: 6000, hanjin: 6500, lotte: 6000 },
  { maxSize: 120, cj: 7000, hanjin: 7500, lotte: 7000 },
  { maxSize: 140, cj: 9000, hanjin: 9500, lotte: 9000 },
  { maxSize: 160, cj: 11000, hanjin: 11500, lotte: 11000 },
];

const WEIGHT_TIERS_POST = [
  { maxKg: 2, price: 4000 },
  { maxKg: 5, price: 5000 },
  { maxKg: 10, price: 6500 },
  { maxKg: 20, price: 8000 },
  { maxKg: 30, price: 10000 },
];

const JEJU_EXTRA = 3000;

function getSizeBasedPrice(totalSize: number, carrier: "cj" | "hanjin" | "lotte"): { price: number; tier: string } | null {
  for (const tier of SIZE_TIERS) {
    if (totalSize <= tier.maxSize) {
      return { price: tier[carrier], tier: `${tier.maxSize}cm 이하` };
    }
  }
  return null; // 160cm 초과 — 배송 불가
}

function getPostPrice(appliedWeight: number): { price: number; tier: string } | null {
  for (const tier of WEIGHT_TIERS_POST) {
    if (appliedWeight <= tier.maxKg) {
      return { price: tier.price, tier: `${tier.maxKg}kg 이하` };
    }
  }
  return null; // 30kg 초과 — 배송 불가
}

function calculateShipping(
  width: number,
  length: number,
  height: number,
  actualWeight: number,
  from: Region,
  to: Region
): {
  volumeWeight: number;
  appliedWeight: number;
  totalSize: number;
  carriers: CarrierResult[];
  cheapest: string;
} {
  const volumeWeight = Math.round(((width * length * height) / 6000) * 100) / 100;
  const appliedWeight = Math.max(actualWeight, volumeWeight);
  const totalSize = width + length + height;
  const isJeju = from === "제주" || to === "제주";

  const carriers: CarrierResult[] = [];

  // CJ대한통운
  const cjResult = getSizeBasedPrice(totalSize, "cj");
  if (cjResult) {
    const extra = isJeju ? JEJU_EXTRA : 0;
    carriers.push({
      name: "CJ대한통운",
      price: cjResult.price + extra,
      note: `크기 ${cjResult.tier}${isJeju ? " + 제주 추가" : ""}`,
    });
  } else {
    carriers.push({ name: "CJ대한통운", price: -1, note: "160cm 초과 — 일반택배 불가" });
  }

  // 한진택배
  const hanjinResult = getSizeBasedPrice(totalSize, "hanjin");
  if (hanjinResult) {
    const extra = isJeju ? JEJU_EXTRA : 0;
    carriers.push({
      name: "한진택배",
      price: hanjinResult.price + extra,
      note: `크기 ${hanjinResult.tier}${isJeju ? " + 제주 추가" : ""}`,
    });
  } else {
    carriers.push({ name: "한진택배", price: -1, note: "160cm 초과 — 일반택배 불가" });
  }

  // 롯데택배
  const lotteResult = getSizeBasedPrice(totalSize, "lotte");
  if (lotteResult) {
    const extra = isJeju ? JEJU_EXTRA : 0;
    carriers.push({
      name: "롯데택배",
      price: lotteResult.price + extra,
      note: `크기 ${lotteResult.tier}${isJeju ? " + 제주 추가" : ""}`,
    });
  } else {
    carriers.push({ name: "롯데택배", price: -1, note: "160cm 초과 — 일반택배 불가" });
  }

  // 우체국택배 (무게 기반)
  const postResult = getPostPrice(appliedWeight);
  if (postResult) {
    const extra = isJeju ? JEJU_EXTRA : 0;
    carriers.push({
      name: "우체국택배",
      price: postResult.price + extra,
      note: `무게 ${postResult.tier}${isJeju ? " + 제주 추가" : ""}`,
    });
  } else {
    carriers.push({ name: "우체국택배", price: -1, note: "30kg 초과 — 일반소포 불가" });
  }

  // 가장 저렴한 택배사
  const validCarriers = carriers.filter((c) => c.price > 0);
  const cheapest = validCarriers.length > 0
    ? validCarriers.reduce((a, b) => (a.price <= b.price ? a : b)).name
    : "";

  return { volumeWeight, appliedWeight, totalSize, carriers, cheapest };
}

export default function ShippingCalculator() {
  const [width, setWidth] = useState("30");
  const [length, setLength] = useState("20");
  const [height, setHeight] = useState("15");
  const [actualWeight, setActualWeight] = useState("3");
  const [fromRegion, setFromRegion] = useState<Region>("서울/경기");
  const [toRegion, setToRegion] = useState<Region>("서울/경기");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    const h = parseFloat(height);
    const wt = parseFloat(actualWeight);
    if (!w || !l || !h || !wt || w <= 0 || l <= 0 || h <= 0 || wt <= 0) return null;
    return calculateShipping(w, l, h, wt, fromRegion, toRegion);
  }, [width, length, height, actualWeight, fromRegion, toRegion]);

  const handleReset = () => {
    setWidth("");
    setLength("");
    setHeight("");
    setActualWeight("");
    setFromRegion("서울/경기");
    setToRegion("서울/경기");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const lines = result.carriers
      .map((c) => `${c.name}: ${c.price > 0 ? c.price.toLocaleString() + "원" : "배송 불가"} (${c.note})`)
      .join("\n");
    const text = `택배 배송비 비교\n크기: ${width}×${length}×${height}cm (합계 ${result.totalSize}cm)\n실제무게: ${actualWeight}kg / 부피무게: ${result.volumeWeight}kg\n적용무게: ${result.appliedWeight}kg\n${fromRegion} → ${toRegion}\n\n${lines}\n\n가장 저렴: ${result.cheapest}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">택배 배송비 계산기</h1>
      <p className="text-gray-500 mb-8">
        택배 크기와 무게를 입력하면 주요 택배사별 예상 요금을 비교할 수 있습니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        {/* 크기 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">택배 크기</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="가로"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="세로"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="높이"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
            </div>
          </div>
        </div>

        {/* 무게 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">실제 무게</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
              placeholder="3"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">출발 지역</label>
            <select
              value={fromRegion}
              onChange={(e) => setFromRegion(e.target.value as Region)}
              className="calc-input"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">도착 지역</label>
            <select
              value={toRegion}
              onChange={(e) => setToRegion(e.target.value as Region)}
              className="calc-input"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">초기화</button>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          {/* 요약 헤더 */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">가장 저렴한 택배사</p>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-3xl font-bold">
              {result.cheapest || "배송 불가"}
            </p>
            {result.cheapest && (
              <p className="text-xl font-semibold mt-1">
                {result.carriers.find((c) => c.name === result.cheapest)?.price.toLocaleString()}원
              </p>
            )}
          </div>

          {/* 무게 비교 */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">무게·크기 정보</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">크기 합계</p>
                <p className="text-lg font-bold text-gray-900">{result.totalSize}cm</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">실제 무게</p>
                <p className="text-lg font-bold text-gray-900">{actualWeight}kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">부피 무게</p>
                <p className="text-lg font-bold text-gray-900">{result.volumeWeight}kg</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 mb-1">적용 무게</p>
                <p className="text-lg font-bold text-blue-700">{result.appliedWeight}kg</p>
              </div>
            </div>
          </div>

          {/* 택배사별 비교 테이블 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">택배사별 예상 요금</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 border border-gray-200">택배사</th>
                    <th className="text-right py-3 px-4 border border-gray-200">예상 요금</th>
                    <th className="text-left py-3 px-4 border border-gray-200">적용 기준</th>
                  </tr>
                </thead>
                <tbody>
                  {result.carriers.map((carrier) => {
                    const isCheapest = carrier.name === result.cheapest;
                    return (
                      <tr
                        key={carrier.name}
                        className={isCheapest ? "bg-blue-50" : ""}
                      >
                        <td className="py-3 px-4 border border-gray-200 font-medium text-gray-900">
                          {carrier.name}
                          {isCheapest && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">최저가</span>
                          )}
                        </td>
                        <td className={`text-right py-3 px-4 border border-gray-200 font-bold ${carrier.price > 0 ? (isCheapest ? "text-blue-700" : "text-gray-900") : "text-red-500"}`}>
                          {carrier.price > 0 ? `${carrier.price.toLocaleString()}원` : "배송 불가"}
                        </td>
                        <td className="py-3 px-4 border border-gray-200 text-gray-500">{carrier.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 요금표 안내 */}
      <div className="calc-card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">주요 택배사 요금표 (2026년 기준, 일반 택배)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border border-gray-200">크기 (합계)</th>
                <th className="text-right py-2 px-3 border border-gray-200">CJ대한통운</th>
                <th className="text-right py-2 px-3 border border-gray-200">한진택배</th>
                <th className="text-right py-2 px-3 border border-gray-200">롯데택배</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {SIZE_TIERS.map((tier) => (
                <tr key={tier.maxSize}>
                  <td className="py-2 px-3 border border-gray-200">~{tier.maxSize}cm</td>
                  <td className="text-right py-2 px-3 border border-gray-200">{tier.cj.toLocaleString()}원</td>
                  <td className="text-right py-2 px-3 border border-gray-200">{tier.hanjin.toLocaleString()}원</td>
                  <td className="text-right py-2 px-3 border border-gray-200">{tier.lotte.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-gray-900 mt-6 mb-4">우체국택배 요금표 (무게 기준)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border border-gray-200">무게</th>
                <th className="text-right py-2 px-3 border border-gray-200">요금</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {WEIGHT_TIERS_POST.map((tier) => (
                <tr key={tier.maxKg}>
                  <td className="py-2 px-3 border border-gray-200">~{tier.maxKg}kg</td>
                  <td className="text-right py-2 px-3 border border-gray-200">{tier.price.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          * 요금은 개인 일반 택배 기준 예상 요금이며, 실제 요금은 택배사·계약 조건에 따라 다를 수 있습니다.<br />
          * 제주 지역 발송/수령 시 3,000원 추가됩니다.
        </p>
      </div>

      {/* 모바일 하단 고정 바 */}
      {result && result.cheapest && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">최저가 ({result.cheapest})</p>
              <p className="text-lg font-extrabold text-blue-600">
                {result.carriers.find((c) => c.name === result.cheapest)?.price.toLocaleString()}원
              </p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">택배 배송비 계산 방법</h2>
          <p className="text-gray-600 leading-relaxed">
            택배 요금은 <strong>실제 무게</strong>와 <strong>부피 무게</strong> 중 큰 값을 기준으로 산정됩니다.
            부피 무게는 <strong>가로(cm) x 세로(cm) x 높이(cm) / 6,000</strong>으로 계산하며,
            부피가 크지만 가벼운 물건(예: 이불, 쿠션)은 부피 무게가 적용될 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            CJ대한통운, 한진택배, 롯데택배는 주로 <strong>크기(가로+세로+높이 합계)</strong> 기준으로 요금을 산정하고,
            우체국택배는 <strong>무게</strong> 기준으로 요금을 책정합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">택배비 절약 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span>박스 크기를 물건에 맞게 줄이면 크기 기준 요금을 낮출 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span>편의점 택배(CU, GS25)를 이용하면 일반 택배보다 저렴한 경우가 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span>택배사 멤버십이나 대량 발송 계약을 하면 할인을 받을 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span>무거운 물건은 우체국택배가, 부피가 큰 물건은 CJ대한통운이나 롯데택배가 유리할 수 있습니다.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">부피무게란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                부피무게는 택배 상자의 부피를 무게로 환산한 값입니다. 가로 x 세로 x 높이(cm)를 6,000으로 나눠 kg 단위로 변환합니다.
                부피가 크지만 가벼운 물건의 경우 실제 무게 대신 부피무게가 적용되어 요금이 높아질 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">제주도 택배비는 왜 더 비싼가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                제주도는 해상 또는 항공 운송이 필요하기 때문에 일반적으로 3,000원의 추가 요금이 발생합니다.
                도서산간 지역은 추가 요금이 더 높을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">택배 크기 제한은 어느 정도인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                대부분의 택배사는 가로+세로+높이 합계 160cm 이내, 무게 30kg 이내의 물건을 일반 택배로 취급합니다.
                이를 초과하는 경우 화물 배송을 이용해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="shipping" />
    </div>
  );
}
