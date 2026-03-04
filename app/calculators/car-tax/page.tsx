"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type VehicleType = "non-business" | "business" | "electric" | "hybrid";

interface CarTaxResult {
  baseTax: number;
  vehicleAge: number;
  reductionRate: number;
  reductionAmount: number;
  afterReduction: number;
  localEducationTax: number;
  annualTotal: number;
  firstHalf: number;
  secondHalf: number;
  earlyPaymentDiscount: number;
  earlyPaymentTotal: number;
}

function calculateCarTax(
  vehicleType: VehicleType,
  displacement: number,
  registrationYear: number
): CarTaxResult {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - registrationYear;

  // 기본 자동차세 계산
  let baseTax = 0;

  if (vehicleType === "electric") {
    baseTax = 100000;
  } else if (vehicleType === "business") {
    if (displacement <= 1000) {
      baseTax = displacement * 18;
    } else if (displacement <= 1600) {
      baseTax = displacement * 18;
    } else if (displacement <= 2000) {
      baseTax = displacement * 19;
    } else {
      baseTax = displacement * 24;
    }
  } else {
    // non-business, hybrid
    if (displacement <= 1000) {
      baseTax = displacement * 80;
    } else if (displacement <= 1600) {
      baseTax = displacement * 140;
    } else {
      baseTax = displacement * 200;
    }
  }

  // 차령별 감면율
  let reductionRate = 0;
  if (vehicleAge >= 12) reductionRate = 50;
  else if (vehicleAge >= 11) reductionRate = 45;
  else if (vehicleAge >= 10) reductionRate = 40;
  else if (vehicleAge >= 9) reductionRate = 35;
  else if (vehicleAge >= 8) reductionRate = 30;
  else if (vehicleAge >= 7) reductionRate = 25;
  else if (vehicleAge >= 6) reductionRate = 20;
  else if (vehicleAge >= 5) reductionRate = 15;
  else if (vehicleAge >= 4) reductionRate = 10;
  else if (vehicleAge >= 3) reductionRate = 5;

  const reductionAmount = Math.floor(baseTax * (reductionRate / 100));
  const afterReduction = baseTax - reductionAmount;

  // 지방교육세 30%
  const localEducationTax = Math.floor(afterReduction * 0.3);

  const annualTotal = afterReduction + localEducationTax;
  const firstHalf = Math.floor(annualTotal / 2);
  const secondHalf = annualTotal - firstHalf;

  // 연납 할인 (약 5%)
  const earlyPaymentDiscount = Math.floor(annualTotal * 0.05);
  const earlyPaymentTotal = annualTotal - earlyPaymentDiscount;

  return {
    baseTax,
    vehicleAge,
    reductionRate,
    reductionAmount,
    afterReduction,
    localEducationTax,
    annualTotal,
    firstHalf,
    secondHalf,
    earlyPaymentDiscount,
    earlyPaymentTotal,
  };
}

const vehicleTypeLabels: Record<VehicleType, string> = {
  "non-business": "승용차 (비영업)",
  business: "승용차 (영업)",
  electric: "전기차",
  hybrid: "하이브리드",
};

const popularCars = [
  { name: "모닝", cc: 998 },
  { name: "아반떼", cc: 1598 },
  { name: "소나타", cc: 1999 },
  { name: "K5", cc: 1999 },
  { name: "카니발", cc: 2199 },
  { name: "그랜저", cc: 2497 },
];

