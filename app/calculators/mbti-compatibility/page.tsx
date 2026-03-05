"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

const MBTI_TYPES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
] as const;

type MbtiType = (typeof MBTI_TYPES)[number];

const MBTI_NICKNAMES: Record<MbtiType, string> = {
  ISTJ: "청렴결백한 논리주의자",
  ISFJ: "용감한 수호자",
  INFJ: "선의의 옹호자",
  INTJ: "용의주도한 전략가",
  ISTP: "만능 재주꾼",
  ISFP: "호기심 많은 예술가",
  INFP: "열정적인 중재자",
  INTP: "논리적인 사색가",
  ESTP: "모험을 즐기는 사업가",
  ESFP: "자유로운 영혼의 연예인",
  ENFP: "재기발랄한 활동가",
  ENTP: "논쟁을 즐기는 변론가",
  ESTJ: "엄격한 관리자",
  ESFJ: "사교적인 외교관",
  ENFJ: "정의로운 사회운동가",
  ENTJ: "대담한 통솔자",
};

// Perfect matches (95-100)
const PERFECT_MATCHES: [MbtiType, MbtiType][] = [
  ["INFP", "ENFJ"],
  ["INFJ", "ENFP"],
  ["INTP", "ENTJ"],
  ["INTJ", "ENTP"],
  ["ISFP", "ESFJ"],
  ["ISFJ", "ESFP"],
  ["ISTP", "ESTJ"],
  ["ISTJ", "ESTP"],
];

