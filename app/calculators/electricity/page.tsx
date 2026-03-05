"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type Season = "other" | "summer" | "winter";
type HousingType = "low" | "high";

interface TierBreakdown {
  tier: number;
  label: string;
  kwh: number;
  unitPrice: number;
  amount: number;
}

interface ElectricityResult {
  usage: number;
  basicFee: number;
  energyFee: number;
  tierBreakdown: TierBreakdown[];
  climateFee: number;
  fuelAdjustFee: number;
  subtotal: number;
  vat: number;
  fundFee: number;
  total: number;
}

// 저압 기본요금 & 전력량요금
const LOW_VOLTAGE = {
  other: {
    tiers: [200, 400, Infinity],
    basic: [910, 1600, 7300],
    unit: [120.0, 214.6, 307.3],
  },
  summer: {
    tiers: [300, 450, 1000, Infinity],
    basic: [910, 1600, 7300, 7300],
    unit: [120.0, 214.6, 307.3, 307.3],
  },
  winter: {
    tiers: [200, 400, Infinity],
    basic: [910, 1600, 7300],
    unit: [120.0, 214.6, 307.3],
  },
};

// 고압 기본요금 & 전력량요금
const HIGH_VOLTAGE = {
  other: {
    tiers: [200, 400, Infinity],
    basic: [730, 1260, 6060],
    unit: [105.0, 174.0, 242.3],
  },
  summer: {
    tiers: [300, 450, 1000, Infinity],
    basic: [730, 1260, 6060, 6060],
    unit: [105.0, 174.0, 242.3, 242.3],
  },
  winter: {
    tiers: [200, 400, Infinity],
    basic: [730, 1260, 6060],
    unit: [105.0, 174.0, 242.3],
  },
};

const CLIMATE_FEE_PER_KWH = 9;
const FUEL_ADJUST_PER_KWH = 5;
const VAT_RATE = 0.1;
const FUND_RATE = 0.037;

function calculateElectricity(
  usage: number,
  season: Season,
  housingType: HousingType
): ElectricityResult {
  const table = housingType === "low" ? LOW_VOLTAGE[season] : HIGH_VOLTAGE[season];

  // 구간 결정
  let tierIndex = 0;
  for (let i = 0; i < table.tiers.length; i++) {
    if (usage <= table.tiers[i]) {
      tierIndex = i;
      break;
    }
  }

  const basicFee = table.basic[tierIndex];

  // 전력량요금 구간별 계산
  const tierBreakdown: TierBreakdown[] = [];
  let remaining = usage;
  let prevLimit = 0;

  const tierLabels =
    season === "summer" && table.tiers.length === 4
      ? ["1구간", "2구간", "3구간", "슈퍼유저"]
      : ["1구간", "2구간", "3구간"];

  for (let i = 0; i < table.tiers.length; i++) {
    if (remaining <= 0) break;

    const tierMax = table.tiers[i] - prevLimit;
    const tierKwh = Math.min(remaining, tierMax);

    if (tierKwh > 0) {
      tierBreakdown.push({
        tier: i + 1,
        label: tierLabels[i] || `${i + 1}구간`,
        kwh: tierKwh,
        unitPrice: table.unit[i],
        amount: Math.round(tierKwh * table.unit[i]),
      });
    }

    remaining -= tierKwh;
    prevLimit = table.tiers[i];
  }

  const energyFee = tierBreakdown.reduce((sum, t) => sum + t.amount, 0);
  const climateFee = usage * CLIMATE_FEE_PER_KWH;
  const fuelAdjustFee = usage * FUEL_ADJUST_PER_KWH;

  const subtotal = basicFee + energyFee + climateFee + fuelAdjustFee;
  const vat = Math.round(subtotal * VAT_RATE);
  const fundFee = Math.round(subtotal * FUND_RATE);

  // 10원 미만 절사
  const total = Math.floor((subtotal + vat + fundFee) / 10) * 10;

  return {
    usage,
    basicFee,
    energyFee,
    tierBreakdown,
    climateFee,
    fuelAdjustFee,
    subtotal,
    vat,
    fundFee,
    total,
  };
}

