"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type BloodType = "A" | "B" | "O" | "AB";

// 각 혈액형의 가능한 유전자형
const genotypes: Record<BloodType, string[][]> = {
  A: [["A", "A"], ["A", "O"]],
  B: [["B", "B"], ["B", "O"]],
  O: [["O", "O"]],
  AB: [["A", "B"]],
};

// 대립유전자 조합 → 혈액형 판정
function getAlleles(a: string, b: string): BloodType {
  const pair = [a, b].sort().join("");
  if (pair === "AA" || pair === "AO") return "A";
  if (pair === "BB" || pair === "BO") return "B";
  if (pair === "OO") return "O";
  if (pair === "AB") return "AB";
  return "O";
}

function calculateBloodType(
  father: BloodType,
  mother: BloodType
): Record<BloodType, number> {
  const result: Record<BloodType, number> = { A: 0, B: 0, O: 0, AB: 0 };
  const fatherGenos = genotypes[father];
  const motherGenos = genotypes[mother];

  let totalCombinations = 0;

  for (const fg of fatherGenos) {
    for (const mg of motherGenos) {
      // 각 부모 유전자형에서 하나씩 물려받는 4가지 경우
      for (const fa of fg) {
        for (const ma of mg) {
          const childType = getAlleles(fa, ma);
          result[childType]++;
          totalCombinations++;
        }
      }
    }
  }

  // 확률로 변환
  for (const key of Object.keys(result) as BloodType[]) {
    result[key] = Math.round((result[key] / totalCombinations) * 100);
  }

  return result;
}

const bloodTypeColors: Record<BloodType, { bg: string; bar: string; text: string }> = {
  A: { bg: "bg-blue-50", bar: "bg-blue-500", text: "text-blue-700" },
  B: { bg: "bg-emerald-50", bar: "bg-emerald-500", text: "text-emerald-700" },
  O: { bg: "bg-amber-50", bar: "bg-amber-500", text: "text-amber-700" },
  AB: { bg: "bg-rose-50", bar: "bg-rose-500", text: "text-rose-700" },
};

const bloodTypes: BloodType[] = ["A", "B", "O", "AB"];

