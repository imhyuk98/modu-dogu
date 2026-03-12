"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ── Types ── */
type PetType = "dog" | "cat";
type DogSize = "small" | "medium" | "large";

interface LifeStage {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

/* ── Calculation Logic ── */
function calcDogHumanAge(years: number, months: number, size: DogSize): number {
  const totalYears = years + months / 12;
  if (totalYears <= 0) return 0;

  // AKC-based formula adjusted by size
  // Large dogs age faster after year 2
  const sizeMultiplier = { small: 4, medium: 5, large: 6 };
  const afterTwo = sizeMultiplier[size];

  if (totalYears <= 1) return totalYears * 15;
  if (totalYears <= 2) return 15 + (totalYears - 1) * 9;
  return 15 + 9 + (totalYears - 2) * afterTwo;
}

function calcCatHumanAge(years: number, months: number): number {
  const totalYears = years + months / 12;
  if (totalYears <= 0) return 0;

  if (totalYears <= 1) return totalYears * 15;
  if (totalYears <= 2) return 15 + (totalYears - 1) * 10;
  return 15 + 10 + (totalYears - 2) * 4;
}

function getLifeStage(humanAge: number, petType: PetType): LifeStage {
  if (humanAge <= 0) return { label: "나이를 입력하세요", emoji: "❓", color: "text-gray-500", bgColor: "bg-gray-100" };
  if (humanAge < 16) return { label: "아기", emoji: "🍼", color: "text-pink-600", bgColor: "bg-pink-50" };
  if (humanAge < 25) return { label: "청소년", emoji: "🌱", color: "text-green-600", bgColor: "bg-green-50" };
  if (humanAge < 40) return { label: "성인", emoji: "💪", color: "text-blue-600", bgColor: "bg-blue-50" };
  if (humanAge < 60) return { label: "중년", emoji: "🧑", color: "text-amber-600", bgColor: "bg-amber-50" };
  return { label: "노년", emoji: petType === "dog" ? "🐕" : "🐈", color: "text-purple-600", bgColor: "bg-purple-50" };
}

function getHealthChecklist(humanAge: number, petType: PetType): string[] {
  const common: string[] = [];

  if (humanAge < 16) {
    common.push("기본 예방접종 완료하기 (DHPPL, 광견병 등)");
    common.push("중성화 수술 시기 상담");
    common.push("사회화 훈련 시작");
    common.push("구충제 정기 투여");
  } else if (humanAge < 25) {
    common.push("1년 1회 종합 건강검진");
    common.push("추가 접종 (매년 1회)");
    common.push("치석 관리 시작");
    common.push("적정 체중 유지 확인");
  } else if (humanAge < 40) {
    common.push("1년 1회 종합 건강검진");
    common.push("치과 스케일링 권장");
    common.push("체중 관리 (비만 주의)");
    common.push("심장사상충 예방약 복용");
  } else if (humanAge < 60) {
    common.push("6개월 1회 건강검진 권장");
    common.push("혈액검사, 소변검사 정기 실시");
    common.push("관절 건강 체크 (글루코사민 보충)");
    common.push("치과 검진 강화");
    if (petType === "dog") common.push("심장 초음파 검사 권장");
    if (petType === "cat") common.push("신장 기능 검사 권장");
  } else {
    common.push("3~6개월 1회 건강검진 필수");
    common.push("혈액검사, X-ray 정기 검사");
    common.push("관절 보조제 급여");
    common.push("시력, 청력 체크");
    if (petType === "dog") common.push("심장, 간, 신장 기능 모니터링");
    if (petType === "cat") common.push("신장, 갑상선 기능 모니터링");
    common.push("소화 기능 저하 대비 사료 변경 고려");
  }
  return common;
}

/* ── Age Table Generation ── */
function generateAgeTable(petType: PetType, size: DogSize) {
  const rows: { petAge: number; humanAge: number }[] = [];
  for (let i = 1; i <= 20; i++) {
    const humanAge =
      petType === "dog"
        ? calcDogHumanAge(i, 0, size)
        : calcCatHumanAge(i, 0);
    rows.push({ petAge: i, humanAge: Math.round(humanAge) });
  }
  return rows;
}

/* ── Component ── */
export default function PetAgeCalculator() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [years, setYears] = useState("3");
  const [months, setMonths] = useState("0");
  const [dogSize, setDogSize] = useState<DogSize>("medium");

