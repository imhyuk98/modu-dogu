"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Gender = "male" | "female";

interface TDEEResult {
  bmr: number;
  tdee: number;
  weightLoss: number;
  maintenance: number;
  weightGain: number;
}

const ACTIVITY_LEVELS = [
  { label: "비활동적 (거의 운동 안 함)", multiplier: 1.2 },
  { label: "가벼운 활동 (주 1-3일 운동)", multiplier: 1.375 },
  { label: "보통 활동 (주 3-5일 운동)", multiplier: 1.55 },
  { label: "활발한 활동 (주 6-7일 운동)", multiplier: 1.725 },
  { label: "매우 활발 (운동선수급)", multiplier: 1.9 },
];

function calculateTDEE(gender: Gender, age: number, height: number, weight: number, activityIndex: number): TDEEResult {
  // Mifflin-St Jeor equation
  let bmr: number;
  if (gender === "male") {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  bmr = Math.round(bmr);

  const tdee = Math.round(bmr * ACTIVITY_LEVELS[activityIndex].multiplier);

  return {
    bmr,
    tdee,
    weightLoss: tdee - 500,
    maintenance: tdee,
    weightGain: tdee + 500,
  };
}

export default function TDEECalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [activityIndex, setActivityIndex] = useState(2); // 보통 활동
  const [copied, setCopied] = useState(false);

  const result = useMemo<TDEEResult | null>(() => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return null;
    return calculateTDEE(gender, a, h, w, activityIndex);
  }, [gender, age, height, weight, activityIndex]);

  const handleReset = () => {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setActivityIndex(2);
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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">일일 칼로리(TDEE) 계산기</h1>
      <p className="text-gray-500 mb-8">
        성별, 나이, 키, 몸무게, 활동량을 입력하면 하루 총 소비 칼로리(TDEE)를 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        {/* 성별 토글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                gender === "male"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                gender === "female"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
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

        {/* 활동량 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">활동량</label>
          <select
            value={activityIndex}
            onChange={(e) => setActivityIndex(Number(e.target.value))}
            className="calc-input calc-input-lg"
          >
            {ACTIVITY_LEVELS.map((level, i) => (
              <option key={i} value={i}>{level.label}</option>
            ))}
          </select>
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
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">하루 총 소비 칼로리 (TDEE)</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.tdee.toLocaleString()}</p>
              <span className="text-xl font-medium text-blue-200">kcal</span>
              <button
                onClick={() => handleCopy(`TDEE: ${result.tdee.toLocaleString()} kcal (BMR: ${result.bmr.toLocaleString()} kcal)`)}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="복사"
                aria-label="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">기초대사량(BMR): {result.bmr.toLocaleString()} kcal</p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">목표별 권장 칼로리</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <p className="text-sm text-green-700 font-medium mb-1">체중 감량</p>
                <p className="text-2xl font-bold text-green-600">{result.weightLoss.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1">TDEE - 500 kcal</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <p className="text-sm text-blue-700 font-medium mb-1">체중 유지</p>
                <p className="text-2xl font-bold text-blue-600">{result.maintenance.toLocaleString()}</p>
                <p className="text-xs text-blue-500 mt-1">TDEE kcal</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                <p className="text-sm text-orange-700 font-medium mb-1">체중 증가</p>
                <p className="text-2xl font-bold text-orange-600">{result.weightGain.toLocaleString()}</p>
                <p className="text-xs text-orange-500 mt-1">TDEE + 500 kcal</p>
              </div>
            </div>

            {/* BMR vs TDEE 비교 바 */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 w-12">BMR</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-300 h-full rounded-full transition-all" style={{ width: `${(result.bmr / result.tdee) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-600 font-medium w-24 text-right">{result.bmr.toLocaleString()} kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12">TDEE</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: "100%" }} />
                </div>
                <span className="text-xs text-gray-600 font-medium w-24 text-right">{result.tdee.toLocaleString()} kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 활동량별 TDEE 참고표 */}
      {result && (
        <div className="calc-card p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">활동량별 TDEE 비교</h3>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level, i) => {
              const tdee = Math.round(result.bmr * level.multiplier);
              const isActive = i === activityIndex;
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isActive ? "bg-blue-50 border border-blue-200" : ""}`}>
                  <div className={`w-4 h-4 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`} />
                  <span className={`text-sm flex-1 ${isActive ? "font-medium text-gray-900" : "text-gray-600"}`}>{level.label}</span>
                  <span className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>{tdee.toLocaleString()} kcal</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">TDEE (BMR: {result.bmr.toLocaleString()})</p>
              <p className="text-lg font-extrabold text-blue-600">{result.tdee.toLocaleString()} kcal</p>
            </div>
            <button onClick={() => handleCopy(`TDEE: ${result.tdee.toLocaleString()} kcal (BMR: ${result.bmr.toLocaleString()} kcal)`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">TDEE란?</h2>
          <p className="text-gray-600 leading-relaxed">
            TDEE(Total Daily Energy Expenditure, 일일 총 에너지 소비량)는 하루 동안 우리 몸이 소비하는 총 칼로리를 의미합니다.
            기초대사량(BMR)에 활동량 계수를 곱하여 산출합니다. TDEE를 알면 체중 감량, 유지, 증가 목표에 맞는 식단을 계획할 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            본 계산기는 <strong>Mifflin-St Jeor 공식</strong>을 사용합니다. 이 공식은 현재 가장 정확한 BMR 추정 공식으로 인정받고 있습니다.
            남성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) + 5, 여성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) - 161.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">활동량 수준 설명</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">활동 수준</th>
                  <th className="text-left py-2 px-3 border border-gray-200">설명</th>
                  <th className="text-right py-2 px-3 border border-gray-200">계수</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">비활동적</td>
                  <td className="py-2 px-3 border border-gray-200">데스크 작업, 운동 거의 안 함</td>
                  <td className="text-right py-2 px-3 border border-gray-200">1.2</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">가벼운 활동</td>
                  <td className="py-2 px-3 border border-gray-200">가벼운 운동/스포츠 주 1-3일</td>
                  <td className="text-right py-2 px-3 border border-gray-200">1.375</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">보통 활동</td>
                  <td className="py-2 px-3 border border-gray-200">중간 강도 운동 주 3-5일</td>
                  <td className="text-right py-2 px-3 border border-gray-200">1.55</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">활발한 활동</td>
                  <td className="py-2 px-3 border border-gray-200">고강도 운동 주 6-7일</td>
                  <td className="text-right py-2 px-3 border border-gray-200">1.725</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">매우 활발</td>
                  <td className="py-2 px-3 border border-gray-200">매우 고강도 운동, 육체 노동, 운동선수</td>
                  <td className="text-right py-2 px-3 border border-gray-200">1.9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">다이어트 칼로리 가이드</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span><strong>체중 감량</strong>: TDEE보다 하루 500kcal 적게 먹으면 주당 약 0.45kg 감량할 수 있습니다. 너무 급격한 칼로리 제한(TDEE 대비 1,000kcal 이상)은 근손실과 요요를 유발할 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>체중 유지</strong>: TDEE만큼 먹으면 현재 체중을 유지할 수 있습니다. 식단 조절의 기준점으로 활용하세요.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span><strong>벌크업</strong>: TDEE보다 300~500kcal 더 섭취하고, 근력 운동을 병행하면 효과적인 근육 증가가 가능합니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span><strong>영양소 비율</strong>: 칼로리뿐 아니라 단백질(체중 1kg당 1.6~2.2g), 탄수화물, 지방의 균형 잡힌 섭취가 중요합니다.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">TDEE와 BMR의 차이는 무엇인가요?</h3>
              <p className="text-gray-600 text-sm">BMR(기초대사량)은 아무 활동 없이 생명을 유지하는 데 필요한 최소 칼로리입니다. TDEE는 BMR에 일상 활동과 운동으로 소비되는 칼로리를 더한 값입니다. 실제 식단 계획에는 TDEE를 기준으로 사용해야 합니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">TDEE 계산이 정확한가요?</h3>
              <p className="text-gray-600 text-sm">Mifflin-St Jeor 공식은 약 10% 오차 범위 내에서 BMR을 추정합니다. 개인의 근육량, 유전적 요인, 호르몬 상태에 따라 실제 값은 달라질 수 있으므로, 2~3주간 체중 변화를 관찰하며 조정하는 것이 좋습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">BMR 이하로 먹으면 안 되나요?</h3>
              <p className="text-gray-600 text-sm">BMR 이하로 칼로리를 섭취하면 신체가 에너지 절약 모드에 들어가 대사율이 떨어지고, 근손실, 영양 결핍, 피로감 등의 부작용이 발생할 수 있습니다. 최소한 BMR 이상은 섭취하는 것을 권장합니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">활동량 수준을 어떻게 선택하나요?</h3>
              <p className="text-gray-600 text-sm">대부분의 사람들은 자신의 활동량을 과대평가하는 경향이 있습니다. 주 3회 미만 운동이라면 &quot;비활동적&quot; 또는 &quot;가벼운 활동&quot;을 선택하고, 주 3회 이상 45분 이상 중강도 운동을 한다면 &quot;보통 활동&quot;을 선택하세요.</p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="tdee" />
    </div>
  );
}
