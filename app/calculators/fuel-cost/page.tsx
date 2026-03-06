"use client";

import { useState, useEffect, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type FuelType = "gasoline" | "diesel" | "lpg";

const FUEL_LABELS: Record<FuelType, string> = {
  gasoline: "휘발유",
  diesel: "경유",
  lpg: "LPG",
};

const DEFAULT_PRICES: Record<FuelType, number> = {
  gasoline: 1650,
  diesel: 1500,
  lpg: 1050,
};

interface FuelPriceData {
  updatedAt: string;
  tradeDate: string;
  gasoline: { price: number; diff: number };
  diesel: { price: number; diff: number };
  lpg: { price: number; diff: number };
}

const EFFICIENCY_PRESETS = [8, 10, 12, 15, 20];

const DISTANCE_PRESETS = [
  { label: "출퇴근", km: 20 },
  { label: "시내", km: 50 },
  { label: "시외", km: 100 },
  { label: "장거리", km: 300 },
];

function formatNumber(num: number) {
  return num.toLocaleString("ko-KR");
}

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("12");
  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [fuelPrice, setFuelPrice] = useState("1,650");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [monthlyDistance, setMonthlyDistance] = useState("1,000");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [livePrices, setLivePrices] = useState<FuelPriceData | null>(null);

  // 실시간 유가 로드
  useEffect(() => {
    fetch("/fuel-prices.json")
      .then((r) => r.json())
      .then((data: FuelPriceData) => {
        setLivePrices(data);
        // 현재 유종의 가격을 실시간 가격으로 업데이트
        const livePrice = data[fuelType]?.price;
        if (livePrice) {
          setFuelPrice(formatNumber(livePrice));
          DEFAULT_PRICES.gasoline = data.gasoline?.price || DEFAULT_PRICES.gasoline;
          DEFAULT_PRICES.diesel = data.diesel?.price || DEFAULT_PRICES.diesel;
          DEFAULT_PRICES.lpg = data.lpg?.price || DEFAULT_PRICES.lpg;
        }
      })
      .catch(() => {/* fallback to defaults */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFuelTypeChange = (type: FuelType) => {
    setFuelType(type);
    setFuelPrice(formatNumber(DEFAULT_PRICES[type]));
  };

  const parseNum = (val: string) => {
    const n = parseFloat(val.replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const handleNumericInput = (
    value: string,
    setter: (v: string) => void,
    allowDecimal = false
  ) => {
    const pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
    const raw = value.replace(pattern, "");
    if (!raw) {
      setter("");
      return;
    }
    if (allowDecimal) {
      const parts = raw.split(".");
      if (parts.length > 2) return;
      if (parts[0]) {
        parts[0] = parseInt(parts[0], 10).toLocaleString("ko-KR");
      }
      setter(parts.join("."));
    } else {
      setter(parseInt(raw, 10).toLocaleString("ko-KR"));
    }
  };

  const result = useMemo(() => {
    const dist = parseNum(distance);
    const eff = parseNum(efficiency);
    const price = parseNum(fuelPrice);
    if (dist <= 0 || eff <= 0 || price <= 0) return null;

    const actualDistance = isRoundTrip ? dist * 2 : dist;
    const fuelNeeded = actualDistance / eff;
    const totalCost = fuelNeeded * price;
    const costPerKm = price / eff;

    // 유종별 비교
    const comparison = (Object.keys(DEFAULT_PRICES) as FuelType[]).map((type) => {
      const p = type === fuelType ? price : DEFAULT_PRICES[type];
      const fuel = actualDistance / eff;
      const cost = fuel * p;
      return { type, price: p, fuel, cost, costPerKm: p / eff };
    });

    return {
      actualDistance,
      fuelNeeded,
      totalCost,
      costPerKm,
      comparison,
    };
  }, [distance, efficiency, fuelPrice, isRoundTrip, fuelType]);

  const monthlyResult = useMemo(() => {
    const dist = parseNum(monthlyDistance);
    const eff = parseNum(efficiency);
    const price = parseNum(fuelPrice);
    if (dist <= 0 || eff <= 0 || price <= 0) return null;

    const monthlyFuel = dist / eff;
    const monthlyCost = monthlyFuel * price;
    const annualCost = monthlyCost * 12;

    return { monthlyFuel, monthlyCost, annualCost };
  }, [monthlyDistance, efficiency, fuelPrice]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(
      `${formatNumber(Math.round(result.totalCost))}원`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDistance("100");
    setEfficiency("12");
    setFuelType("gasoline");
    setFuelPrice("1,650");
    setIsRoundTrip(false);
    setMonthlyDistance("1,000");
    setCopied(false);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        자동차 유류비 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        주행 거리와 연비를 입력하면 예상 유류비를 실시간으로 계산합니다.
      </p>

      {/* 실시간 유가 현황 */}
      {livePrices && (
        <div className="calc-card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">전국 평균 유가</h3>
            <span className="text-xs text-gray-400">{livePrices.tradeDate} 기준</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["gasoline", "diesel", "lpg"] as FuelType[]).map((type) => {
              const info = livePrices[type];
              if (!info) return null;
              return (
                <div key={type} className={`text-center p-2 rounded-lg ${fuelType === type ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
                  <p className="text-xs text-gray-500">{FUEL_LABELS[type]}</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(info.price)}</p>
                  <p className={`text-xs font-medium ${info.diff > 0 ? "text-red-500" : info.diff < 0 ? "text-blue-500" : "text-gray-400"}`}>
                    {info.diff > 0 ? "▲" : info.diff < 0 ? "▼" : "-"} {Math.abs(info.diff)}원
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        {/* 주행 거리 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주행 거리
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={distance}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDistance)
              }
              placeholder="예: 100"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              km
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {DISTANCE_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setDistance(formatNumber(p.km))}
                className="calc-preset"
              >
                {p.label} {p.km}km
              </button>
            ))}
          </div>
        </div>

        {/* 왕복 여부 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            왕복 여부
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsRoundTrip(false)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                !isRoundTrip
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              편도
            </button>
            <button
              onClick={() => setIsRoundTrip(true)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                isRoundTrip
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              왕복
            </button>
          </div>
        </div>

        {/* 연비 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연비
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={efficiency}
              onChange={(e) =>
                handleNumericInput(e.target.value, setEfficiency, true)
              }
              placeholder="예: 12"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              km/L
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {EFFICIENCY_PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => setEfficiency(String(v))}
                className="calc-preset"
              >
                {v} km/L
              </button>
            ))}
          </div>
        </div>

        {/* 유종 선택 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            유종
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(FUEL_LABELS) as FuelType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleFuelTypeChange(type)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  fuelType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {FUEL_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 유가 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            유가 (리터당)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={fuelPrice}
              onChange={(e) =>
                handleNumericInput(e.target.value, setFuelPrice)
              }
              placeholder="예: 1,650"
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원/L
            </span>
          </div>
          {livePrices ? (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">
                전국 평균 ({livePrices.tradeDate} 기준)
              </span>
              {livePrices[fuelType] && livePrices[fuelType].diff !== 0 && (
                <span className={`text-xs font-medium ${livePrices[fuelType].diff > 0 ? "text-red-500" : "text-blue-500"}`}>
                  {livePrices[fuelType].diff > 0 ? "▲" : "▼"} {Math.abs(livePrices[fuelType].diff)}원
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              유종 변경 시 평균 유가로 자동 설정됩니다. 직접 수정도 가능합니다.
            </p>
          )}
        </div>

        {/* 초기화 */}
        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className="calc-result-header">
            <p className="text-blue-100 text-sm mb-1 relative z-10">
              예상 유류비 {isRoundTrip ? "(왕복)" : "(편도)"}
            </p>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <p className="text-3xl font-bold">
                {formatNumber(Math.round(result.totalCost))}원
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                title="결과 복사"
                aria-label="결과 복사"
              >
                {copied ? (
                  <span className="text-xs text-white font-medium px-1">
                    복사됨!
                  </span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 세부 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">상세 내역</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">실제 주행 거리</span>
                <span className="text-sm text-gray-900">
                  {formatNumber(result.actualDistance)} km
                  {isRoundTrip && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({parseNum(distance)}km x 2)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">필요 연료량</span>
                <span className="text-sm text-gray-900">
                  {result.fuelNeeded.toFixed(2)} L
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">
                  유가 ({FUEL_LABELS[fuelType]})
                </span>
                <span className="text-sm text-gray-900">
                  {fuelPrice} 원/L
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-semibold text-gray-900">
                    1km당 비용
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {result.costPerKm.toFixed(1)}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 유종별 비교 테이블 */}
      {result && (
        <div className="calc-card p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">유종별 비교</h3>
          <p className="text-xs text-gray-400 mb-3">
            같은 거리({formatNumber(result.actualDistance)}km)·같은 연비(
            {efficiency}km/L) 기준
          </p>
          <div className="overflow-x-auto">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>유종</th>
                  <th className="text-right">유가 (원/L)</th>
                  <th className="text-right">필요 연료 (L)</th>
                  <th className="text-right">예상 비용</th>
                </tr>
              </thead>
              <tbody>
                {result.comparison.map((c) => (
                  <tr
                    key={c.type}
                    className={c.type === fuelType ? "font-semibold" : ""}
                  >
                    <td>
                      {FUEL_LABELS[c.type]}
                      {c.type === fuelType && (
                        <span className="text-xs text-blue-500 ml-1">
                          (선택)
                        </span>
                      )}
                    </td>
                    <td className="text-right">{formatNumber(c.price)}</td>
                    <td className="text-right">{c.fuel.toFixed(2)}</td>
                    <td className="text-right">
                      {formatNumber(Math.round(c.cost))}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 월간 유류비 계산 */}
      <div className="calc-card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">월간 유류비 추정</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            월 주행거리
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={monthlyDistance}
              onChange={(e) =>
                handleNumericInput(e.target.value, setMonthlyDistance)
              }
              placeholder="예: 1,000"
              className="calc-input"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              km/월
            </span>
          </div>
        </div>

        {monthlyResult && (
          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">월간 필요 연료</span>
              <span className="text-sm text-gray-900">
                {monthlyResult.monthlyFuel.toFixed(2)} L
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-semibold text-gray-900">
                월간 유류비
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {formatNumber(Math.round(monthlyResult.monthlyCost))}원
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-semibold text-gray-900">
                  연간 유류비 (추정)
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatNumber(Math.round(monthlyResult.annualCost))}원
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 하단 고정 바 */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">
                예상 유류비 {isRoundTrip ? "(왕복)" : "(편도)"}
              </p>
              <p className="text-lg font-extrabold text-blue-600">
                {formatNumber(Math.round(result.totalCost))}원
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="calc-btn-primary text-xs px-3 py-2"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">유류비 절약 팁</h2>
          <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
            <div>
              <h3 className="font-medium text-gray-900">
                1. 경제 속도 유지 (60~80km/h)
              </h3>
              <p className="mt-1">
                고속도로에서 100km/h 이상의 속도로 주행하면 공기 저항이 급격히
                증가하여 연비가 크게 떨어집니다. 60~80km/h 사이의 경제 속도를
                유지하면 연료 소모를 15~20%까지 줄일 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                2. 급가속·급제동 자제
              </h3>
              <p className="mt-1">
                급가속과 급제동은 연료 소모의 주요 원인입니다. 부드러운 가속과
                엔진 브레이크 활용으로 연비를 최대 30%까지 개선할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                3. 타이어 공기압 관리
              </h3>
              <p className="mt-1">
                타이어 공기압이 적정 수준보다 10% 부족하면 연비가 약 3% 저하됩니다.
                월 1회 이상 타이어 공기압을 점검하고, 제조사 권장 수준을 유지하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                4. 불필요한 짐 제거
              </h3>
              <p className="mt-1">
                차량 무게가 50kg 증가할 때마다 연비가 약 2% 감소합니다. 트렁크에
                불필요한 짐을 싣고 다니지 마세요. 루프캐리어도 사용하지 않을 때는
                제거하는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                5. 주유소 가격 비교
              </h3>
              <p className="mt-1">
                오피넷(opinet.co.kr)이나 카카오맵 등에서 주변 주유소의 가격을
                비교하면 리터당 50~100원 이상 차이가 나는 경우가 많습니다.
                셀프주유소를 이용하면 추가로 절약할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="calc-faq">
            {[
              {
                q: "내 차의 연비는 어떻게 확인하나요?",
                a: "차량 계기판의 평균 연비 표시를 확인하거나, 자동차등록증 또는 제조사 홈페이지에서 공인 연비를 확인할 수 있습니다. 실제 연비는 운전 습관, 도로 조건, 에어컨 사용 등에 따라 공인 연비 대비 10~20% 정도 낮을 수 있습니다.",
              },
              {
                q: "휘발유와 경유, 어느 것이 더 경제적인가요?",
                a: "경유차는 일반적으로 같은 배기량의 휘발유차보다 연비가 20~30% 높고, 경유 가격도 휘발유보다 낮은 편입니다. 다만 경유차의 차량 가격이 더 높고, 요소수 비용과 DPF 관리 비용이 추가로 발생합니다. 연간 2만km 이상 주행하는 경우 경유차가 유리한 경우가 많습니다.",
              },
              {
                q: "LPG 차량의 장단점은 무엇인가요?",
                a: "LPG는 휘발유·경유 대비 연료 가격이 40~50% 저렴하여 유류비 절감 효과가 큽니다. 단, LPG 차량은 연비가 휘발유차 대비 10~15% 낮고, 트렁크 공간이 줄어들며, LPG 충전소가 주유소보다 적습니다. 택시, 장거리 출퇴근 등 주행거리가 많은 경우 경제적입니다.",
              },
              {
                q: "전기차와 비교하면 유류비가 얼마나 차이 나나요?",
                a: "전기차의 km당 에너지 비용은 약 30~50원(가정용 충전 기준)으로, 내연기관차(km당 100~200원)의 1/3~1/4 수준입니다. 연간 2만km 주행 시 내연기관차 대비 연 150~250만원의 연료비를 절약할 수 있습니다.",
              },
            ].map((item, i) => (
              <div key={i} className="calc-faq-item">
                <button
                  className="calc-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === i && <div className="calc-faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedTools current="fuel-cost" />
    </div>
  );
}
