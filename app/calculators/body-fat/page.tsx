"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Gender = "male" | "female";

interface BodyFatResult {
  navyBf: number;
  bmiBf: number;
  fatMass: number;
  leanMass: number;
  category: string;
  color: string;
  description: string;
}

const MALE_RANGES = [
  { label: "필수지방", range: "6% 미만", color: "bg-blue-400" },
  { label: "운동선수", range: "6 ~ 13%", color: "bg-green-400" },
  { label: "건강", range: "14 ~ 17%", color: "bg-emerald-400" },
  { label: "보통", range: "18 ~ 24%", color: "bg-yellow-400" },
  { label: "비만", range: "25% 이상", color: "bg-red-400" },
];

const FEMALE_RANGES = [
  { label: "필수지방", range: "14% 미만", color: "bg-blue-400" },
  { label: "운동선수", range: "14 ~ 20%", color: "bg-green-400" },
  { label: "건강", range: "21 ~ 24%", color: "bg-emerald-400" },
  { label: "보통", range: "25 ~ 31%", color: "bg-yellow-400" },
  { label: "비만", range: "32% 이상", color: "bg-red-400" },
];

function classifyBodyFat(bf: number, gender: Gender): { category: string; color: string; description: string } {
  if (gender === "male") {
    if (bf < 6) return { category: "필수지방", color: "text-blue-500", description: "필수지방 수준입니다. 너무 낮은 체지방률은 건강에 위험할 수 있습니다." };
    if (bf < 14) return { category: "운동선수", color: "text-green-500", description: "운동선수 수준의 체지방률입니다. 매우 건강한 상태입니다." };
    if (bf < 18) return { category: "건강", color: "text-emerald-500", description: "건강한 체지방률입니다. 현재 상태를 유지하세요." };
    if (bf < 25) return { category: "보통", color: "text-yellow-500", description: "평균적인 체지방률입니다. 운동과 식이조절을 권장합니다." };
    return { category: "비만", color: "text-red-500", description: "비만 수준의 체지방률입니다. 건강 관리가 필요합니다." };
  } else {
    if (bf < 14) return { category: "필수지방", color: "text-blue-500", description: "필수지방 수준입니다. 너무 낮은 체지방률은 건강에 위험할 수 있습니다." };
    if (bf < 21) return { category: "운동선수", color: "text-green-500", description: "운동선수 수준의 체지방률입니다. 매우 건강한 상태입니다." };
    if (bf < 25) return { category: "건강", color: "text-emerald-500", description: "건강한 체지방률입니다. 현재 상태를 유지하세요." };
    if (bf < 32) return { category: "보통", color: "text-yellow-500", description: "평균적인 체지방률입니다. 운동과 식이조절을 권장합니다." };
    return { category: "비만", color: "text-red-500", description: "비만 수준의 체지방률입니다. 건강 관리가 필요합니다." };
  }
}