export default function ElectricityCalculator() {
  const [usage, setUsage] = useState("");
  const [season, setSeason] = useState<Season>("other");
  const [housingType, setHousingType] = useState<HousingType>("low");
  const [result, setResult] = useState<ElectricityResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const kwh = parseInt(usage.replace(/,/g, ""), 10);
    if (!kwh || kwh <= 0) {
      setError("사용량을 입력해주세요");
      return;
    }
    setError("");
    setResult(calculateElectricity(kwh, season, housingType));
  };

  const handleReset = () => {
    setUsage("");
    setSeason("other");
    setHousingType("low");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setUsage(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setUsage("");
    }
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const quickAmounts = [100, 200, 300, 400, 500, 700];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        전기요금 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        2025년 한국전력 기준 가정용 전기요금을 누진제로 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 주택 유형 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주택 유형
        </label>
        <div className="flex gap-3 mb-5">
          {[
            { value: "low" as HousingType, label: "주택용(저압)" },
            { value: "high" as HousingType, label: "주택용(고압)" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHousingType(opt.value)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                housingType === opt.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 계절 선택 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          계절
        </label>
        <div className="flex gap-3 mb-5">
          {[
            { value: "other" as Season, label: "기타 계절" },
            { value: "summer" as Season, label: "하계 (7~8월)" },
            { value: "winter" as Season, label: "동계 (12~2월)" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSeason(opt.value)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                season === opt.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 사용량 입력 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          월간 전력 사용량
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={usage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="예: 350"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              kWh
            </span>
          </div>
          <button
            onClick={handleCalculate}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            계산하기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            초기화
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setUsage(amount.toLocaleString("ko-KR"));
                setResult(calculateElectricity(amount, season, housingType));
              }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {amount}kWh
            </button>
          ))}
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {/* 합계 하이라이트 */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">월 전기요금 합계</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {formatNumber(result.total)}원
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
              월 {formatNumber(result.usage)}kWh 사용 기준 (10원 미만 절사)
            </p>
          </div>

          {/* 요금 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">요금 내역</h3>
            <div className="space-y-3">
              <Row label="기본요금" value={result.basicFee} />
              <div className="border-t border-gray-100 pt-3">
                <Row label="전력량요금" value={result.energyFee} bold />
                {result.tierBreakdown.map((t) => (
                  <div
                    key={t.tier}
                    className="flex justify-between items-center py-1 pl-4"
                  >
                    <span className="text-xs text-gray-500">
                      {t.label}: {formatNumber(t.kwh)}kWh x{" "}
                      {t.unitPrice.toFixed(1)}원
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatNumber(t.amount)}원
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="기후환경요금" value={result.climateFee} />
                <Row label="연료비조정요금" value={result.fuelAdjustFee} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="소계 (세전)" value={result.subtotal} bold />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="부가가치세 (10%)" value={result.vat} />
                <Row label="전력산업기반기금 (3.7%)" value={result.fundFee} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="월 전기요금 합계" value={result.total} bold />
              </div>
            </div>
          </div>

          {/* 구간별 사용량 바 차트 */}
          <div className="px-6 pb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              구간별 사용량 분포
            </h3>
            <div className="space-y-2">
              {result.tierBreakdown.map((t) => {
                const pct = Math.round((t.kwh / result.usage) * 100);
                return (
                  <div key={t.tier}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{t.label}</span>
                      <span>
                        {formatNumber(t.kwh)}kWh ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          t.tier === 1
                            ? "bg-blue-400"
                            : t.tier === 2
                            ? "bg-blue-500"
                            : t.tier === 3
                            ? "bg-blue-600"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            전기요금 누진제란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            전기요금 누진제는 전력 사용량이 많을수록 더 높은 단가가 적용되는
            요금 체계입니다. 2025년 기준 가정용 전기요금은 3구간 누진 체계로
            운영되며, 사용량이 많아질수록 기본요금과 kWh당 단가가 모두
            올라갑니다. 하계(7~8월)에는 냉방 수요를 고려하여 구간 기준이
            완화되며, 1,000kWh를 초과하는 슈퍼유저 구간이 별도로 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            전기요금 구성 요소
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    항목
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    기본요금
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    사용 구간에 따라 부과되는 고정 요금 (910원~7,300원)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    전력량요금
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    실제 사용한 kWh에 구간별 단가를 곱한 요금
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    기후환경요금
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    신재생에너지 확대 비용, kWh당 9원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    연료비조정요금
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    연료비 변동분 반영, kWh당 5원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    부가가치세
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    전기요금 합계의 10%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    전력산업기반기금
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    전기요금 합계의 3.7%
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            주택용(저압) 전기요금표 (2025년 기준)
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    구간
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    사용량
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    기본요금
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    전력량요금 (kWh당)
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">1구간</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    200kWh 이하
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    910원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    120.0원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">2구간</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    201~400kWh
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    1,600원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    214.6원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">3구간</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    401kWh 이상
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    7,300원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    307.3원
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            전기요금 절약 팁
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">1.</span>
              <p>
                <strong>대기전력 차단:</strong> 사용하지 않는 가전제품의 플러그를
                뽑거나 멀티탭 스위치를 꺼서 대기전력을 차단하세요. 가정 전체
                전력의 약 6~11%가 대기전력으로 소비됩니다.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">2.</span>
              <p>
                <strong>에너지 효율 가전 사용:</strong> 에너지소비효율 1등급
                가전제품으로 교체하면 전력 소비를 크게 줄일 수 있습니다.
                특히 냉장고, 에어컨, 세탁기 등 상시 사용 가전이 효과적입니다.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">3.</span>
              <p>
                <strong>하계 냉방 온도 관리:</strong> 에어컨 설정 온도를 26~28도로
                유지하고, 선풍기와 함께 사용하면 냉방 효율이 높아집니다.
                하계에는 누진 구간이 완화되지만 사용량이 많으면 요금이
                급격히 올라갑니다.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">4.</span>
              <p>
                <strong>심야 전력 활용:</strong> 심야 시간대(23시~09시)에
                세탁기, 식기세척기 등을 사용하면 전력 피크를 피할 수 있습니다.
                심야전력 요금제에 가입하면 추가 할인도 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                내가 몇 구간인지 어떻게 확인하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                한국전력 고객서비스(123)에 전화하거나, 한전 홈페이지 또는
                &apos;한전ON&apos; 앱에서 월별 사용량을 확인할 수 있습니다.
                고지서에도 사용량(kWh)이 표시되어 있으니, 해당 수치를
                본 계산기에 입력하면 구간을 확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                에어컨 전기요금은 얼마나 나오나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                일반 가정용 에어컨(인버터형 기준)은 시간당 약 1~1.5kWh를
                소비합니다. 하루 8시간 사용 시 월 약 240~360kWh가 추가됩니다.
                기존 사용량에 더해 누진 구간이 올라가면 요금이 급격히
                증가할 수 있으므로 주의가 필요합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                고압과 저압의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                저압은 일반 단독주택, 다세대주택 등에 적용되며, 고압은
                아파트 등 공동주택에 적용됩니다. 고압은 변압기를 아파트 단지
                내에서 관리하므로 기본요금과 전력량요금이 저압보다 약간
                저렴합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                전기요금 복지 할인 대상은 누구인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                기초생활수급자, 차상위계층, 장애인, 다자녀가구(3자녀 이상),
                대가족(5인 이상), 출산가구, 독립유공자 등이 전기요금 할인
                대상입니다. 한국전력에 신청하면 월 최대 16,000원까지
                할인받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
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
        {value.toLocaleString("ko-KR")}원
      </span>
          <RelatedTools current="electricity" />
</div>
  );
}