export default function BloodTypeCalculator() {
  const [father, setFather] = useState<BloodType>("A");
  const [mother, setMother] = useState<BloodType>("B");
  const [result, setResult] = useState<Record<BloodType, number> | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    setResult(calculateBloodType(father, mother));
  };

  const handleReset = () => {
    setFather("A");
    setMother("B");
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const possible = bloodTypes.filter((bt) => result[bt] > 0).map((bt) => `${bt}형 ${result[bt]}%`).join(", ");
    const text = `아빠 ${father}형 + 엄마 ${mother}형 = ${possible}`;
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
        아기 혈액형 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        부모의 혈액형을 선택하면 유전학 기반으로 태어날 아기의 혈액형 확률을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 아빠 혈액형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아빠 혈액형
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((bt) => (
                <button
                  key={`father-${bt}`}
                  onClick={() => setFather(bt)}
                  className={`py-3 rounded-lg font-bold text-lg transition-all ${
                    father === bt
                      ? `${bloodTypeColors[bt].bar} text-white shadow-md scale-105`
                      : `${bloodTypeColors[bt].bg} ${bloodTypeColors[bt].text} hover:shadow-sm`
                  }`}
                >
                  {bt}형
                </button>
              ))}
            </div>
          </div>

          {/* 엄마 혈액형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              엄마 혈액형
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((bt) => (
                <button
                  key={`mother-${bt}`}
                  onClick={() => setMother(bt)}
                  className={`py-3 rounded-lg font-bold text-lg transition-all ${
                    mother === bt
                      ? `${bloodTypeColors[bt].bar} text-white shadow-md scale-105`
                      : `${bloodTypeColors[bt].bg} ${bloodTypeColors[bt].text} hover:shadow-sm`
                  }`}
                >
                  {bt}형
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 선택 요약 */}
        <div className="mt-6 flex items-center justify-center gap-3 text-lg">
          <span className={`px-4 py-2 rounded-full font-bold ${bloodTypeColors[father].bg} ${bloodTypeColors[father].text}`}>
            아빠 {father}형
          </span>
          <span className="text-2xl text-gray-400">+</span>
          <span className={`px-4 py-2 rounded-full font-bold ${bloodTypeColors[mother].bg} ${bloodTypeColors[mother].text}`}>
            엄마 {mother}형
          </span>
          <span className="text-2xl text-gray-400">=</span>
          <span className="text-gray-500 font-medium">?</span>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCalculate}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg text-lg"
          >
            아기 혈액형 확인하기
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
        <div className="calc-card overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 text-center">
            <p className="text-pink-100 text-sm mb-1">아빠 {father}형 + 엄마 {mother}형</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold">아기 혈액형 확률</p>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-pink-200 rounded hover:bg-white/20 transition-colors text-pink-100"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* 바 차트 */}
            <div className="space-y-4">
              {bloodTypes.map((bt) => (
                <div key={bt}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-lg ${bloodTypeColors[bt].text}`}>
                      {bt}형
                    </span>
                    <span className={`font-bold text-lg ${result[bt] > 0 ? bloodTypeColors[bt].text : "text-gray-300"}`}>
                      {result[bt]}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${bloodTypeColors[bt].bar} flex items-center justify-center`}
                      style={{ width: `${result[bt]}%`, minWidth: result[bt] > 0 ? "2rem" : "0" }}
                    >
                      {result[bt] >= 15 && (
                        <span className="text-white text-sm font-semibold">{result[bt]}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 가능한 혈액형 카드 */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bloodTypes.map((bt) => (
                <div
                  key={`card-${bt}`}
                  className={`rounded-xl p-4 text-center transition-all ${
                    result[bt] > 0
                      ? `${bloodTypeColors[bt].bg} border-2 border-current ${bloodTypeColors[bt].text} shadow-sm`
                      : "bg-gray-50 border-2 border-gray-100 text-gray-300"
                  }`}
                >
                  <div className="text-3xl font-black mb-1">{bt}형</div>
                  <div className={`text-2xl font-bold ${result[bt] > 0 ? "" : "text-gray-300"}`}>
                    {result[bt]}%
                  </div>
                  {result[bt] === 0 && (
                    <p className="text-xs mt-1 text-gray-400">불가능</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="px-6 pb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <span className="font-semibold">참고:</span> 이 결과는 ABO 혈액형의 일반적인 유전 원리에 기반한 확률입니다.
                실제 혈액형은 유전자 검사로 확인하세요. 드물게 시스AB형, 봄베이형 등 예외적인 경우도 있을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">혈액형 유전 원리</h2>
          <p className="text-gray-600 leading-relaxed">
            ABO 혈액형은 부모로부터 각각 하나의 대립유전자를 물려받아 결정됩니다.
            A형은 AA 또는 AO 유전자형, B형은 BB 또는 BO 유전자형, O형은 OO 유전자형,
            AB형은 AB 유전자형을 가집니다. A와 B 유전자는 O에 대해 우성이며,
            A와 B 사이에는 공우성(codominance) 관계가 성립합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">부모 혈액형 조합표</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">부모 조합</th>
                  <th className="text-center py-2 px-3 border border-gray-200">가능한 자녀 혈액형</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">A x A</td><td className="text-center py-2 px-3 border border-gray-200">A, O</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">A x B</td><td className="text-center py-2 px-3 border border-gray-200">A, B, O, AB</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">A x O</td><td className="text-center py-2 px-3 border border-gray-200">A, O</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">A x AB</td><td className="text-center py-2 px-3 border border-gray-200">A, B, AB</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">B x B</td><td className="text-center py-2 px-3 border border-gray-200">B, O</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">B x O</td><td className="text-center py-2 px-3 border border-gray-200">B, O</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">B x AB</td><td className="text-center py-2 px-3 border border-gray-200">A, B, AB</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">O x O</td><td className="text-center py-2 px-3 border border-gray-200">O</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">O x AB</td><td className="text-center py-2 px-3 border border-gray-200">A, B</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">AB x AB</td><td className="text-center py-2 px-3 border border-gray-200">A, B, AB</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">O형 부모에게서 A형이나 B형 자녀가 나올 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">아닙니다. O형 부모(OO 유전자형)는 O 유전자만 가지고 있으므로, 두 부모가 모두 O형이면 자녀도 반드시 O형입니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">AB형 부모에게서 O형 자녀가 나올 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">일반적으로 불가능합니다. AB형 부모는 A와 B 유전자를 각각 하나씩 가지고 있어 O 유전자를 물려줄 수 없습니다. 단, 극히 드문 시스AB형의 경우 예외가 있을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rh 혈액형은 어떻게 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">Rh 혈액형은 ABO 혈액형과 별개의 유전 시스템입니다. Rh+(양성)이 Rh-(음성)에 대해 우성이며, 한국인의 약 99.9%가 Rh+입니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="blood-type" />
    </div>
  );
}