function calculateBodyFat(
  gender: Gender,
  age: number,
  height: number,
  weight: number,
  waist: number,
  neck: number,
  hip: number
): BodyFatResult | null {
  if (height <= 0 || weight <= 0 || waist <= 0 || neck <= 0) return null;
  if (gender === "female" && hip <= 0) return null;
  if (waist <= neck) return null;

  let navyBf: number;
  if (gender === "male") {
    navyBf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
  } else {
    navyBf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
  }
  navyBf = Math.round(navyBf * 10) / 10;

  // BMI-based estimate
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const genderVal = gender === "male" ? 1 : 0;
  let bmiBf = (1.20 * bmi) + (0.23 * age) - (10.8 * genderVal) - 5.4;
  bmiBf = Math.round(bmiBf * 10) / 10;

  const fatMass = Math.round((weight * navyBf / 100) * 10) / 10;
  const leanMass = Math.round((weight - fatMass) * 10) / 10;

  const { category, color, description } = classifyBodyFat(navyBf, gender);

  return { navyBf, bmiBf, fatMass, leanMass, category, color, description };
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [waist, setWaist] = useState("80");
  const [neck, setNeck] = useState("37");
  const [hip, setHip] = useState("95");
  const [copied, setCopied] = useState(false);

  const result = useMemo<BodyFatResult | null>(() => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const wa = parseFloat(waist);
    const n = parseFloat(neck);
    const hi = parseFloat(hip);
    if (!a || !h || !w || !wa || !n || a <= 0 || h <= 0 || w <= 0 || wa <= 0 || n <= 0) return null;
    if (gender === "female" && (!hi || hi <= 0)) return null;
    return calculateBodyFat(gender, a, h, w, wa, n, hi);
  }, [gender, age, height, weight, waist, neck, hip]);

  const handleReset = () => {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHip("");
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

  const ranges = gender === "male" ? MALE_RANGES : FEMALE_RANGES;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">체지방률 계산기</h1>
      <p className="text-gray-500 mb-8">
        US Navy 공식으로 체지방률을 계산합니다. 허리둘레와 목둘레를 입력하면 정확한 체지방 비율을 확인할 수 있습니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        {/* 성별 토글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
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
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">허리둘레</label>
            <div className="relative">
              <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="80"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목둘레</label>
            <div className="relative">
              <input type="number" step="0.1" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="37"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
            </div>
          </div>
          {gender === "female" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">엉덩이둘레</label>
              <div className="relative">
                <input type="number" step="0.1" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95"
                  className="calc-input calc-input-lg" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
              </div>
            </div>
          )}
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
            <p className="text-blue-100 text-sm mb-1">US Navy 체지방률</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.navyBf}%</p>
              <button
                onClick={() => handleCopy(`체지방률: ${result.navyBf}% (${result.category})\n체지방 무게: ${result.fatMass}kg\n제지방 무게: ${result.leanMass}kg`)}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="복사"
                aria-label="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className={`text-xl font-semibold mt-2 ${result.color.replace("text-", "text-")}`}>
              {result.category}
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">{result.description}</p>

            {/* 상세 결과 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">체지방률 (Navy)</p>
                <p className="text-lg font-bold text-gray-900">{result.navyBf}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">체지방률 (BMI)</p>
                <p className="text-lg font-bold text-gray-900">{result.bmiBf}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">체지방 무게</p>
                <p className="text-lg font-bold text-gray-900">{result.fatMass}kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">제지방 무게</p>
                <p className="text-lg font-bold text-gray-900">{result.leanMass}kg</p>
              </div>
            </div>

            {/* 체지방률 게이지 바 */}
            <div className="mt-4">
              <div className="flex rounded-full overflow-hidden h-4">
                <div className="bg-blue-400 flex-1" />
                <div className="bg-green-400 flex-1" />
                <div className="bg-emerald-400 flex-1" />
                <div className="bg-yellow-400 flex-1" />
                <div className="bg-red-400 flex-1" />
              </div>
              <div className="relative h-6 mt-1">
                <div className="absolute -translate-x-1/2 text-sm font-bold"
                  style={{
                    left: `${Math.min(Math.max(
                      gender === "male"
                        ? ((result.navyBf / 40) * 100)
                        : ((result.navyBf / 50) * 100)
                    , 2), 98)}%`
                  }}>
                  ▲
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 체지방률 기준표 */}
      <div className="calc-card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{gender === "male" ? "남성" : "여성"} 체지방률 기준</h3>
        <div className="space-y-2">
          {ranges.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${r.color}`} />
              <span className="text-sm font-medium text-gray-700 w-20">{r.label}</span>
              <span className="text-sm text-gray-500">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">체지방률 ({result.category})</p>
              <p className="text-lg font-extrabold text-blue-600">{result.navyBf}%</p>
            </div>
            <button onClick={() => handleCopy(`체지방률: ${result.navyBf}% (${result.category})`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">체지방률이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            체지방률(Body Fat Percentage)은 전체 체중에서 체지방이 차지하는 비율을 의미합니다.
            BMI가 단순히 키와 체중의 비율만 보는 것과 달리, 체지방률은 실제 지방의 비율을 측정하므로
            건강 상태를 더 정확하게 파악할 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            같은 체중이라도 근육량이 많으면 체지방률이 낮고, 지방이 많으면 체지방률이 높습니다.
            따라서 BMI와 함께 체지방률을 확인하면 보다 정확한 건강 평가가 가능합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">US Navy 공식이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            US Navy 체지방률 공식은 미 해군에서 개발한 체지방 측정 방법으로, 허리둘레, 목둘레, 키를 사용하여
            체지방률을 추정합니다. 여성의 경우 엉덩이둘레도 추가로 측정합니다.
          </p>
          <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
            <p><strong>남성 공식:</strong></p>
            <p className="pl-4 font-mono text-xs">86.010 x log10(허리 - 목) - 70.041 x log10(키) + 36.76</p>
            <p><strong>여성 공식:</strong></p>
            <p className="pl-4 font-mono text-xs">163.205 x log10(허리 + 엉덩이 - 목) - 97.684 x log10(키) - 78.387</p>
          </div>
          <p className="text-gray-600 leading-relaxed mt-3">
            이 공식은 캘리퍼(피하지방 집게)나 수중체중법(Hydrostatic Weighing)과 비교하여
            약 1~3% 범위 내의 오차를 보이며, 별도의 장비 없이 줄자만으로 측정할 수 있어 널리 사용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">성별 체지방률 기준표</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">분류</th>
                  <th className="text-right py-2 px-3 border border-gray-200">남성</th>
                  <th className="text-right py-2 px-3 border border-gray-200">여성</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">필수지방</td>
                  <td className="text-right py-2 px-3 border border-gray-200">2~5%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">10~13%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">운동선수</td>
                  <td className="text-right py-2 px-3 border border-gray-200">6~13%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">14~20%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">건강</td>
                  <td className="text-right py-2 px-3 border border-gray-200">14~17%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">21~24%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">보통</td>
                  <td className="text-right py-2 px-3 border border-gray-200">18~24%</td>
                  <td className="text-right py-2 px-3 border border-gray-200">25~31%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium text-red-600">비만</td>
                  <td className="text-right py-2 px-3 border border-gray-200">25% 이상</td>
                  <td className="text-right py-2 px-3 border border-gray-200">32% 이상</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 체지방률과 BMI의 차이는 무엇인가요?</h3>
              <p className="text-sm text-gray-600">
                BMI는 키와 체중만으로 계산하므로 근육과 지방을 구분하지 못합니다. 체지방률은 실제 지방의 비율을
                측정하므로 더 정확한 건강 지표입니다. 근육량이 많은 사람은 BMI가 높아도 체지방률은 낮을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 허리둘레는 어디를 측정하나요?</h3>
              <p className="text-sm text-gray-600">
                배꼽 높이에서 수평으로 측정합니다. 숨을 내쉰 상태에서 줄자가 피부에 가볍게 닿도록 측정하며,
                너무 조이거나 느슨하지 않게 합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 목둘레는 어디를 측정하나요?</h3>
              <p className="text-sm text-gray-600">
                목의 가장 좁은 부분(갑상연골 바로 아래)에서 수평으로 측정합니다.
                고개를 곧바로 세운 상태에서 측정해야 정확합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. BMI 기반 추정치와 Navy 공식 결과가 다른 이유는?</h3>
              <p className="text-sm text-gray-600">
                BMI 기반 추정치는 키와 체중, 나이, 성별만으로 계산하는 간접 추정법이고,
                Navy 공식은 실제 둘레 측정값을 사용하므로 더 정확합니다.
                두 결과가 크게 다르다면 Navy 공식 결과를 더 신뢰하는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 체지방률을 낮추려면 어떻게 해야 하나요?</h3>
              <p className="text-sm text-gray-600">
                유산소 운동(달리기, 수영, 자전거)과 근력 운동을 병행하고, 단백질 위주의 식단을 유지하는 것이 효과적입니다.
                주당 0.5~1kg 정도의 점진적 감량이 근육 손실을 최소화하면서 체지방을 줄이는 건강한 방법입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="body-fat" />
    </div>
  );
}
