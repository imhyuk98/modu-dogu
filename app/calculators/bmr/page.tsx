"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface BMRResult {
  mifflin: number;
  harris: number;
}

function calculateBMR(gender: "male" | "female", age: number, height: number, weight: number): BMRResult {
  let mifflin: number;
  let harris: number;

  if (gender === "male") {
    mifflin = 10 * weight + 6.25 * height - 5 * age + 5;
    harris = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  } else {
    mifflin = 10 * weight + 6.25 * height - 5 * age - 161;
    harris = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  }

  return {
    mifflin: Math.round(mifflin),
    harris: Math.round(harris),
  };
}

const ACTIVITY_LEVELS = [
  { label: "거의 운동 안 함", factor: 1.2, desc: "좌식 생활, 운동 거의 없음" },
  { label: "가벼운 운동", factor: 1.375, desc: "주 1~3회 가벼운 운동" },
  { label: "보통 운동", factor: 1.55, desc: "주 3~5회 중간 강도 운동" },
  { label: "활발한 운동", factor: 1.725, desc: "주 6~7회 높은 강도 운동" },
  { label: "매우 활발한 운동", factor: 1.9, desc: "운동선수 수준, 하루 2회 이상" },
];

export default function BMRCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [copied, setCopied] = useState(false);

  const result = useMemo<BMRResult | null>(() => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return null;
    return calculateBMR(gender, a, h, w);
  }, [gender, age, height, weight]);

  const handleReset = () => {
    setGender("male");
    setAge("25");
    setHeight("170");
    setWeight("70");
    setCopied(false);
  };

  const handleCopy = async (text: string) => {
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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">기초대사량(BMR) 계산기</h1>
      <p className="text-gray-500 mb-8">
        성별, 나이, 키, 몸무게를 입력하면 기초대사량(BMR)을 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        {/* 성별 토글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                gender === "male"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                gender === "female"
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
            <div className="relative">
              <input type="number" step="1" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키</label>
            <div className="relative">
              <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">몸무게</label>
            <div className="relative">
              <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset}
            className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className={`${gender === "male" ? "bg-blue-600" : "bg-pink-500"} text-white p-6 text-center`}>
            <p className="text-sm opacity-80 mb-1">Mifflin-St Jeor 기초대사량</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.mifflin.toLocaleString()}<span className="text-xl ml-1">kcal</span></p>
              <button
                onClick={() => handleCopy(`기초대사량(Mifflin-St Jeor): ${result.mifflin}kcal, (Harris-Benedict): ${result.harris}kcal`)}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                title="복사"
                aria-label="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-sm opacity-80 mt-3">
              하루에 최소 <strong className="text-white">{result.mifflin.toLocaleString()}kcal</strong>을 섭취해야 합니다
            </p>
          </div>
          <div className="p-6 space-y-4">
            {/* Harris-Benedict 비교 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Harris-Benedict 공식</span>
                <span className="text-lg font-bold text-gray-900">{result.harris.toLocaleString()} kcal</span>
              </div>
              <p className="text-xs text-gray-500">
                두 공식의 차이: {Math.abs(result.mifflin - result.harris)} kcal
              </p>
            </div>

            {/* 활동 수준별 소비 칼로리 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">활동 수준별 일일 소비 칼로리 (TDEE)</h3>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((level) => {
                  const tdee = Math.round(result.mifflin * level.factor);
                  return (
                    <div key={level.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{level.label}</span>
                        <span className="text-xs text-gray-400 ml-2">({level.desc})</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{tdee.toLocaleString()} kcal</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">기초대사량 (Mifflin-St Jeor)</p>
              <p className={`text-lg font-extrabold ${gender === "male" ? "text-blue-600" : "text-pink-500"}`}>{result.mifflin.toLocaleString()} kcal</p>
            </div>
            <button onClick={() => handleCopy(`기초대사량: ${result.mifflin}kcal`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">기초대사량(BMR)이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            기초대사량(BMR, Basal Metabolic Rate)은 생명을 유지하는 데 필요한 최소한의 에너지량입니다.
            숨쉬기, 혈액 순환, 세포 생산, 체온 유지 등 아무것도 하지 않고 가만히 있어도 소모되는 칼로리를 말합니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            전체 에너지 소비량의 약 <strong>60~75%</strong>가 기초대사량에 의해 소모됩니다.
            나머지는 활동대사량(약 20~30%)과 음식을 소화하는 데 필요한 식이성 열발생(약 10%)이 차지합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">BMR 계산 공식 설명</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Mifflin-St Jeor 공식 (1990년)</h3>
              <p className="text-sm text-gray-600 mb-2">현재 가장 정확하다고 인정받는 공식입니다.</p>
              <div className="text-sm text-gray-700 space-y-1 font-mono bg-white p-3 rounded border">
                <p>남성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) + 5</p>
                <p>여성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) - 161</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Harris-Benedict 공식 (1919년, 1984년 개정)</h3>
              <p className="text-sm text-gray-600 mb-2">오랫동안 사용된 전통적인 공식으로, Mifflin-St Jeor보다 약간 높게 나오는 경향이 있습니다.</p>
              <div className="text-sm text-gray-700 space-y-1 font-mono bg-white p-3 rounded border">
                <p>남성: 66.47 + (13.75 x 체중kg) + (5.003 x 키cm) - (6.755 x 나이)</p>
                <p>여성: 655.1 + (9.563 x 체중kg) + (1.85 x 키cm) - (4.676 x 나이)</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">기초대사량을 높이는 방법</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span><strong>근력 운동</strong> - 근육량이 늘어나면 기초대사량도 올라갑니다. 근육은 지방보다 3배 더 많은 에너지를 소비합니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>단백질 섭취</strong> - 단백질은 소화 과정에서 탄수화물이나 지방보다 더 많은 에너지를 소비합니다 (식이성 열발생 효과).</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span><strong>충분한 수면</strong> - 수면 부족은 대사를 낮추고 호르몬 불균형을 초래합니다. 7~9시간의 수면을 권장합니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span><strong>충분한 수분 섭취</strong> - 하루 2L 이상의 물을 마시면 대사율이 일시적으로 약 30% 증가할 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">5.</span><span><strong>극단적 다이어트 피하기</strong> - 지나치게 적게 먹으면 몸이 에너지 절약 모드로 전환되어 기초대사량이 떨어집니다.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Q. BMR과 TDEE의 차이는 무엇인가요?</h3>
              <p className="text-sm text-gray-600">
                BMR(기초대사량)은 아무 활동을 하지 않았을 때 소모되는 최소 칼로리이고,
                TDEE(총 일일 에너지 소비량)는 BMR에 활동대사량을 더한 실제 하루 소비 칼로리입니다.
                다이어트 시에는 TDEE를 기준으로 칼로리를 조절해야 합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Q. 기초대사량보다 적게 먹어도 되나요?</h3>
              <p className="text-sm text-gray-600">
                기초대사량 이하로 섭취하면 신체가 에너지 절약 모드로 전환되어 근육 손실, 대사 저하, 영양 결핍 등의
                문제가 발생할 수 있습니다. 다이어트를 하더라도 최소한 BMR 이상은 섭취하는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Q. 나이가 들면 기초대사량이 줄어드나요?</h3>
              <p className="text-sm text-gray-600">
                네, 나이가 들수록 근육량이 감소하고 호르몬 변화가 일어나면서 기초대사량이 자연스럽게 줄어듭니다.
                30대 이후 10년마다 약 3~5%씩 감소하는 것으로 알려져 있습니다.
                꾸준한 근력 운동으로 이 감소를 늦출 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Q. 두 공식 중 어떤 것이 더 정확한가요?</h3>
              <p className="text-sm text-gray-600">
                미국영양학회(ADA)는 <strong>Mifflin-St Jeor 공식</strong>을 가장 정확한 BMR 계산법으로 권장합니다.
                Harris-Benedict 공식은 실제 기초대사량보다 약 5% 정도 높게 측정되는 경향이 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="bmr" />
    </div>
  );
}
