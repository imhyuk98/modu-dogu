"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

interface StandardWeightResult {
  broca: number;
  bmiStandard: number;
  devine: number;
  average: number;
}

function calculateStandardWeight(
  heightCm: number,
  gender: "male" | "female"
): StandardWeightResult {
  // Broca법
  const broca =
    gender === "male"
      ? (heightCm - 100) * 0.9
      : (heightCm - 100) * 0.85;

  // BMI 기준법 (BMI 22)
  const heightM = heightCm / 100;
  const bmiStandard = heightM * heightM * 22;

  // Devine법
  const heightInch = heightCm / 2.54;
  const devine =
    gender === "male"
      ? 50 + 2.3 * (heightInch - 60)
      : 45.5 + 2.3 * (heightInch - 60);

  const average = (broca + bmiStandard + devine) / 3;

  return {
    broca: Math.round(broca * 10) / 10,
    bmiStandard: Math.round(bmiStandard * 10) / 10,
    devine: Math.round(devine * 10) / 10,
    average: Math.round(average * 10) / 10,
  };
}

function getWeightStatus(
  currentWeight: number,
  standardWeight: number
): { label: string; color: string; description: string } {
  const diff = ((currentWeight - standardWeight) / standardWeight) * 100;

  if (diff < -20)
    return {
      label: "심한 저체중",
      color: "text-blue-600",
      description: "표준체중보다 20% 이상 부족합니다. 영양 섭취에 신경 쓰세요.",
    };
  if (diff < -10)
    return {
      label: "저체중",
      color: "text-blue-500",
      description: "표준체중보다 10~20% 부족합니다. 균형 잡힌 식단을 권장합니다.",
    };
  if (diff <= 10)
    return {
      label: "정상",
      color: "text-green-600",
      description: "표준체중 범위(±10%) 안에 있습니다. 현재 체중을 유지하세요.",
    };
  if (diff <= 20)
    return {
      label: "과체중",
      color: "text-orange-500",
      description: "표준체중보다 10~20% 초과입니다. 식이조절과 운동을 권장합니다.",
    };
  return {
    label: "비만",
    color: "text-red-600",
    description: "표준체중보다 20% 이상 초과입니다. 건강 관리가 필요합니다.",
  };
}

