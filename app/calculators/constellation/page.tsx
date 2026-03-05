"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface ConstellationInfo {
  name: string;
  symbol: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: string;
  elementColor: string;
  elementBg: string;
  planet: string;
  personality: string;
  compatible: string[];
  incompatible: string[];
  luckyNumbers: number[];
  luckyColor: string;
}

const constellations: ConstellationInfo[] = [
  {
    name: "물병자리",
    symbol: "\u2652",
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    element: "\uD83C\uDF2C\uFE0F 바람",
    elementColor: "text-sky-700",
    elementBg: "bg-sky-50 border-sky-200",
    planet: "\uD83E\uDE90 천왕성",
    personality:
      "독창적이고 자유로운 영혼의 소유자입니다. 인류애가 넘치고 혁신적인 아이디어로 세상을 바꾸려 합니다. 독립심이 강하며 틀에 박힌 것을 싫어합니다. 때로는 엉뚱하지만, 그 안에 천재적인 면모가 숨어 있습니다.",
    compatible: ["쌍둥이자리", "천칭자리"],
    incompatible: ["황소자리", "전갈자리"],
    luckyNumbers: [4, 7, 11],
    luckyColor: "\uD83D\uDD35 파란색",
  },
  {
    name: "물고기자리",
    symbol: "\u2653",
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    element: "\uD83D\uDCA7 물",
    elementColor: "text-blue-700",
    elementBg: "bg-blue-50 border-blue-200",
    planet: "\uD83D\uDD2E 해왕성",
    personality:
      "감수성이 풍부하고 직관력이 뛰어난 몽상가입니다. 예술적 재능이 넘치며 다른 사람의 감정을 잘 읽습니다. 상상력이 풍부하고 낭만적이지만, 현실과 이상 사이에서 갈등하기도 합니다.",
    compatible: ["게자리", "전갈자리"],
    incompatible: ["쌍둥이자리", "사수자리"],
    luckyNumbers: [3, 9, 12],
    luckyColor: "\uD83D\uDFE2 초록색",
  },
  {
    name: "양자리",
    symbol: "\u2648",
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    element: "\uD83D\uDD25 불",
    elementColor: "text-red-700",
    elementBg: "bg-red-50 border-red-200",
    planet: "\u2642\uFE0F 화성",
    personality:
      "열정적이고 도전을 두려워하지 않는 리더형입니다. 에너지가 넘치고 행동력이 뛰어나며 새로운 시작을 좋아합니다. 솔직하고 직선적인 성격으로 주변을 이끌지만, 성급할 때도 있습니다.",
    compatible: ["사자자리", "사수자리"],
    incompatible: ["게자리", "염소자리"],
    luckyNumbers: [1, 8, 17],
    luckyColor: "\uD83D\uDD34 빨간색",
  },
  {
    name: "황소자리",
    symbol: "\u2649",
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    element: "\uD83C\uDF0D 땅",
    elementColor: "text-amber-800",
    elementBg: "bg-amber-50 border-amber-200",
    planet: "\u2640\uFE0F 금성",
    personality:
      "안정적이고 현실적인 성격으로 한번 시작하면 끝까지 해내는 끈기가 있습니다. 미적 감각이 뛰어나고 맛있는 음식과 편안함을 사랑합니다. 충성스럽고 믿음직하지만, 고집이 셀 수 있습니다.",
    compatible: ["처녀자리", "염소자리"],
    incompatible: ["물병자리", "사자자리"],
    luckyNumbers: [2, 6, 14],
    luckyColor: "\uD83D\uDFE2 초록색",
  },
  {
    name: "쌍둥이자리",
    symbol: "\u264A",
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 21,
    element: "\uD83C\uDF2C\uFE0F 바람",
    elementColor: "text-sky-700",
    elementBg: "bg-sky-50 border-sky-200",
    planet: "\u2638\uFE0F 수성",
    personality:
      "호기심이 많고 재치 있는 소통의 달인입니다. 다재다능하며 새로운 정보를 빠르게 습득합니다. 유머 감각이 뛰어나고 사교적이지만, 변덕스럽다는 소리를 들을 때도 있습니다.",
    compatible: ["물병자리", "천칭자리"],
    incompatible: ["처녀자리", "물고기자리"],
    luckyNumbers: [5, 7, 14],
    luckyColor: "\uD83D\uDFE1 노란색",
  },
  {
    name: "게자리",
    symbol: "\u264B",
    startMonth: 6,
    startDay: 22,
    endMonth: 7,
    endDay: 22,
    element: "\uD83D\uDCA7 물",
    elementColor: "text-blue-700",
    elementBg: "bg-blue-50 border-blue-200",
    planet: "\uD83C\uDF19 달",
    personality:
      "가정적이고 따뜻한 마음을 가진 보호자형입니다. 감정이 풍부하고 직감이 뛰어나며 사랑하는 사람을 위해 헌신합니다. 기억력이 좋고 요리를 잘하지만, 감정 기복이 있을 수 있습니다.",
    compatible: ["전갈자리", "물고기자리"],
    incompatible: ["양자리", "천칭자리"],
    luckyNumbers: [2, 7, 11],
    luckyColor: "\u26AA 은색",
  },
  {
    name: "사자자리",
    symbol: "\u264C",
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    element: "\uD83D\uDD25 불",
    elementColor: "text-red-700",
    elementBg: "bg-red-50 border-red-200",
    planet: "\u2600\uFE0F 태양",
    personality:
      "카리스마 넘치고 자신감 있는 주인공형입니다. 관대하고 따뜻한 마음으로 주변 사람들에게 힘을 줍니다. 창의적이고 무대 위에서 빛나지만, 인정받지 못하면 속상해할 수 있습니다.",
    compatible: ["양자리", "사수자리"],
    incompatible: ["황소자리", "전갈자리"],
    luckyNumbers: [1, 3, 10],
    luckyColor: "\uD83D\uDFE0 주황색",
  },
  {
    name: "처녀자리",
    symbol: "\u264D",
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    element: "\uD83C\uDF0D 땅",
    elementColor: "text-amber-800",
    elementBg: "bg-amber-50 border-amber-200",
    planet: "\u2638\uFE0F 수성",
    personality:
      "꼼꼼하고 분석적인 완벽주의자입니다. 세심한 관찰력으로 다른 사람이 놓치는 것까지 챙깁니다. 실용적이고 건강에 관심이 많지만, 지나치게 걱정하거나 비판적일 수 있습니다.",
    compatible: ["황소자리", "염소자리"],
    incompatible: ["쌍둥이자리", "사수자리"],
    luckyNumbers: [5, 14, 23],
    luckyColor: "\uD83D\uDFE4 갈색",
  },
  {
    name: "천칭자리",
    symbol: "\u264E",
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    element: "\uD83C\uDF2C\uFE0F 바람",
    elementColor: "text-sky-700",
    elementBg: "bg-sky-50 border-sky-200",
    planet: "\u2640\uFE0F 금성",
    personality:
      "조화와 균형을 사랑하는 평화주의자입니다. 세련된 미적 감각을 가지고 있으며 공정함을 중요시합니다. 사교적이고 매력적이지만, 우유부단하다는 평을 듣기도 합니다.",
    compatible: ["쌍둥이자리", "물병자리"],
    incompatible: ["게자리", "염소자리"],
    luckyNumbers: [6, 15, 24],
    luckyColor: "\uD83D\uDFE4 분홍색",
  },
  {
    name: "전갈자리",
    symbol: "\u264F",
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    element: "\uD83D\uDCA7 물",
    elementColor: "text-blue-700",
    elementBg: "bg-blue-50 border-blue-200",
    planet: "\uD83E\uDE90 명왕성",
    personality:
      "강렬한 카리스마와 깊은 통찰력의 소유자입니다. 한번 마음먹으면 끝까지 파고드는 집중력이 있습니다. 충성스럽고 열정적이지만, 질투심이 강하고 비밀스러운 면이 있습니다.",
    compatible: ["게자리", "물고기자리"],
    incompatible: ["물병자리", "사자자리"],
    luckyNumbers: [8, 11, 18],
    luckyColor: "\uD83D\uDFE4 검정색",
  },
  {
    name: "사수자리",
    symbol: "\u2650",
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    element: "\uD83D\uDD25 불",
    elementColor: "text-red-700",
    elementBg: "bg-red-50 border-red-200",
    planet: "\uD83E\uDE90 목성",
    personality:
      "낙천적이고 모험을 사랑하는 자유로운 탐험가입니다. 철학적이며 지식에 대한 갈증이 큽니다. 유머 감각이 뛰어나고 솔직하지만, 무책임하거나 과장하는 면이 있을 수 있습니다.",
    compatible: ["양자리", "사자자리"],
    incompatible: ["처녀자리", "물고기자리"],
    luckyNumbers: [3, 7, 21],
    luckyColor: "\uD83D\uDFE3 보라색",
  },
  {
    name: "염소자리",
    symbol: "\u2651",
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    element: "\uD83C\uDF0D 땅",
    elementColor: "text-amber-800",
    elementBg: "bg-amber-50 border-amber-200",
    planet: "\uD83E\uDE90 토성",
    personality:
      "책임감이 강하고 목표 지향적인 노력파입니다. 야심이 있으며 계획적으로 한 걸음씩 성공을 향해 나아갑니다. 신뢰할 수 있고 현실적이지만, 일 중독이 되거나 융통성이 부족할 수 있습니다.",
    compatible: ["황소자리", "처녀자리"],
    incompatible: ["양자리", "천칭자리"],
    luckyNumbers: [4, 8, 22],
    luckyColor: "\uD83D\uDFE4 갈색",
  },
];