function countDifferences(a: MbtiType, b: MbtiType): number {
  let diff = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

function sameNorS(a: MbtiType, b: MbtiType): boolean {
  return a[1] === b[1]; // both N or both S
}

interface CompatibilityResult {
  score: number;
  grade: string;
  color: string;
  bgColor: string;
  comment: string;
  strengths: string[];
  weaknesses: string[];
}

function calculateCompatibility(a: MbtiType, b: MbtiType): CompatibilityResult {
  // Check perfect match
  const isPerfect = PERFECT_MATCHES.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  );
  if (isPerfect) {
    return {
      score: 95 + 0, // 95-100
      grade: "천생연분",
      color: "text-emerald-600",
      bgColor: "bg-emerald-500",
      comment: `${MBTI_NICKNAMES[a]}(${a})와 ${MBTI_NICKNAMES[b]}(${b})는 천생연분! 서로의 부족한 부분을 완벽하게 채워주는 최고의 조합입니다. 자연스럽게 서로에게 끌리며, 함께할수록 더 성장하는 관계가 됩니다.`,
      strengths: ["서로의 약점을 보완", "자연스러운 소통", "깊은 유대감 형성", "함께 성장하는 관계"],
      weaknesses: ["너무 의존적이 될 수 있음", "갈등 시 상처가 클 수 있음"],
    };
  }

  // Same type
  if (a === b) {
    return {
      score: 70 + 0,
      grade: "보통",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500",
      comment: `같은 ${a} 유형끼리는 서로를 깊이 이해할 수 있지만, 비슷한 단점도 공유하게 됩니다. 장점은 극대화되고, 단점도 극대화될 수 있는 양날의 검 같은 조합입니다.`,
      strengths: ["서로를 깊이 이해", "공통 관심사가 많음", "같은 가치관 공유"],
      weaknesses: ["같은 약점을 공유", "자극이 부족할 수 있음", "성장 포인트가 적음"],
    };
  }

  const diff = countDifferences(a, b);
  const samePerception = sameNorS(a, b);

  if (diff === 1 && samePerception) {
    return {
      score: 80 + 5,
      grade: "좋은 궁합",
      color: "text-green-600",
      bgColor: "bg-green-500",
      comment: `${a}와 ${b}는 비슷하면서도 서로에게 새로운 시각을 제공하는 좋은 조합입니다. 기본적인 세계관이 같아 소통이 원활하고, 작은 차이가 관계에 신선함을 더합니다.`,
      strengths: ["원활한 의사소통", "비슷한 세계관", "적당한 차이로 인한 신선함"],
      weaknesses: ["차이가 적어 자극이 부족할 수 있음"],
    };
  }

  if (diff === 1) {
    return {
      score: 75 + 5,
      grade: "좋은 궁합",
      color: "text-green-600",
      bgColor: "bg-green-500",
      comment: `${a}와 ${b}는 하나의 차이점이 오히려 매력 포인트가 됩니다. 대체로 잘 맞으며, 서로의 다른 면에서 배울 점을 발견할 수 있는 조합입니다.`,
      strengths: ["높은 이해도", "적은 갈등", "서로에게서 배움"],
      weaknesses: ["한 가지 차이가 반복적 갈등 원인이 될 수 있음"],
    };
  }

  if (diff === 2) {
    return {
      score: 68,
      grade: "보통",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500",
      comment: `${a}와 ${b}는 서로 다른 점도 있지만 공통점도 충분합니다. 서로를 이해하려는 노력이 있다면 좋은 관계를 유지할 수 있습니다. 차이점이 오히려 서로를 성장시키는 계기가 될 수 있습니다.`,
      strengths: ["균형 잡힌 관계", "서로 다른 관점 제공", "성장 가능성이 높음"],
      weaknesses: ["소통 방식의 차이", "가치관 충돌 가능성", "이해하려는 노력 필요"],
    };
  }

  if (diff === 3) {
    return {
      score: 48,
      grade: "노력 필요",
      color: "text-orange-600",
      bgColor: "bg-orange-500",
      comment: `${a}와 ${b}는 많이 다른 유형입니다. 서로의 차이를 인정하고 존중하는 것이 관계의 핵심입니다. 쉽지 않지만, 노력한다면 서로에게 가장 많이 배울 수 있는 조합이기도 합니다.`,
      strengths: ["서로에게서 많이 배울 수 있음", "다양한 관점 확보"],
      weaknesses: ["잦은 오해 가능", "소통 방식의 큰 차이", "가치관 충돌", "서로의 행동 이해 어려움"],
    };
  }

  // diff === 4
  return {
    score: 28,
    grade: "상극",
    color: "text-red-600",
    bgColor: "bg-red-500",
    comment: `${a}와 ${b}는 모든 면에서 반대인 유형입니다. 처음에는 서로의 다른 면에 끌릴 수 있지만, 시간이 지나면 큰 갈등이 생길 수 있습니다. 극과 극은 통한다는 말처럼, 서로를 완전히 보완할 수도 있습니다.`,
    strengths: ["완전히 새로운 시각 제공", "극적인 상호보완 가능"],
    weaknesses: ["근본적인 가치관 차이", "의사소통 어려움", "생활 방식 충돌", "상대 이해에 큰 노력 필요"],
  };
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const gaugeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-sm text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

export default function MbtiCompatibilityPage() {
  const [myMbti, setMyMbti] = useState<MbtiType | null>(null);
  const [partnerMbti, setPartnerMbti] = useState<MbtiType | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result || !myMbti || !partnerMbti) return;
    const text = `[MBTI 궁합] ${myMbti} + ${partnerMbti} = ${result.score}점 (${result.grade})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleTest = () => {
    if (!myMbti || !partnerMbti) return;
    setResult(calculateCompatibility(myMbti, partnerMbti));
  };

  const handleReset = () => {
    setMyMbti(null);
    setPartnerMbti(null);
    setResult(null);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">MBTI 궁합 테스트</h1>
      <p className="text-gray-500 mb-8">
        나와 상대의 MBTI를 선택하고 궁합 점수를 확인해 보세요.
      </p>

      {/* 나의 MBTI */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">나의 MBTI</h2>
        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPES.map((type) => (
            <button
              key={`my-${type}`}
              onClick={() => setMyMbti(type)}
              className={`py-2.5 px-1 rounded-lg text-sm font-semibold transition-all ${
                myMbti === type
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {myMbti && (
          <p className="mt-3 text-sm text-blue-600 font-medium">
            {myMbti} - {MBTI_NICKNAMES[myMbti]}
          </p>
        )}
      </div>

      {/* 상대 MBTI */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">상대 MBTI</h2>
        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPES.map((type) => (
            <button
              key={`partner-${type}`}
              onClick={() => setPartnerMbti(type)}
              className={`py-2.5 px-1 rounded-lg text-sm font-semibold transition-all ${
                partnerMbti === type
                  ? "bg-pink-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {partnerMbti && (
          <p className="mt-3 text-sm text-pink-600 font-medium">
            {partnerMbti} - {MBTI_NICKNAMES[partnerMbti]}
          </p>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleTest}
          disabled={!myMbti || !partnerMbti}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          궁합 확인하기
        </button>
        <button
          onClick={handleReset}
          className="calc-btn-secondary"
        >
          초기화
        </button>
      </div>

      {/* 결과 */}
      {result && myMbti && partnerMbti && (
        <div className="calc-card overflow-hidden mb-8">
          {/* 점수 헤더 */}
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{myMbti}</div>
                <div className="text-xs text-gray-500 mt-1">{MBTI_NICKNAMES[myMbti]}</div>
              </div>
              <div className="text-2xl text-pink-400">+</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{partnerMbti}</div>
                <div className="text-xs text-gray-500 mt-1">{MBTI_NICKNAMES[partnerMbti]}</div>
              </div>
            </div>

            <ScoreGauge score={result.score} color={result.color} />

            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`inline-block px-4 py-1.5 rounded-full text-white font-semibold ${result.bgColor}`}>
                {result.grade}
              </div>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-500"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
          </div>

          {/* 분석 코멘트 */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">궁합 분석</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{result.comment}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">강점 포인트</h4>
                <ul className="space-y-1">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">약점 포인트</h4>
                <ul className="space-y-1">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">-</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">MBTI 궁합이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            MBTI(Myers-Briggs Type Indicator)는 성격유형 검사로, 외향(E)/내향(I),
            감각(S)/직관(N), 사고(T)/감정(F), 판단(J)/인식(P)의 4가지 축으로
            총 16가지 성격유형을 분류합니다. MBTI 궁합은 두 사람의 성격유형이
            얼마나 잘 맞는지를 점수와 분석으로 보여주는 재미있는 테스트입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">MBTI 궁합 보는 법</h2>
          <p className="text-gray-600 leading-relaxed">
            MBTI 궁합은 각 지표의 일치 여부와 보완 관계를 기반으로 판단합니다.
            일반적으로 N(직관)끼리 또는 S(감각)끼리 만나면 세계관이 비슷하여
            소통이 원활합니다. 천생연분 조합은 대부분 내향/외향만 다르고
            나머지가 보완되는 관계입니다. 다만 MBTI 궁합은 재미로 보는 것이며,
            실제 관계는 서로의 노력과 이해가 가장 중요합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">천생연분 MBTI 조합</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">유형 1</th>
                  <th className="text-left py-2 px-3 border border-gray-200">유형 2</th>
                  <th className="text-left py-2 px-3 border border-gray-200">특징</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">INFP</td><td className="py-2 px-3 border border-gray-200">ENFJ</td><td className="py-2 px-3 border border-gray-200">이상주의적 가치관 공유 + 외향/내향 보완</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">INFJ</td><td className="py-2 px-3 border border-gray-200">ENFP</td><td className="py-2 px-3 border border-gray-200">깊은 대화 + 에너지 교환</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">INTP</td><td className="py-2 px-3 border border-gray-200">ENTJ</td><td className="py-2 px-3 border border-gray-200">논리적 사고 + 실행력 보완</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">INTJ</td><td className="py-2 px-3 border border-gray-200">ENTP</td><td className="py-2 px-3 border border-gray-200">전략적 사고 + 창의적 아이디어</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">ISFP</td><td className="py-2 px-3 border border-gray-200">ESFJ</td><td className="py-2 px-3 border border-gray-200">감성적 교감 + 돌봄 보완</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">ISFJ</td><td className="py-2 px-3 border border-gray-200">ESFP</td><td className="py-2 px-3 border border-gray-200">안정감 + 활력 교환</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">ISTP</td><td className="py-2 px-3 border border-gray-200">ESTJ</td><td className="py-2 px-3 border border-gray-200">실용적 문제 해결 + 체계적 관리</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">ISTJ</td><td className="py-2 px-3 border border-gray-200">ESTP</td><td className="py-2 px-3 border border-gray-200">신뢰감 + 모험 보완</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">MBTI 궁합이 안 좋으면 사귀면 안 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                MBTI 궁합은 재미로 보는 것입니다. 실제 관계에서 중요한 것은 서로에 대한 이해, 존중, 소통입니다.
                MBTI가 다르더라도 충분히 좋은 관계를 유지할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">같은 MBTI끼리 궁합이 좋은가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                같은 유형끼리는 서로를 깊이 이해할 수 있지만, 같은 약점도 공유하게 됩니다.
                적당히 다른 부분이 있는 것이 서로를 보완하고 성장하는 데 도움이 됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">MBTI는 변할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                MBTI는 고정된 것이 아니라 환경, 경험, 성장에 따라 변할 수 있습니다.
                특히 경계선에 있는 지표는 시기에 따라 다르게 나올 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="mbti-compatibility" />
    </div>
  );
}