export default function CarTaxCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("non-business");
  const [displacement, setDisplacement] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");
  const [result, setResult] = useState<CarTaxResult | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const isElectric = vehicleType === "electric";

  const handleCalculate = () => {
    const cc = parseInt(displacement.replace(/,/g, ""), 10);
    const year = parseInt(registrationYear, 10);
    if (!isElectric && (!cc || cc <= 0)) return;
    if (!year) return;
    setResult(calculateCarTax(vehicleType, isElectric ? 0 : cc, year));
  };

  const handleDisplacementChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setDisplacement(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setDisplacement("");
    }
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        자동차세 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        차량 배기량과 차령에 따른 자동차세(지방교육세 포함)를 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 차량 유형 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          차량 유형
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {(
            Object.entries(vehicleTypeLabels) as [VehicleType, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setVehicleType(key)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                vehicleType === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 배기량 */}
        {!isElectric && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배기량
            </label>
            <div className="relative">
              <input
                type="text"
                value={displacement}
                onChange={handleDisplacementChange}
                placeholder="예: 1,999"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                cc
              </span>
            </div>

            {/* 인기 차종 빠른 선택 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {popularCars.map((car) => (
                <button
                  key={car.name}
                  onClick={() => {
                    setDisplacement(car.cc.toLocaleString("ko-KR"));
                    if (registrationYear) {
                      setResult(
                        calculateCarTax(
                          vehicleType,
                          car.cc,
                          parseInt(registrationYear, 10)
                        )
                      );
                    }
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {car.name} ({car.cc.toLocaleString()}cc)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 최초등록연도 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최초등록연도
          </label>
          <select
            value={registrationYear}
            onChange={(e) => setRegistrationYear(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">선택하세요</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>

        {/* 계산 버튼 */}
        <button
          onClick={handleCalculate}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {/* 연간 총 납부액 하이라이트 */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">연간 총 납부액</p>
            <p className="text-3xl font-bold">
              {formatNumber(result.annualTotal)}원
            </p>
            {result.reductionRate > 0 && (
              <p className="text-blue-200 text-sm mt-2">
                차령 {result.vehicleAge}년 / {result.reductionRate}% 감면 적용
              </p>
            )}
          </div>

          {/* 세부 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">세부 내역</h3>
            <div className="space-y-3">
              <Row label="자동차세 (본세)" value={result.baseTax} />
              {result.reductionRate > 0 && (
                <Row
                  label={`차령 감면액 (${result.reductionRate}%)`}
                  value={-result.reductionAmount}
                />
              )}
              <div className="border-t border-gray-100 pt-3">
                <Row
                  label="감면 후 자동차세"
                  value={result.afterReduction}
                  bold
                />
              </div>
              <Row
                label="지방교육세 (30%)"
                value={result.localEducationTax}
              />
              <div className="border-t border-gray-200 pt-3">
                <Row
                  label="연간 총 납부액"
                  value={result.annualTotal}
                  bold
                  highlight
                />
              </div>
            </div>
          </div>

          {/* 납부 일정 */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">납부 일정</h3>
            <div className="space-y-3">
              <Row label="1기분 (6월 납부)" value={result.firstHalf} />
              <Row label="2기분 (12월 납부)" value={result.secondHalf} />
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-green-700 font-medium">
                    연납 시 (1월 납부, 약 5% 할인)
                  </span>
                  <span className="text-sm font-semibold text-green-700">
                    {formatNumber(result.earlyPaymentTotal)}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-green-600">연납 할인액</span>
                  <span className="text-sm text-green-600">
                    -{formatNumber(result.earlyPaymentDiscount)}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자동차세란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            자동차세는 자동차를 소유한 사람에게 부과되는 지방세입니다. 매년
            6월(1기분)과 12월(2기분)에 나누어 납부하며, 차량의 배기량(cc)과
            차령(연식)에 따라 세액이 결정됩니다. 영업용과 비영업용에 따라 세율이
            다르게 적용되며, 지방교육세(자동차세의 30%)가 함께 부과됩니다. 1월에
            연간 세액을 한꺼번에 납부하면 약 5%의 할인 혜택을 받을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자동차세 세율표
          </h2>
          <p className="text-gray-600 mb-3">
            비영업용과 영업용 승용차의 배기량별 세율은 다음과 같습니다.
          </p>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    배기량 구간
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    비영업용 (cc당)
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    영업용 (cc당)
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    1,000cc 이하
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    80원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    18원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    1,000cc 초과 ~ 1,600cc 이하
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    140원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    18원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    1,600cc 초과 ~ 2,000cc 이하
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    200원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    19원
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    2,000cc 초과
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    200원
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    24원
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
          <p className="text-gray-500 text-sm">
            * 전기차는 배기량과 관계없이 연 100,000원 고정, 하이브리드는 일반
            승용차와 동일하게 배기량 기준으로 과세됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            차령별 감면율
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    차령
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    감면율
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    1~2년
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    없음
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">3년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    5%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">4년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    10%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">5년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    15%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">6년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    20%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">7년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    25%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">8년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    30%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">9년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    35%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">10년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    40%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">11년</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    45%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    12년 이상
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    50% (최대)
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자동차세 절약 팁
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-medium text-gray-900">1. 연납 할인 활용</h3>
              <p className="text-sm mt-1">
                매년 1월에 연간 자동차세를 한꺼번에 납부하면 약 5%의 할인을 받을
                수 있습니다. 3월, 6월, 9월에도 신청 가능하지만 할인율이
                줄어듭니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                2. 차령 감면 자동 적용
              </h3>
              <p className="text-sm mt-1">
                차량 등록 후 3년부터 매년 5%씩 자동차세가 감면되어 최대 50%까지
                줄어듭니다. 별도 신청 없이 자동 적용됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                3. 경차 혜택
              </h3>
              <p className="text-sm mt-1">
                배기량 1,000cc 이하 경차(모닝, 레이 등)는 cc당 80원의 낮은
                세율이 적용되어 연간 자동차세가 매우 저렴합니다. 지방교육세
                포함해도 연 10만원대 수준입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                4. 전기차 혜택
              </h3>
              <p className="text-sm mt-1">
                전기차는 배기량과 관계없이 연간 자동차세가 100,000원으로 고정되어
                있습니다. 지방교육세(30,000원) 포함 시 연간 130,000원만
                납부하면 됩니다.
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
                자동차세 연납은 어떻게 신청하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                위택스(wetax.go.kr)에서 온라인으로 신청하거나, 관할 지방자치단체
                세무과에 전화 또는 방문하여 신청할 수 있습니다. 1월 16일~31일
                사이에 신청하면 연세액의 약 5% 할인을 받을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                중간에 차를 팔면 자동차세는 어떻게 되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                차량을 양도(매매)하면 소유 기간에 해당하는 자동차세만 납부하면
                됩니다. 이미 연납으로 납부한 경우, 소유하지 않은 기간에 대한
                세액은 환급받을 수 있습니다. 이전등록 시 자동으로 정산됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                하이브리드 차량은 자동차세 혜택이 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                하이브리드 차량의 자동차세는 일반 내연기관 차량과 동일하게
                배기량을 기준으로 부과됩니다. 다만 취득세 감면(최대 40만원) 등
                다른 세제 혜택이 있을 수 있으므로 구입 시 확인하시기 바랍니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                장애인 차량은 자동차세 감면이 되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                장애인 본인 명의 또는 장애인과 공동명의로 등록된 차량(배기량
                2,000cc 이하)은 자동차세가 전액 면제됩니다. 국가유공자도
                유사한 감면 혜택을 받을 수 있습니다. 관할 시군구청 세무과에서
                신청 가능합니다.
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
  highlight,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  const formatted =
    value >= 0
      ? `${value.toLocaleString("ko-KR")}원`
      : `-${Math.abs(value).toLocaleString("ko-KR")}원`;

  return (
    <div className="flex justify-between items-center py-1">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold" : ""} ${highlight ? "text-blue-600" : value < 0 ? "text-red-400" : "text-gray-900"}`}
      >
        {formatted}
      </span>
          <RelatedTools current="car-tax" />
</div>
  );
}
