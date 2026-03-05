"use client";

import { useState } from "react";
import { calculateBMI, type BMIResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

const BMI_RANGES = [
  { label: "저체중", range: "18.5 미만", color: "bg-blue-400" },
  { label: "정상", range: "18.5 ~ 22.9", color: "bg-green-400" },
  { label: "과체중", range: "23 ~ 24.9", color: "bg-yellow-400" },
  { label: "비만", range: "25 ~ 29.9", color: "bg-orange-400" },
  { label: "고도비만", range: "30 이상", color: "bg-red-400" },
];

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    setError("");
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!height || !weight) {
      setError("키와 몸무게를 모두 입력해주세요.");
      return;
    }
    if (!h || !w || h <= 0 || w <= 0) {
      setError("올바른 값을 입력해주세요.");
      return;
    }
    setResult(calculateBMI(h, w));
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setResult(null);
    setError("");
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
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">BMI 계산기</h1>
      <p className="text-gray-500 mb-8">
        키와 몸무게를 입력하면 체질량지수(BMI)와 비만도를 확인할 수 있습니다.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키</label>
            <div className="relative">
              <input type="number" step="0.1" value={height} onChange={(e) => { setHeight(e.target.value); setError(""); }} placeholder="170"
                onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">몸무게</label>
            <div className="relative">
              <input type="number" step="0.1" value={weight} onChange={(e) => { setWeight(e.target.value); setError(""); }} placeholder="70"
                onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex gap-3">
          <button onClick={handleCalculate}
            className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            계산하기
          </button>
          <button onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">당신의 BMI</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.bmi}</p>
              <button
                onClick={() => handleCopy(`BMI: ${result.bmi} (${result.category})`)}
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
            <p className="text-gray-600">{result.description}</p>

            {/* BMI 게이지 바 */}
            <div className="mt-6">
              <div className="flex rounded-full overflow-hidden h-4">
                <div className="bg-blue-400 flex-1" />
                <div className="bg-green-400 flex-1" />
                <div className="bg-yellow-400 flex-1" />
                <div className="bg-orange-400 flex-1" />
                <div className="bg-red-400 flex-1" />
              </div>
              <div className="relative h-6 mt-1">
                <div className="absolute -translate-x-1/2 text-sm font-bold"
                  style={{ left: `${Math.min(Math.max(((result.bmi - 10) / 30) * 100, 2), 98)}%` }}>
                  ▲
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BMI 기준표 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">대한비만학회 BMI 기준 (아시아-태평양)</h3>
        <div className="space-y-2">
          {BMI_RANGES.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${r.color}`} />
              <span className="text-sm font-medium text-gray-700 w-20">{r.label}</span>
              <span className="text-sm text-gray-500">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">BMI(체질량지수)란?</h2>
          <p className="text-gray-600 leading-relaxed">
            BMI(Body Mass Index, 체질량지수)는 체중(kg)을 키(m)의 제곱으로 나눈 값으로,
            비만 정도를 판단하는 가장 보편적인 지표입니다. 계산 공식은 <strong>BMI = 체중(kg) ÷ 키(m)²</strong>입니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            대한비만학회는 아시아-태평양 기준으로 BMI 23 이상을 과체중, 25 이상을 비만으로 분류합니다.
            이는 서양 기준(25 이상 과체중, 30 이상 비만)보다 엄격한데, 아시아인은 같은 BMI에서도 체지방률이 더 높은 경향이 있기 때문입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">키별 정상 체중 범위</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">키</th>
                  <th className="text-right py-2 px-3 border border-gray-200">정상 체중 (BMI 18.5~22.9)</th>
                  <th className="text-right py-2 px-3 border border-gray-200">표준 체중 (BMI 22)</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[155, 160, 165, 170, 175, 180, 185].map((h) => {
                  const hm = h / 100;
                  const low = Math.round(18.5 * hm * hm * 10) / 10;
                  const high = Math.round(22.9 * hm * hm * 10) / 10;
                  const std = Math.round(22 * hm * hm * 10) / 10;
                  return (
                    <tr key={h}>
                      <td className="py-2 px-3 border border-gray-200">{h}cm</td>
                      <td className="text-right py-2 px-3 border border-gray-200">{low}kg ~ {high}kg</td>
                      <td className="text-right py-2 px-3 border border-gray-200 font-medium">{std}kg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">BMI의 한계</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><strong>근육량 미반영</strong> - 운동선수나 근육량이 많은 사람은 BMI가 높게 나오지만 실제로는 건강한 상태일 수 있습니다.</li>
            <li><strong>체지방 분포 미반영</strong> - 같은 BMI라도 복부비만 여부에 따라 건강 위험이 다릅니다. 허리둘레도 함께 확인하세요.</li>
            <li><strong>나이/성별 미반영</strong> - 나이가 들수록 근육량이 줄고 체지방이 늘어나므로 BMI만으로 판단하기 어렵습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">건강한 체중 관리 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span>급격한 다이어트보다 <strong>주 0.5~1kg 감량</strong>이 건강하고 지속 가능합니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>유산소 + 근력 운동</strong>을 병행하면 체지방 감소와 근육량 유지에 효과적입니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span>BMI와 함께 <strong>허리둘레</strong>(남성 90cm, 여성 85cm 이상 시 복부비만)를 관리하세요.</span></li>
          </ul>
        </div>
      </section>
          <RelatedTools current="bmi" />
</div>
  );
}
