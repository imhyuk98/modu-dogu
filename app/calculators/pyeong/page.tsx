"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

const PYEONG_TO_SQM = 400 / 121; // 3.305785...
const PYEONG_TO_SQFT = 35.5832;

const apartmentTable = [
  { supply: 59, exclusive: 49, pyeong: 18, label: "20평형" },
  { supply: 84, exclusive: 59, pyeong: 25, label: "30평형" },
  { supply: 101, exclusive: 74, pyeong: 30, label: "33평형" },
  { supply: 115, exclusive: 84, pyeong: 34, label: "36평형" },
  { supply: 135, exclusive: 101, pyeong: 41, label: "43평형" },
  { supply: 165, exclusive: 125, pyeong: 50, label: "52평형" },
  { supply: 198, exclusive: 149, pyeong: 60, label: "62평형" },
  { supply: 244, exclusive: 182, pyeong: 74, label: "76평형" },
];

export default function PyeongCalculator() {
  const [mode, setMode] = useState<"toSqm" | "toPyeong">("toSqm");
  const [inputValue, setInputValue] = useState("");

  const numericValue = parseFloat(inputValue);
  const hasValue = inputValue !== "" && !isNaN(numericValue) && numericValue > 0;

  const sqmResult = hasValue ? numericValue * PYEONG_TO_SQM : 0;
  const pyeongResult = hasValue ? numericValue / PYEONG_TO_SQM : 0;
  const sqftResult =
    mode === "toSqm"
      ? hasValue
        ? numericValue * PYEONG_TO_SQFT
        : 0
      : hasValue
        ? pyeongResult * PYEONG_TO_SQFT
        : 0;

  const mainResult = mode === "toSqm" ? sqmResult : pyeongResult;
  const mainUnit = mode === "toSqm" ? "㎡" : "평";
  const inputUnit = mode === "toSqm" ? "평" : "㎡";
  const inputPlaceholder = mode === "toSqm" ? "예: 33" : "예: 109.09";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setInputValue(val);
    }
  };

  const quickValues =
    mode === "toSqm"
      ? [10, 18, 25, 30, 34, 40, 50, 60]
      : [33, 59, 84, 101, 115, 135, 165, 198];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">평수 계산기</h1>
      <p className="text-gray-500 mb-8">
        평(坪)과 제곱미터(㎡)를 간편하게 변환합니다. 아파트, 오피스텔, 상가
        면적 확인에 활용하세요.
      </p>

      {/* 변환 모드 토글 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
          <button
            onClick={() => {
              setMode("toSqm");
              setInputValue("");
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === "toSqm"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            평 → ㎡
          </button>
          <button
            onClick={() => {
              setMode("toPyeong");
              setInputValue("");
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === "toPyeong"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            ㎡ → 평
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "toSqm" ? "평수 입력" : "제곱미터(㎡) 입력"}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {inputUnit}
          </span>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickValues.map((val) => (
            <button
              key={val}
              onClick={() => setInputValue(String(val))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {val}
              {inputUnit}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 영역 */}
      {hasValue && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">변환 결과</p>
            <p className="text-3xl font-bold">
              {mainResult.toFixed(2)} {mainUnit}
            </p>
            <p className="text-blue-200 text-sm mt-2">
              {numericValue} {inputUnit} 기준
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">상세 환산</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">
                  {mode === "toSqm" ? "평수" : "제곱미터(㎡)"}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {numericValue} {inputUnit}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">
                  {mode === "toSqm" ? "제곱미터(㎡)" : "평수"}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {mainResult.toFixed(2)} {mainUnit}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">평방피트(ft²)</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {sqftResult.toFixed(2)} ft²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 아파트 면적 빠른 변환표 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          아파트 면적 빠른 변환표
        </h2>
        <div className="overflow-x-auto">
          <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border border-gray-200">
                  공급면적(㎡)
                </th>
                <th className="text-left py-2 px-3 border border-gray-200">
                  전용면적(㎡)
                </th>
                <th className="text-right py-2 px-3 border border-gray-200">
                  평수(약)
                </th>
                <th className="text-right py-2 px-3 border border-gray-200">
                  대표 평형
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {apartmentTable.map((row) => (
                <tr key={row.supply}>
                  <td className="py-2 px-3 border border-gray-200">
                    {row.supply}㎡
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    {row.exclusive}㎡
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    {row.pyeong}평
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200 font-medium">
                    {row.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>

      {/* 공급면적 vs 전용면적 설명 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          공급면적 vs 전용면적
        </h2>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              전용면적
            </span>
            <span>
              실제로 거주하는 공간의 면적입니다. 방, 거실, 주방, 화장실 등
              내부 공간만 포함합니다.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              공급면적
            </span>
            <span>
              전용면적 + 주거공용면적(복도, 계단, 엘리베이터 등)을 합한
              면적입니다. 일반적으로 &quot;몇 평형 아파트&quot;라고 할 때 이
              면적을 기준으로 합니다.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              계약면적
            </span>
            <span>
              공급면적 + 기타공용면적(관리사무소, 주차장, 놀이터 등)을 합한
              면적입니다. 분양계약서에 기재되는 면적입니다.
            </span>
          </div>
        </div>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            평(坪)이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            평(坪)은 일본에서 유래한 면적 단위로, 한국 부동산 시장에서
            관행적으로 사용되고 있습니다. 법적으로는 2007년부터 제곱미터(㎡)를
            공식 면적 단위로 사용하도록 되어 있지만, 여전히 일상에서는
            &quot;30평대 아파트&quot;, &quot;25평형&quot; 등 평수로 표현하는
            경우가 많습니다. 1평은 가로 6자(약 1.818m) x 세로 6자(약
            1.818m)의 면적으로, 정확히 400/121 제곱미터(약 3.305785㎡)에
            해당합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            아파트 면적 용어 정리
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">전용면적:</strong> 세대
              내부의 실제 거주 공간 면적입니다. 방, 거실, 주방, 화장실 등이
              포함되며 발코니는 제외됩니다. 실제 생활 공간의 크기를 가장 잘
              나타내는 지표입니다.
            </p>
            <p>
              <strong className="text-gray-900">공급면적:</strong> 전용면적에
              주거공용면적(복도, 계단, 엘리베이터 홀 등)을 더한 면적입니다.
              흔히 &quot;몇 평형 아파트&quot;라고 부를 때 이 면적을
              기준으로 합니다.
            </p>
            <p>
              <strong className="text-gray-900">계약면적:</strong> 공급면적에
              기타공용면적(주차장, 관리사무소, 놀이터, 기계실 등)을 더한
              면적입니다. 분양계약서에 기재되는 총 면적입니다.
            </p>
            <p>
              <strong className="text-gray-900">대지지분:</strong> 아파트
              전체 대지면적 중 각 세대가 소유하는 토지 면적의 지분입니다.
              재건축 시 중요한 요소로 작용합니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            평수별 아파트 구조
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">10평대 (원룸~오피스텔):</strong>{" "}
              1인 가구에 적합한 크기로, 원룸이나 오피스텔에 해당합니다.
              전용면적 약 33~49㎡로, 방 1~2개 구조가 일반적입니다.
            </p>
            <p>
              <strong className="text-gray-900">20평대 (신혼부부):</strong>{" "}
              신혼부부나 2인 가구에 적합합니다. 전용면적 약 49~66㎡로, 방
              2~3개, 화장실 1~2개 구조입니다. 국민평형이라 불리는 25평(84㎡)이
              이 범위에 속합니다.
            </p>
            <p>
              <strong className="text-gray-900">30평대 (3~4인 가족):</strong>{" "}
              3~4인 가족에게 가장 보편적인 크기입니다. 전용면적 약 84~115㎡로,
              방 3~4개, 화장실 2개 구조가 일반적입니다.
            </p>
            <p>
              <strong className="text-gray-900">40평대 이상 (대형):</strong>{" "}
              넉넉한 공간을 원하는 가족에게 적합한 대형 평형입니다. 전용면적
              115㎡ 이상으로, 방 4개 이상, 화장실 2~3개의 넓은 구조입니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                공급면적과 전용면적의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                전용면적은 실제로 거주하는 내부 공간(방, 거실, 주방, 화장실)의
                면적이고, 공급면적은 전용면적에 복도, 계단, 엘리베이터 등
                주거공용면적을 더한 것입니다. 같은 공급면적이라도 전용률에 따라
                실제 거주 공간은 달라질 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                분양 면적이란 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                분양 면적은 계약면적과 같은 의미로, 공급면적에 기타공용면적(주차장,
                관리사무소, 놀이터 등)을 합한 면적입니다. 분양가는 이 계약면적을
                기준으로 산정되는 경우가 많습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                실평수란 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                실평수는 전용면적을 평으로 환산한 것을 말합니다. 예를 들어
                전용면적 84㎡인 아파트의 실평수는 약 25.4평입니다. 공급면적
                기준의 &quot;34평형 아파트&quot;라도 실평수는 이보다 작습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                평수 계산 시 발코니 면적은 포함되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                발코니(베란다)는 전용면적에 포함되지 않는 서비스 면적입니다.
                다만 발코니 확장 공사를 하면 실제 사용 가능한 공간은 넓어지지만,
                등기부등본상의 전용면적은 변하지 않습니다. 발코니 면적은 별도로
                표기됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="pyeong" />
</div>
  );
}
