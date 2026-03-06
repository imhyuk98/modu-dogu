"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

const ACTIVITY_LEVELS = [
  { label: "비활동적 (사무직)", multiplier: 1.0 },
  { label: "가벼운 활동 (주 1-3일 운동)", multiplier: 1.1 },
  { label: "보통 활동 (주 3-5일 운동)", multiplier: 1.2 },
  { label: "활발한 활동 (주 6-7일 운동)", multiplier: 1.3 },
  { label: "매우 활발 (운동선수)", multiplier: 1.4 },
];

const WEATHER_OPTIONS = [
  { label: "보통", multiplier: 1.0 },
  { label: "더운 날씨", multiplier: 1.2 },
  { label: "매우 더운 날씨", multiplier: 1.4 },
];

interface WaterResult {
  totalMl: number;
  totalL: number;
  cups: number;
  bottles: number;
  schedule: { time: string; amount: number }[];
}

function calculateWaterIntake(weight: number, activityIdx: number, weatherIdx: number): WaterResult {
  const base = weight * 33;
  const activityMultiplier = ACTIVITY_LEVELS[activityIdx].multiplier;
  const weatherMultiplier = WEATHER_OPTIONS[weatherIdx].multiplier;
  const totalMl = Math.round(base * activityMultiplier * weatherMultiplier);
  const totalL = Math.round(totalMl / 10) / 100;
  const cups = Math.round(totalMl / 200 * 10) / 10;
  const bottles = Math.round(totalMl / 500 * 10) / 10;

  // 시간대별 배분: 기상 후 15%, 오전 20%, 점심 15%, 오후 25%, 저녁 15%, 취침 전 10%
  const schedule = [
    { time: "아침 기상 후", amount: Math.round(totalMl * 0.15) },
    { time: "오전 (9~12시)", amount: Math.round(totalMl * 0.20) },
    { time: "점심 식사 전후", amount: Math.round(totalMl * 0.15) },
    { time: "오후 (14~17시)", amount: Math.round(totalMl * 0.25) },
    { time: "저녁 (18~20시)", amount: Math.round(totalMl * 0.15) },
    { time: "취침 전", amount: Math.round(totalMl * 0.10) },
  ];

  return { totalMl, totalL, cups, bottles, schedule };
}

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [activityIdx, setActivityIdx] = useState(2);
  const [weatherIdx, setWeatherIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo<WaterResult | null>(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    return calculateWaterIntake(w, activityIdx, weatherIdx);
  }, [weight, activityIdx, weatherIdx]);

  const handleReset = () => {
    setWeight("");
    setActivityIdx(2);
    setWeatherIdx(0);
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

  // 물잔 아이콘 시각화: 200ml 컵 기준으로 물방울 이모지 반복
  const dropletCount = result ? Math.min(Math.round(result.cups), 20) : 0;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">물 섭취량 계산기</h1>
      <p className="text-gray-500 mb-8">
        체중과 활동량, 날씨를 입력하면 하루 권장 물 섭취량을 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">몸무게</label>
            <div className="relative">
              <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">활동량</label>
            <select
              value={activityIdx}
              onChange={(e) => setActivityIdx(Number(e.target.value))}
              className="calc-input calc-input-lg"
            >
              {ACTIVITY_LEVELS.map((level, idx) => (
                <option key={idx} value={idx}>{level.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날씨/환경</label>
            <select
              value={weatherIdx}
              onChange={(e) => setWeatherIdx(Number(e.target.value))}
              className="calc-input calc-input-lg"
            >
              {WEATHER_OPTIONS.map((option, idx) => (
                <option key={idx} value={idx}>{option.label}</option>
              ))}
            </select>
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
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">하루 권장 물 섭취량</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.totalMl.toLocaleString()}ml</p>
              <button
                onClick={() => handleCopy(`하루 권장 물 섭취량: ${result.totalMl.toLocaleString()}ml (${result.totalL}L) / 컵 ${result.cups}잔 / 물병 ${result.bottles}병`)}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="복사"
                aria-label="결과 복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-xl font-semibold mt-2 text-blue-100">
              약 {result.totalL}L
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* 컵/물병 요약 */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">200ml 컵 기준</p>
                <p className="text-2xl font-bold text-blue-600">{result.cups}잔</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">500ml 물병 기준</p>
                <p className="text-2xl font-bold text-blue-600">{result.bottles}병</p>
              </div>
            </div>

            {/* 물잔 시각화 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">200ml 컵 기준 시각화</p>
              <div className="flex flex-wrap gap-1 text-2xl">
                {Array.from({ length: dropletCount }).map((_, i) => (
                  <span key={i}>💧</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">💧 1개 = 200ml 컵 1잔</p>
            </div>

            {/* 시간대별 권장 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">시간대별 권장 섭취량</p>
              <div className="space-y-2">
                {result.schedule.map((s) => (
                  <div key={s.time} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32 shrink-0">{s.time}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-400 h-full rounded-full transition-all"
                        style={{ width: `${(s.amount / result.totalMl) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-16 text-right">{s.amount}ml</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">하루 권장 물 섭취량</p>
              <p className="text-lg font-extrabold text-blue-600">{result.totalMl.toLocaleString()}ml</p>
            </div>
            <button onClick={() => handleCopy(`하루 권장 물 섭취량: ${result.totalMl.toLocaleString()}ml (${result.totalL}L)`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">물 섭취의 중요성</h2>
          <p className="text-gray-600 leading-relaxed">
            인체의 약 60~70%는 수분으로 이루어져 있습니다. 물은 체온 조절, 영양소 운반, 노폐물 배출, 관절 윤활 등
            생명 유지에 필수적인 역할을 합니다. 충분한 수분 섭취는 집중력과 에너지 수준을 유지하고,
            피부 건강과 소화 기능을 개선하는 데 도움이 됩니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            하루 권장 물 섭취량은 일반적으로 <strong>체중(kg) x 33ml</strong>로 계산하며,
            활동량, 날씨, 건강 상태에 따라 추가 섭취가 필요합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">권장 섭취량 기준</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="text-right py-2 px-3 border border-gray-200">권장 섭취량</th>
                  <th className="text-right py-2 px-3 border border-gray-200">비고</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">성인 남성</td>
                  <td className="text-right py-2 px-3 border border-gray-200">2,500ml (약 10컵)</td>
                  <td className="text-right py-2 px-3 border border-gray-200">한국영양학회 기준</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">성인 여성</td>
                  <td className="text-right py-2 px-3 border border-gray-200">2,000ml (약 8컵)</td>
                  <td className="text-right py-2 px-3 border border-gray-200">한국영양학회 기준</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">임산부</td>
                  <td className="text-right py-2 px-3 border border-gray-200">2,300ml</td>
                  <td className="text-right py-2 px-3 border border-gray-200">일반 여성 대비 +300ml</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">수유부</td>
                  <td className="text-right py-2 px-3 border border-gray-200">2,600ml</td>
                  <td className="text-right py-2 px-3 border border-gray-200">모유 생성에 추가 수분 필요</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">운동 시</td>
                  <td className="text-right py-2 px-3 border border-gray-200">+500~1,000ml</td>
                  <td className="text-right py-2 px-3 border border-gray-200">운동 강도에 따라 추가</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">물 부족 증상</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><strong>경미한 탈수 (1~2%)</strong> - 갈증, 입 마름, 소변 색이 진해짐, 가벼운 두통, 집중력 저하</li>
            <li><strong>중등도 탈수 (3~5%)</strong> - 심한 갈증, 피로감, 어지러움, 소변량 감소, 피부 탄력 저하</li>
            <li><strong>심한 탈수 (5% 이상)</strong> - 빠른 심박수, 혼란, 의식 저하 등 응급 상황으로 즉시 의료 조치 필요</li>
          </ul>
          <p className="text-gray-500 text-xs mt-3">
            * 소변 색이 연한 노란색이면 적절한 수분 상태, 진한 노란색이면 수분이 부족한 상태입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">올바른 물 마시기 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span><strong>아침 기상 후 공복에 물 한 잔</strong>을 마시면 신진대사를 활성화하고 장 운동을 촉진합니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>한 번에 많이 마시지 말고</strong> 30분~1시간 간격으로 200ml씩 나눠 마시는 것이 흡수에 효과적입니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span><strong>식사 중 과도한 물 섭취는 자제</strong>하세요. 소화액이 희석되어 소화 기능이 저하될 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span><strong>카페인 음료는 이뇨 작용</strong>이 있으므로 커피 1잔당 물 1잔을 추가로 마시는 것을 권장합니다.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 차나 커피도 물 섭취량에 포함되나요?</h3>
              <p className="text-gray-600 text-sm">
                차와 커피도 수분 공급원이지만, 카페인의 이뇨 작용으로 순수 물만큼 효율적이지 않습니다.
                하루 물 섭취량의 70% 이상은 순수한 물로 채우는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 물을 너무 많이 마시면 안 좋은가요?</h3>
              <p className="text-gray-600 text-sm">
                극단적으로 과도한 수분 섭취(하루 5L 이상)는 저나트륨혈증(물 중독)을 유발할 수 있습니다.
                권장량의 1.5배 이내에서 섭취하는 것이 안전합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 겨울에도 같은 양의 물을 마셔야 하나요?</h3>
              <p className="text-gray-600 text-sm">
                겨울에는 땀 배출이 줄어들지만, 난방으로 인한 실내 건조 환경에서 수분 손실이 발생합니다.
                기본 권장량은 유지하되, 여름보다 약간 줄여도 괜찮습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Q. 식사 중 물을 마셔도 되나요?</h3>
              <p className="text-gray-600 text-sm">
                식사 중 소량의 물은 괜찮지만, 많은 양을 마시면 소화액이 희석됩니다.
                식사 30분 전이나 식후 1시간 후에 마시는 것이 소화에 더 좋습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="water-intake" />
    </div>
  );
}