export default function StandardWeightCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("170");
  const [currentWeight, setCurrentWeight] = useState("70");
  const [copied, setCopied] = useState(false);

  const result = useMemo<StandardWeightResult | null>(() => {
    const h = parseFloat(height);
    if (!h || h <= 0) return null;
    return calculateStandardWeight(h, gender);
  }, [height, gender]);

  const weightStatus = useMemo(() => {
    const w = parseFloat(currentWeight);
    if (!result || !w || w <= 0) return null;
    return getWeightStatus(w, result.bmiStandard);
  }, [currentWeight, result]);

  const weightDiff = useMemo(() => {
    const w = parseFloat(currentWeight);
    if (!result || !w || w <= 0) return null;
    return {
      broca: Math.round((w - result.broca) * 10) / 10,
      bmiStandard: Math.round((w - result.bmiStandard) * 10) / 10,
      devine: Math.round((w - result.devine) * 10) / 10,
    };
  }, [currentWeight, result]);

  const handleReset = () => {
    setGender("male");
    setHeight("");
    setCurrentWeight("");
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

  const copyText = result
    ? `표준체중 (${gender === "male" ? "남성" : "여성"}, ${height}cm)\nBroca법: ${result.broca}kg\nBMI 기준: ${result.bmiStandard}kg\nDevine법: ${result.devine}kg`
    : "";

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        표준체중 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        키와 성별을 입력하면 Broca, BMI, Devine 세 가지 공식으로 표준체중을 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        {/* 성별 토글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                gender === "male"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                gender === "female"
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 체중</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="70"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">BMI 기준 표준체중</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.bmiStandard}kg</p>
              <button
                onClick={() => handleCopy(copyText)}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="복사"
                aria-label="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            {weightStatus && (
              <p className={`text-xl font-semibold mt-2 ${weightStatus.color.replace("text-", "text-")}`}>
                {weightStatus.label}
              </p>
            )}
          </div>

          <div className="p-6 space-y-4">
            {weightStatus && (
              <p className="text-gray-600">{weightStatus.description}</p>
            )}

            {/* 세 가지 공식 결과 비교 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Broca법</p>
                <p className="text-2xl font-bold text-blue-700">{result.broca}kg</p>
                {weightDiff && (
                  <p className={`text-xs mt-1 ${weightDiff.broca > 0 ? "text-red-500" : weightDiff.broca < 0 ? "text-blue-500" : "text-green-500"}`}>
                    {weightDiff.broca > 0 ? "+" : ""}{weightDiff.broca}kg
                  </p>
                )}
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">BMI 기준</p>
                <p className="text-2xl font-bold text-green-700">{result.bmiStandard}kg</p>
                {weightDiff && (
                  <p className={`text-xs mt-1 ${weightDiff.bmiStandard > 0 ? "text-red-500" : weightDiff.bmiStandard < 0 ? "text-blue-500" : "text-green-500"}`}>
                    {weightDiff.bmiStandard > 0 ? "+" : ""}{weightDiff.bmiStandard}kg
                  </p>
                )}
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Devine법</p>
                <p className="text-2xl font-bold text-purple-700">{result.devine}kg</p>
                {weightDiff && (
                  <p className={`text-xs mt-1 ${weightDiff.devine > 0 ? "text-red-500" : weightDiff.devine < 0 ? "text-blue-500" : "text-green-500"}`}>
                    {weightDiff.devine > 0 ? "+" : ""}{weightDiff.devine}kg
                  </p>
                )}
              </div>
            </div>

            {/* 체중 범위 게이지 바 */}
            {weightDiff && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">BMI 기준 체중 범위</p>
                <div className="flex rounded-full overflow-hidden h-4">
                  <div className="bg-blue-400 flex-1" title="심한 저체중" />
                  <div className="bg-blue-300 flex-1" title="저체중" />
                  <div className="bg-green-400 flex-[2]" title="정상" />
                  <div className="bg-orange-400 flex-1" title="과체중" />
                  <div className="bg-red-400 flex-1" title="비만" />
                </div>
                <div className="relative h-6 mt-1">
                  {(() => {
                    const w = parseFloat(currentWeight);
                    const std = result.bmiStandard;
                    const pct = ((w - std) / std) * 100;
                    // Map -30% to 0%, 0% to 50%, +30% to 100%
                    const pos = Math.min(Math.max(((pct + 30) / 60) * 100, 2), 98);
                    return (
                      <div
                        className="absolute -translate-x-1/2 text-sm font-bold"
                        style={{ left: `${pos}%` }}
                      >
                        ▲
                      </div>
                    );
                  })()}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 -mt-1">
                  <span>-30%</span>
                  <span>-10%</span>
                  <span>정상</span>
                  <span>+10%</span>
                  <span>+30%</span>
                </div>
              </div>
            )}

            {/* 정상 체중 범위 표시 */}
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">정상 체중 범위 (BMI 기준 ±10%)</p>
              <p className="text-lg font-bold text-gray-900">
                {(result.bmiStandard * 0.9).toFixed(1)}kg ~ {(result.bmiStandard * 1.1).toFixed(1)}kg
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 공식 설명 표 */}
      <div className="calc-card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">표준체중 계산 공식</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border border-gray-200">공식</th>
                <th className="text-left py-2 px-3 border border-gray-200">남성</th>
                <th className="text-left py-2 px-3 border border-gray-200">여성</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">Broca법</td>
                <td className="py-2 px-3 border border-gray-200">(키 - 100) x 0.9</td>
                <td className="py-2 px-3 border border-gray-200">(키 - 100) x 0.85</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">BMI 기준</td>
                <td className="py-2 px-3 border border-gray-200" colSpan={2}>키(m)² x 22</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">Devine법</td>
                <td className="py-2 px-3 border border-gray-200">50 + 2.3 x (키(inch) - 60)</td>
                <td className="py-2 px-3 border border-gray-200">45.5 + 2.3 x (키(inch) - 60)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 체중 판정 기준표 */}
      <div className="calc-card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">체중 판정 기준 (표준체중 대비)</h3>
        <div className="space-y-2">
          {[
            { label: "심한 저체중", range: "-20% 미만", color: "bg-blue-400" },
            { label: "저체중", range: "-10% ~ -20%", color: "bg-blue-300" },
            { label: "정상", range: "±10% 이내", color: "bg-green-400" },
            { label: "과체중", range: "+10% ~ +20%", color: "bg-orange-400" },
            { label: "비만", range: "+20% 이상", color: "bg-red-400" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${r.color}`} />
              <span className="text-sm font-medium text-gray-700 w-24">{r.label}</span>
              <span className="text-sm text-gray-500">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">BMI 기준 표준체중{weightStatus ? ` (${weightStatus.label})` : ""}</p>
              <p className="text-lg font-extrabold text-blue-600">{result.bmiStandard}kg</p>
            </div>
            <button
              onClick={() => handleCopy(copyText)}
              className="calc-btn-primary text-xs px-3 py-2"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">표준체중이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            표준체중(ideal body weight)이란 키와 성별을 기준으로 건강을 유지하기에 가장 적합한 체중을 말합니다.
            비만이나 저체중 여부를 판단하는 기준이 되며, 약물 투여량 계산이나 영양 상담 등 의료 분야에서도 널리 사용됩니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            표준체중은 하나의 절대적 수치가 아닌 참고 기준이며, 개인의 근육량, 체지방률, 연령 등에 따라
            건강한 체중은 달라질 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">각 공식 설명</h2>
          <ul className="text-gray-600 space-y-4 text-sm">
            <li>
              <strong className="text-gray-900">Broca법 (변형 브로카 공식)</strong>
              <p className="mt-1">
                프랑스 외과의사 Paul Broca가 개발한 공식의 변형으로, 한국에서 가장 널리 사용됩니다.
                남성은 (키 - 100) x 0.9, 여성은 (키 - 100) x 0.85로 계산합니다.
                간단하지만 키가 매우 크거나 작은 사람에게는 정확도가 떨어질 수 있습니다.
              </p>
            </li>
            <li>
              <strong className="text-gray-900">BMI 기준법</strong>
              <p className="mt-1">
                세계보건기구(WHO)가 권장하는 이상적인 BMI 22를 기준으로 역산한 체중입니다.
                키(m)² x 22로 계산하며, 성별에 관계없이 동일한 공식을 사용합니다.
                국제적으로 가장 보편적인 기준입니다.
              </p>
            </li>
            <li>
              <strong className="text-gray-900">Devine법</strong>
              <p className="mt-1">
                1974년 미국의 약학자 Ben Devine이 약물 투여량 계산을 위해 개발한 공식입니다.
                원래 인치 단위 기준이며, 남성은 50 + 2.3 x (키(inch) - 60),
                여성은 45.5 + 2.3 x (키(inch) - 60)으로 계산합니다.
                의료 현장에서 많이 사용되지만, 아시아인에게는 다소 높게 나올 수 있습니다.
              </p>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">건강한 체중 관리 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>표준체중은 <strong>참고 기준</strong>일 뿐, 개인의 근육량과 체지방률에 따라 건강한 체중은 다릅니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>체중보다 <strong>체지방률과 허리둘레</strong>(남성 90cm, 여성 85cm 미만)를 함께 관리하는 것이 중요합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>급격한 체중 변화보다 <strong>주 0.5~1kg</strong> 수준의 점진적 변화가 건강에 좋습니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              <span><strong>균형 잡힌 식단</strong>과 규칙적인 <strong>유산소 + 근력 운동</strong>을 병행하세요.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">5.</span>
              <span>체중 관리에 어려움이 있다면 <strong>전문 의료인과 상담</strong>하는 것을 권장합니다.</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Q. 세 가지 공식 중 어떤 것을 기준으로 해야 하나요?</h3>
              <p className="text-sm text-gray-600 mt-1">
                한국에서는 BMI 기준법(키(m)² x 22)이 가장 보편적으로 사용됩니다.
                다만, 세 공식의 결과를 종합적으로 참고하면 자신의 적정 체중 범위를 더 정확하게 파악할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Q. 표준체중과 실제 건강한 체중이 다를 수 있나요?</h3>
              <p className="text-sm text-gray-600 mt-1">
                네, 표준체중은 통계적 평균을 기반으로 한 참고치입니다. 근육량이 많은 운동선수는
                표준체중을 초과하더라도 건강할 수 있고, 반대로 표준체중 범위 내라도 체지방률이 높으면
                건강 위험이 있을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Q. 표준체중의 ±10%가 정상 범위인 이유는?</h3>
              <p className="text-sm text-gray-600 mt-1">
                대한비만학회에서는 표준체중의 ±10% 이내를 정상 체중으로 분류합니다.
                이는 개인차를 고려한 범위로, 10~20% 초과 시 과체중, 20% 이상 초과 시 비만으로 판정합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Q. 어린이나 청소년에게도 이 계산기를 사용할 수 있나요?</h3>
              <p className="text-sm text-gray-600 mt-1">
                이 계산기는 성인(만 18세 이상)을 기준으로 설계되었습니다. 성장기 어린이와 청소년은
                성별, 나이별 성장 곡선을 참고해야 하므로 소아과 전문의와 상담하는 것이 좋습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="standard-weight" />
    </div>
  );
}