  const humanAge = useMemo(() => {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    if (y === 0 && m === 0) return 0;
    return petType === "dog"
      ? calcDogHumanAge(y, m, dogSize)
      : calcCatHumanAge(y, m);
  }, [petType, years, months, dogSize]);

  const lifeStage = useMemo(() => getLifeStage(humanAge, petType), [humanAge, petType]);
  const checklist = useMemo(() => getHealthChecklist(humanAge, petType), [humanAge, petType]);
  const ageTable = useMemo(() => generateAgeTable(petType, dogSize), [petType, dogSize]);

  const petMaxAge = petType === "dog" ? (dogSize === "large" ? 10 : dogSize === "medium" ? 13 : 16) : 18;
  const petYears = parseInt(years) || 0;
  const petMonths = parseInt(months) || 0;
  const petTotalYears = petYears + petMonths / 12;
  const petPercent = Math.min((petTotalYears / petMaxAge) * 100, 100);
  const humanPercent = Math.min((humanAge / 100) * 100, 100);

  const handleReset = () => {
    setYears("");
    setMonths("");
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {petType === "dog" ? "🐶" : "🐱"} 반려동물 나이 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        강아지, 고양이 나이를 사람 나이로 정확하게 환산해 보세요.
      </p>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPetType("dog")}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            petType === "dog"
              ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🐶 강아지
        </button>
        <button
          onClick={() => setPetType("cat")}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            petType === "cat"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🐱 고양이
        </button>
      </div>

      {/* Input Card */}
      <div className="calc-card p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이 (년)</label>
            <input
              type="number"
              min="0"
              max="30"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="0"
              className="calc-input calc-input-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이 (개월)</label>
            <input
              type="number"
              min="0"
              max="11"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="0"
              className="calc-input calc-input-lg"
            />
          </div>
        </div>

        {/* Dog Size (dog only) */}
        {petType === "dog" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">체구 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "small" as DogSize, label: "소형견", sub: "~10kg", emoji: "🐕" },
                { value: "medium" as DogSize, label: "중형견", sub: "10~25kg", emoji: "🦮" },
                { value: "large" as DogSize, label: "대형견", sub: "25kg+", emoji: "🐕‍🦺" },
              ]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setDogSize(s.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                    dogSize === s.value
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-bold text-gray-800">{s.label}</div>
                  <div className="text-[10px] text-gray-400">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleReset}
          className="calc-btn-secondary w-full"
        >
          초기화
        </button>
      </div>