function getConstellation(month: number, day: number): ConstellationInfo | null {
  for (const c of constellations) {
    if (c.startMonth === c.endMonth) {
      if (month === c.startMonth && day >= c.startDay && day <= c.endDay) return c;
    } else if (c.endMonth < c.startMonth) {
      // Wraps around year (Capricorn: 12/22 ~ 1/19)
      if (
        (month === c.startMonth && day >= c.startDay) ||
        (month === c.endMonth && day <= c.endDay)
      )
        return c;
    } else {
      if (
        (month === c.startMonth && day >= c.startDay) ||
        (month === c.endMonth && day <= c.endDay)
      )
        return c;
    }
  }
  return null;
}

const daysInMonth: Record<number, number> = {
  1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
};

export default function ConstellationCalculator() {
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [result, setResult] = useState<ConstellationInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const maxDay = month > 0 ? daysInMonth[month] : 31;

  const handleCalculate = () => {
    if (month === 0 || day === 0) return;
    const found = getConstellation(month, day);
    setResult(found);
  };

  const handleMonthChange = (m: number) => {
    setMonth(m);
    if (day > daysInMonth[m]) {
      setDay(0);
    }
    setResult(null);
  };

  const handleReset = () => {
    setMonth(0);
    setDay(0);
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `${month}월 ${day}일 - ${result.name} (${result.symbol})\n원소: ${result.element} / 수호성: ${result.planet}\n잘 맞는 별자리: ${result.compatible.join(", ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        별자리 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        생일을 입력하면 나의 별자리와 성격, 궁합, 행운의 정보를 알려드립니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          생일을 선택하세요
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="calc-input calc-input-lg bg-white"
          >
            <option value={0}>-- 월 선택 --</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>

          <select
            value={day}
            onChange={(e) => {
              setDay(Number(e.target.value));
              setResult(null);
            }}
            className="calc-input calc-input-lg bg-white"
          >
            <option value={0}>-- 일 선택 --</option>
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>

          <button
            onClick={handleCalculate}
            disabled={month === 0 || day === 0}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            별자리 확인
          </button>
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
        <div className={`rounded-xl border overflow-hidden ${result.elementBg}`}>
          {/* 별자리 헤더 */}
          <div className="text-center py-8 px-6">
            <div className="text-7xl mb-3">{result.symbol}</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-3xl font-bold text-gray-900">
                {result.name}
              </h2>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-500"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-gray-600">
              {result.startMonth}월 {result.startDay}일 ~ {result.endMonth}월{" "}
              {result.endDay}일
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white/80 mx-4 rounded-xl p-5 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">원소</p>
                <p className={`text-lg font-semibold ${result.elementColor}`}>
                  {result.element}
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">수호성</p>
                <p className="text-lg font-semibold text-gray-800">
                  {result.planet}
                </p>
              </div>
            </div>
          </div>

          {/* 성격 특성 */}
          <div className="bg-white/80 mx-4 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">&#x1F4AC;</span> 성격 특성
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.personality}</p>
          </div>

          {/* 궁합 */}
          <div className="bg-white/80 mx-4 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">&#x1F495;</span> 별자리 궁합
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 font-medium mb-1">
                  잘 맞는 별자리
                </p>
                <p className="text-green-800 font-semibold">
                  {result.compatible.join(", ")}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 font-medium mb-1">
                  안 맞는 별자리
                </p>
                <p className="text-red-800 font-semibold">
                  {result.incompatible.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* 행운의 정보 */}
          <div className="bg-white/80 mx-4 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">&#x1F340;</span> 행운의 정보
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                <p className="text-xs text-yellow-700 mb-1">행운의 숫자</p>
                <p className="text-lg font-bold text-yellow-800">
                  {result.luckyNumbers.join(", ")}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                <p className="text-xs text-purple-700 mb-1">행운의 색상</p>
                <p className="text-lg font-bold text-purple-800">
                  {result.luckyColor}
                </p>
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            별자리란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            별자리(Zodiac)는 태양이 지나는 황도대를 12등분하여 각각의 구간에
            이름을 붙인 것입니다. 서양 점성술에서는 태어난 날짜에 태양이 위치한
            별자리를 그 사람의 별자리로 봅니다. 각 별자리는 고유한 성격 특성,
            원소(불, 땅, 바람, 물), 수호 행성을 가지고 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            12별자리 날짜 총정리
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    별자리
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    날짜
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    원소
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    수호성
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {constellations.map((c) => (
                  <tr key={c.name}>
                    <td className="py-2 px-3 border border-gray-200 font-medium">
                      {c.symbol} {c.name}
                    </td>
                    <td className="py-2 px-3 border border-gray-200">
                      {c.startMonth}/{c.startDay} ~ {c.endMonth}/{c.endDay}
                    </td>
                    <td className="py-2 px-3 border border-gray-200">
                      {c.element}
                    </td>
                    <td className="py-2 px-3 border border-gray-200">
                      {c.planet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4원소와 별자리
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-1">
                불 (Fire)
              </h3>
              <p className="text-sm text-red-700">
                양자리, 사자자리, 사수자리 - 열정적이고 에너지가 넘칩니다.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-1">
                땅 (Earth)
              </h3>
              <p className="text-sm text-amber-700">
                황소자리, 처녀자리, 염소자리 - 안정적이고 현실적입니다.
              </p>
            </div>
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <h3 className="font-semibold text-sky-800 mb-1">
                바람 (Air)
              </h3>
              <p className="text-sm text-sky-700">
                쌍둥이자리, 천칭자리, 물병자리 - 지적이고 소통을 잘합니다.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-1">
                물 (Water)
              </h3>
              <p className="text-sm text-blue-700">
                게자리, 전갈자리, 물고기자리 - 감성적이고 직관이 강합니다.
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
                별자리 경계일에 태어났다면?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                별자리 경계일(커스프)에 태어난 사람은 두 별자리의 특성을 모두
                가질 수 있습니다. 정확한 별자리는 태어난 연도와 시간에 따라
                달라질 수 있으며, 본 계산기는 일반적인 날짜 기준으로
                계산합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                별자리 궁합은 정확한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                별자리 궁합은 같은 원소나 보완적인 원소끼리 잘 맞는다는
                전통적인 해석을 따릅니다. 재미로 참고하시되, 실제 인간관계는
                훨씬 더 복잡하고 다양한 요소에 의해 결정됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                양력과 음력 중 어떤 것을 사용하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                서양 별자리는 양력(태양력) 기준입니다. 음력 생일만 아시는
                경우, 양력으로 변환한 후 입력해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="constellation" />
    </div>
  );
}
