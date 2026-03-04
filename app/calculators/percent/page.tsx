"use client";

import { useState, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type Tab = "basic" | "ratio" | "discount" | "change";

export default function PercentCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("basic");

  // Tab 1: 기본 퍼센트
  const [basicA, setBasicA] = useState("");
  const [basicB, setBasicB] = useState("");
  const [basicResult, setBasicResult] = useState<number | null>(null);

  // Tab 2: 비율 계산
  const [ratioA, setRatioA] = useState("");
  const [ratioB, setRatioB] = useState("");
  const [ratioResult, setRatioResult] = useState<number | null>(null);

  // Tab 3: 할인/인상
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [isDiscount, setIsDiscount] = useState(true);
  const [discountResult, setDiscountResult] = useState<{
    finalPrice: number;
    difference: number;
  } | null>(null);

  // Tab 4: 증감률
  const [changeBefore, setChangeBefore] = useState("");
  const [changeAfter, setChangeAfter] = useState("");
  const [changeResult, setChangeResult] = useState<{
    rate: number;
    amount: number;
  } | null>(null);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const parseNumber = (str: string) => {
    const raw = str.replace(/[^0-9.-]/g, "");
    return raw ? parseFloat(raw) : NaN;
  };

  const formatInput = (value: string, allowDecimal = false, allowNegative = false) => {
    let raw = value;
    if (!allowNegative) raw = raw.replace(/-/g, "");
    if (!allowDecimal) {
      raw = raw.replace(/[^0-9-]/g, "");
    } else {
      // Allow one decimal point
      const parts = raw.replace(/[^0-9.-]/g, "").split(".");
      raw = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
    }
    return raw;
  };

  // Auto-calculate on input change
  useEffect(() => {
    const a = parseNumber(basicA);
    const b = parseNumber(basicB);
    if (!isNaN(a) && !isNaN(b)) {
      setBasicResult(a * b / 100);
    } else {
      setBasicResult(null);
    }
  }, [basicA, basicB]);

  useEffect(() => {
    const a = parseNumber(ratioA);
    const b = parseNumber(ratioB);
    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      setRatioResult((a / b) * 100);
    } else {
      setRatioResult(null);
    }
  }, [ratioA, ratioB]);

  useEffect(() => {
    const price = parseNumber(discountPrice);
    const rate = parseNumber(discountRate);
    if (!isNaN(price) && !isNaN(rate)) {
      const diff = price * rate / 100;
      if (isDiscount) {
        setDiscountResult({ finalPrice: price - diff, difference: diff });
      } else {
        setDiscountResult({ finalPrice: price + diff, difference: diff });
      }
    } else {
      setDiscountResult(null);
    }
  }, [discountPrice, discountRate, isDiscount]);

  useEffect(() => {
    const before = parseNumber(changeBefore);
    const after = parseNumber(changeAfter);
    if (!isNaN(before) && !isNaN(after) && before !== 0) {
      const amount = after - before;
      const rate = (amount / before) * 100;
      setChangeResult({ rate, amount });
    } else {
      setChangeResult(null);
    }
  }, [changeBefore, changeAfter]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "basic", label: "A의 B%는?" },
    { key: "ratio", label: "A는 B의 몇%?" },
    { key: "discount", label: "할인/인상" },
    { key: "change", label: "증감률" },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        퍼센트 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        퍼센트(%) 계산, 할인율, 증감률, 비율 계산을 간편하게 할 수 있습니다.
      </p>

      {/* 탭 선택 */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 기본 퍼센트 */}
      {activeTab === "basic" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            A의 B%는 얼마?
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                숫자 (A)
              </label>
              <input
                type="text"
                value={basicA}
                onChange={(e) => setBasicA(formatInput(e.target.value, true))}
                placeholder="예: 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                퍼센트 (B%)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={basicB}
                  onChange={(e) => setBasicB(formatInput(e.target.value, true))}
                  placeholder="예: 15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const a = parseNumber(basicA);
                const b = parseNumber(basicB);
                if (!isNaN(a) && !isNaN(b)) setBasicResult(a * b / 100);
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              계산하기
            </button>
          </div>

          {basicResult !== null && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">
                {basicA}의 {basicB}%는
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(Math.round(basicResult * 100) / 100)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 비율 계산 */}
      {activeTab === "ratio" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            A는 B의 몇 %?
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비교 값 (A)
              </label>
              <input
                type="text"
                value={ratioA}
                onChange={(e) => setRatioA(formatInput(e.target.value, true))}
                placeholder="예: 30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기준 값 (B)
              </label>
              <input
                type="text"
                value={ratioB}
                onChange={(e) => setRatioB(formatInput(e.target.value, true))}
                placeholder="예: 200"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                const a = parseNumber(ratioA);
                const b = parseNumber(ratioB);
                if (!isNaN(a) && !isNaN(b) && b !== 0) setRatioResult((a / b) * 100);
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              계산하기
            </button>
          </div>

          {ratioResult !== null && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">
                {ratioA}은(는) {ratioB}의
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {(Math.round(ratioResult * 100) / 100).toLocaleString("ko-KR")}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 할인/인상 계산 */}
      {activeTab === "discount" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            할인/인상 계산
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                원래 가격
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(formatInput(e.target.value, true))}
                  placeholder="예: 50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  원
                </span>
              </div>
            </div>

            {/* 할인/인상 토글 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDiscount(true)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isDiscount
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                할인
              </button>
              <button
                onClick={() => setIsDiscount(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  !isDiscount
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                인상
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isDiscount ? "할인율" : "인상율"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(formatInput(e.target.value, true))}
                  placeholder="예: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const price = parseNumber(discountPrice);
                const rate = parseNumber(discountRate);
                if (!isNaN(price) && !isNaN(rate)) {
                  const diff = price * rate / 100;
                  if (isDiscount) {
                    setDiscountResult({ finalPrice: price - diff, difference: diff });
                  } else {
                    setDiscountResult({ finalPrice: price + diff, difference: diff });
                  }
                }
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              계산하기
            </button>
          </div>

          {discountResult !== null && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">
                {isDiscount ? "할인된 가격" : "인상된 가격"}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(Math.round(discountResult.finalPrice))}원
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isDiscount ? "할인 금액" : "인상 금액"}:{" "}
                <span className={isDiscount ? "text-red-500" : "text-green-600"}>
                  {isDiscount ? "-" : "+"}
                  {formatNumber(Math.round(discountResult.difference))}원
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: 증감률 계산 */}
      {activeTab === "change" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            증감률 계산
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이전 값
              </label>
              <input
                type="text"
                value={changeBefore}
                onChange={(e) => setChangeBefore(formatInput(e.target.value, true))}
                placeholder="예: 1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이후 값
              </label>
              <input
                type="text"
                value={changeAfter}
                onChange={(e) => setChangeAfter(formatInput(e.target.value, true))}
                placeholder="예: 1500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                const before = parseNumber(changeBefore);
                const after = parseNumber(changeAfter);
                if (!isNaN(before) && !isNaN(after) && before !== 0) {
                  const amount = after - before;
                  const rate = (amount / before) * 100;
                  setChangeResult({ rate, amount });
                }
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              계산하기
            </button>
          </div>

          {changeResult !== null && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">증감률</p>
              <p
                className={`text-3xl font-bold ${
                  changeResult.rate >= 0 ? "text-red-500" : "text-blue-600"
                }`}
              >
                {changeResult.rate >= 0 ? "+" : ""}
                {(Math.round(changeResult.rate * 100) / 100).toLocaleString("ko-KR")}%
                {changeResult.rate >= 0 ? " ↑" : " ↓"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                증감량:{" "}
                <span
                  className={
                    changeResult.amount >= 0 ? "text-red-500" : "text-blue-600"
                  }
                >
                  {changeResult.amount >= 0 ? "+" : ""}
                  {formatNumber(Math.round(changeResult.amount * 100) / 100)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            퍼센트(%)란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            퍼센트(percent)는 라틴어 &quot;per centum&quot;에서 유래한 말로,
            &quot;100당&quot;이라는 뜻입니다. 기호 &quot;%&quot;는 이탈리아
            상인들이 &quot;per cento&quot;를 줄여 쓰던 것에서 발전했습니다.
            퍼센트는 전체를 100으로 놓았을 때의 비율을 나타내는 단위로, 일상
            생활에서 할인율, 이자율, 세율, 성적, 영양소 함량 등 다양한 분야에서
            사용됩니다. 예를 들어 &quot;50%&quot;는 전체의 절반을,
            &quot;100%&quot;는 전체를 의미합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            퍼센트 계산 공식
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                1. 기본 퍼센트 계산 (A의 B%는?)
              </h3>
              <p className="text-gray-600 text-sm">
                <strong>공식:</strong> 결과 = A x B / 100
              </p>
              <p className="text-gray-500 text-sm mt-1">
                예) 50,000의 15% = 50,000 x 15 / 100 = 7,500
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                2. 비율 계산 (A는 B의 몇 %?)
              </h3>
              <p className="text-gray-600 text-sm">
                <strong>공식:</strong> 결과 = (A / B) x 100
              </p>
              <p className="text-gray-500 text-sm mt-1">
                예) 30은 200의 몇 %? = (30 / 200) x 100 = 15%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                3. 할인/인상 계산
              </h3>
              <p className="text-gray-600 text-sm">
                <strong>할인:</strong> 할인 가격 = 원래 가격 x (1 - 할인율 / 100)
              </p>
              <p className="text-gray-600 text-sm">
                <strong>인상:</strong> 인상 가격 = 원래 가격 x (1 + 인상율 / 100)
              </p>
              <p className="text-gray-500 text-sm mt-1">
                예) 50,000원에서 30% 할인 = 50,000 x (1 - 0.3) = 35,000원
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                4. 증감률 계산
              </h3>
              <p className="text-gray-600 text-sm">
                <strong>공식:</strong> 증감률 = (이후 값 - 이전 값) / 이전 값 x
                100
              </p>
              <p className="text-gray-500 text-sm mt-1">
                예) 1,000에서 1,500으로 변화 = (1,500 - 1,000) / 1,000 x 100 =
                +50%
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            일상 속 퍼센트 활용
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong>쇼핑 할인:</strong> &quot;30% 할인&quot;은 원래 가격에서
              30%를 뺀 금액으로 구매할 수 있다는 뜻입니다. 50,000원짜리 상품을
              30% 할인하면 15,000원이 빠져 35,000원에 살 수 있습니다.
            </p>
            <p>
              <strong>세금:</strong> 부가가치세(VAT) 10%는 상품 가격의 10%가
              세금으로 추가된다는 뜻입니다. 10,000원짜리 상품의 VAT 포함 가격은
              11,000원입니다.
            </p>
            <p>
              <strong>이자율:</strong> 은행 예금 연이자율 3%는 1년간 예치하면
              원금의 3%를 이자로 받는다는 의미입니다. 1,000만원을 예치하면 1년
              후 30만원의 이자를 받습니다.
            </p>
            <p>
              <strong>성적:</strong> 시험에서 80점을 받으면 100점 만점 중 80%를
              획득한 것입니다. 합격 기준이 60%라면 60점 이상이면 합격입니다.
            </p>
            <p>
              <strong>영양소:</strong> 식품 영양성분표에서 &quot;1일 영양소
              기준치의 15%&quot;라고 표시되어 있다면, 해당 식품 1회 섭취로 하루
              권장 섭취량의 15%를 충족한다는 뜻입니다.
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
                퍼센트포인트(%p)와 퍼센트(%)의 차이는?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                퍼센트(%)는 비율의 변화를 상대적으로 나타내고,
                퍼센트포인트(%p)는 절대적인 차이를 나타냅니다. 예를 들어
                금리가 2%에서 3%로 올랐을 때, &quot;1%포인트 상승&quot;이라고
                합니다. 반면 &quot;50% 상승&quot;이라고 하면 2%의 50%인 1%가
                올라 3%가 된 것과 같은 의미입니다. 뉴스에서 혼용되는 경우가
                많으니 주의가 필요합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                할인이 중복으로 적용되면 어떻게 계산하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                할인은 단순 합산이 아니라 순차적으로 적용됩니다. 예를 들어
                10,000원 상품에 20% 할인 후 추가 10% 할인이 적용되면, 먼저
                10,000 x 0.8 = 8,000원이 되고, 여기에 다시 8,000 x 0.9 =
                7,200원이 됩니다. 20% + 10% = 30% 할인이 아니라 실제로는 28%
                할인(7,200원)이 적용되는 셈입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                마진율은 어떻게 계산하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                마진율은 판매가에서 원가를 뺀 이익을 판매가로 나눈 비율입니다.
                공식: 마진율(%) = (판매가 - 원가) / 판매가 x 100. 예를 들어
                원가 7,000원인 상품을 10,000원에 판매하면 마진율은 (10,000 -
                7,000) / 10,000 x 100 = 30%입니다. 마크업률과 혼동하지
                않도록 주의하세요. 마크업률은 원가 대비 이익 비율로, 같은
                예시에서 (3,000 / 7,000) x 100 = 약 42.9%입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                VAT(부가가치세) 포함/제외 가격은 어떻게 계산하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                한국의 부가가치세는 10%입니다. VAT 포함 가격 = 공급가 x 1.1
                (예: 10,000원 x 1.1 = 11,000원). VAT 제외 가격(공급가) = VAT
                포함 가격 / 1.1 (예: 11,000원 / 1.1 = 10,000원). VAT 금액만
                구하려면 VAT 포함 가격 / 11 또는 공급가 x 0.1로 계산합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="percent" />
</div>
  );
}