      {/* Result */}
      {humanAge > 0 && (
        <div className="space-y-6 mb-8">
          {/* Main Result */}
          <div className={`calc-card p-6 text-center ${
            petType === "dog" ? "border-amber-200" : "border-purple-200"
          }`}>
            <p className="text-sm text-gray-500 mb-2">사람 나이로 환산하면</p>
            <div className={`text-5xl sm:text-6xl font-black mb-2 ${
              petType === "dog" ? "text-amber-600" : "text-purple-600"
            }`}>
              {Math.round(humanAge)}
              <span className="text-2xl font-bold text-gray-400 ml-1">세</span>
            </div>

            {/* Life Stage Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${lifeStage.bgColor} ${lifeStage.color} font-bold text-sm mt-2`}>
              <span className="text-lg">{lifeStage.emoji}</span>
              {lifeStage.label}
            </div>
          </div>

          {/* Visual Age Comparison Bar */}
          <div className="calc-card p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">나이 비교</h2>

            {/* Pet Age Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{petType === "dog" ? "🐶 강아지" : "🐱 고양이"} 나이</span>
                <span>{petYears}년 {petMonths > 0 ? `${petMonths}개월` : ""}</span>
              </div>
              <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 ${
                    petType === "dog"
                      ? "bg-gradient-to-r from-amber-300 to-amber-500"
                      : "bg-gradient-to-r from-purple-300 to-purple-500"
                  }`}
                  style={{ width: `${Math.max(petPercent, 5)}%` }}
                >
                  {petPercent > 15 && (
                    <span className="text-[10px] font-bold text-white">
                      {petYears}살
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>0</span>
                <span>평균 수명 ~{petMaxAge}년</span>
              </div>
            </div>

            {/* Human Age Bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>👤 사람 나이</span>
                <span>{Math.round(humanAge)}세</span>
              </div>
              <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(humanPercent, 5)}%` }}
                >
                  {humanPercent > 15 && (
                    <span className="text-[10px] font-bold text-white">
                      {Math.round(humanAge)}세
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>0</span>
                <span>100세</span>
              </div>
            </div>
          </div>

          {/* Health Checklist */}
          <div className="calc-card p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              🩺 건강 체크리스트 ({lifeStage.label} 단계)
            </h2>
            <ul className="space-y-2">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Age Conversion Table */}
          <div className="calc-card p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              📊 나이 변환 테이블 {petType === "dog" ? `(${dogSize === "small" ? "소형견" : dogSize === "medium" ? "중형견" : "대형견"})` : "(고양이)"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left text-gray-500 font-medium">
                      {petType === "dog" ? "🐶 강아지" : "🐱 고양이"}
                    </th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium">👤 사람</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium">단계</th>
                  </tr>
                </thead>
                <tbody>
                  {ageTable.map((row) => {
                    const stage = getLifeStage(row.humanAge, petType);
                    const isCurrentAge = petYears === row.petAge && petMonths === 0;
                    return (
                      <tr
                        key={row.petAge}
                        className={`border-b border-gray-100 ${
                          isCurrentAge
                            ? petType === "dog"
                              ? "bg-amber-50 font-bold"
                              : "bg-purple-50 font-bold"
                            : ""
                        }`}
                      >
                        <td className="py-2 px-3">{row.petAge}살</td>
                        <td className="py-2 px-3">{row.humanAge}세</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center gap-1 text-xs ${stage.color}`}>
                            {stage.emoji} {stage.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-10 pt-8 border-t border-gray-200 space-y-6 text-sm text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">반려동물 나이 계산법</h2>
          <p className="mb-3">
            예전에는 &quot;강아지 1살 = 사람 7살&quot;이라는 단순 공식이 널리 알려져 있었지만,
            이는 정확하지 않습니다. 실제로 강아지와 고양이는 생후 첫 1~2년 동안 매우 빠르게
            성장하며, 이후에는 노화 속도가 느려집니다.
          </p>
          <p>
            현재 미국 켄넬 클럽(AKC)에서 권장하는 공식에 따르면, 강아지의 첫 1년은 사람의
            약 15세에 해당하고, 두 번째 해는 약 9세가 추가됩니다. 3년째부터는 체구에 따라
            소형견은 매년 4세, 중형견은 5세, 대형견은 6세씩 더해집니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">강아지 체구별 수명 차이</h2>
          <p className="mb-3">
            소형견(치와와, 말티즈, 포메라니안 등)은 평균 수명이 14~16년으로 가장 긴 편입니다.
            중형견(비글, 코카스파니엘 등)은 10~13년, 대형견(골든리트리버, 저먼셰퍼드 등)은
            8~10년 정도입니다.
          </p>
          <p>
            대형견은 소형견보다 체세포 분열 속도가 빨라 노화가 더 빠르게 진행됩니다.
            이 때문에 같은 나이라도 대형견의 사람 환산 나이가 소형견보다 높게 나옵니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">고양이 나이 환산</h2>
          <p>
            고양이는 생후 첫 1년이 사람의 약 15세, 두 번째 해에 10세가 추가되어
            2살이면 이미 사람 나이 25세에 해당합니다. 이후에는 매년 약 4세씩 더해집니다.
            실내 고양이의 평균 수명은 15~18년이며, 야외 고양이는 환경에 따라 더 짧을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Q. 강아지 1살은 사람 나이로 몇 살인가요?</h3>
              <p>
                강아지 1살은 사람 나이로 약 15세에 해당합니다. 체구와 관계없이
                첫 1년 동안 매우 빠르게 성장합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Q. 고양이 10살이면 사람 나이로 몇 살인가요?</h3>
              <p>
                고양이 10살은 사람 나이로 약 57세에 해당합니다.
                중년에 해당하며, 정기 건강검진이 중요한 시기입니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Q. 대형견이 소형견보다 수명이 짧은 이유는?</h3>
              <p>
                대형견은 성장 속도가 빠르고 체세포 분열이 활발해 노화가 빨리 진행됩니다.
                또한 대형견은 관절, 심장 등에 부담이 크기 때문에 건강 관리가 더 중요합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Q. 반려동물의 건강검진은 얼마나 자주 받아야 하나요?</h3>
              <p>
                젊은 반려동물은 1년에 1회, 7세 이상 중년기에는 6개월에 1회,
                10세 이상 노년기에는 3~6개월에 1회 건강검진을 받는 것이 권장됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="pet-age" />
    </div>
  );
}
