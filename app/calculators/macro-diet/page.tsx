"use client";

import { useState, useMemo, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ── Food Database ── */
interface Food {
  name: string;
  cal: number;
  carb: number;
  protein: number;
  fat: number;
}

const FOODS: Record<string, Food[]> = {
  breakfast: [
    { name: "현미밥 (1공기)", cal: 300, carb: 65, protein: 6, fat: 1 },
    { name: "계란 프라이 (2개)", cal: 180, carb: 1, protein: 12, fat: 14 },
    { name: "된장국", cal: 50, carb: 5, protein: 4, fat: 1 },
    { name: "김치", cal: 15, carb: 3, protein: 1, fat: 0 },
    { name: "그릭요거트 (200g)", cal: 130, carb: 8, protein: 20, fat: 2 },
    { name: "바나나 (1개)", cal: 100, carb: 25, protein: 1, fat: 0 },
    { name: "토스트 (2장)", cal: 200, carb: 36, protein: 6, fat: 3 },
    { name: "오트밀 (1컵)", cal: 150, carb: 27, protein: 5, fat: 3 },
    { name: "삶은 계란 (2개)", cal: 140, carb: 1, protein: 12, fat: 10 },
    { name: "우유 (200ml)", cal: 120, carb: 10, protein: 6, fat: 6 },
  ],
  lunch: [
    { name: "현미밥 (1공기)", cal: 300, carb: 65, protein: 6, fat: 1 },
    { name: "닭가슴살 구이 (150g)", cal: 230, carb: 0, protein: 43, fat: 5 },
    { name: "제육볶음 (1인분)", cal: 350, carb: 10, protein: 25, fat: 23 },
    { name: "미역국", cal: 45, carb: 4, protein: 3, fat: 2 },
    { name: "샐러드 (드레싱 포함)", cal: 120, carb: 10, protein: 3, fat: 8 },
    { name: "고등어 구이 (1토막)", cal: 200, carb: 0, protein: 20, fat: 13 },
    { name: "두부 조림 (1/2모)", cal: 120, carb: 5, protein: 12, fat: 6 },
    { name: "비빔밥 (1인분)", cal: 500, carb: 70, protein: 15, fat: 15 },
    { name: "김치찌개 (1인분)", cal: 200, carb: 10, protein: 15, fat: 10 },
    { name: "잡곡밥 (1공기)", cal: 310, carb: 67, protein: 7, fat: 1 },
  ],
  dinner: [
    { name: "현미밥 (0.7공기)", cal: 210, carb: 45, protein: 4, fat: 1 },
    { name: "연어 스테이크 (150g)", cal: 280, carb: 0, protein: 30, fat: 17 },
    { name: "소고기 불고기 (150g)", cal: 300, carb: 8, protein: 28, fat: 18 },
    { name: "콩나물국", cal: 35, carb: 4, protein: 3, fat: 1 },
    { name: "브로콜리 (1컵)", cal: 30, carb: 6, protein: 3, fat: 0 },
    { name: "닭볶음탕 (1인분)", cal: 350, carb: 15, protein: 30, fat: 18 },
    { name: "계란찜 (1인분)", cal: 100, carb: 2, protein: 8, fat: 7 },
    { name: "고구마 (1개)", cal: 130, carb: 30, protein: 2, fat: 0 },
    { name: "된장찌개 (1인분)", cal: 150, carb: 10, protein: 10, fat: 7 },
    { name: "나물 반찬 (2종)", cal: 60, carb: 8, protein: 3, fat: 2 },
  ],
  snack: [
    { name: "프로틴 쉐이크", cal: 150, carb: 5, protein: 30, fat: 2 },
    { name: "아몬드 (20알)", cal: 140, carb: 5, protein: 5, fat: 12 },
    { name: "바나나 (1개)", cal: 100, carb: 25, protein: 1, fat: 0 },
    { name: "그릭요거트 (150g)", cal: 100, carb: 6, protein: 15, fat: 2 },
    { name: "삶은 계란 (1개)", cal: 70, carb: 0, protein: 6, fat: 5 },
    { name: "고구마 (1/2개)", cal: 65, carb: 15, protein: 1, fat: 0 },
    { name: "견과류 믹스 (30g)", cal: 170, carb: 7, protein: 5, fat: 15 },
    { name: "사과 (1개)", cal: 80, carb: 20, protein: 0, fat: 0 },
  ],
};

/* ── Constants ── */
const ACTIVITY_LEVELS = [
  { label: "비활동적 (사무직, 거의 운동 안 함)", value: 1.2 },
  { label: "가벼운 활동 (주 1-3일 운동)", value: 1.375 },
  { label: "보통 활동 (주 3-5일 운동)", value: 1.55 },
  { label: "활발한 활동 (주 6-7일 운동)", value: 1.725 },
  { label: "매우 활발 (운동선수급)", value: 1.9 },
];

const GOALS = [
  { label: "체중 감량 (느린)", value: -250, color: "blue" },
  { label: "체중 감량 (빠른)", value: -500, color: "blue" },
  { label: "체중 유지", value: 0, color: "green" },
  { label: "근육 증가 (린벌크)", value: 250, color: "orange" },
  { label: "체중 증가 (벌크업)", value: 500, color: "orange" },
];

const DIET_TYPES = [
  { label: "균형 식단", carb: 0.4, protein: 0.3, fat: 0.3 },
  { label: "고단백 식단", carb: 0.3, protein: 0.4, fat: 0.3 },
  { label: "저탄고지 (키토)", carb: 0.1, protein: 0.3, fat: 0.6 },
  { label: "저지방 식단", carb: 0.5, protein: 0.3, fat: 0.2 },
];

/* ── Seeded random for deterministic meal plans ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSeed(gender: string, age: string, height: string, weight: string, activity: number, goal: number, diet: number, extra: number) {
  const str = `${gender}${age}${height}${weight}${activity}${goal}${diet}${extra}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) + 1;
}

/* ── Greedy meal picker ── */
function pickMeal(foods: Food[], targetCal: number, rng: () => number, minItems: number, maxItems: number): Food[] {
  const shuffled = [...foods];
  // A seeded Fisher-Yates shuffle stays identical in Node and the browser.
  // A random Array.sort comparator is non-transitive and can hydrate differently.
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  const picked: Food[] = [];
  let total = 0;

  for (const food of shuffled) {
    if (picked.length >= maxItems) break;
    if (total + food.cal <= targetCal * 1.15) {
      picked.push(food);
      total += food.cal;
      if (picked.length >= minItems && total >= targetCal * 0.8) break;
    }
  }

  // If we didn't pick enough, add more
  if (picked.length < minItems) {
    for (const food of shuffled) {
      if (picked.includes(food)) continue;
      if (picked.length >= minItems) break;
      picked.push(food);
    }
  }

  return picked;
}

function sumFoods(foods: Food[]) {
  return foods.reduce(
    (acc, f) => ({
      cal: acc.cal + f.cal,
      carb: acc.carb + f.carb,
      protein: acc.protein + f.protein,
      fat: acc.fat + f.fat,
    }),
    { cal: 0, carb: 0, protein: 0, fat: 0 }
  );
}

/* ── FAQ Component ── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "탄단지 영양소란 무엇인가요?",
      a: "탄단지(탄수화물·단백질·지방)는 우리 몸에 에너지를 공급하는 세 가지 주요 영양소입니다. 탄수화물(1g당 4kcal), 단백질(1g당 4kcal), 지방(1g당 9kcal)으로 구성되며, 각각의 비율을 조절하여 체중 관리와 건강 목표를 달성할 수 있습니다.",
    },
    {
      q: "TDEE와 BMR의 차이는 무엇인가요?",
      a: "BMR(기초대사량)은 아무 활동 없이 생명 유지에 필요한 최소 칼로리이고, TDEE(총 일일 에너지 소비량)는 BMR에 일상 활동과 운동을 포함한 실제 하루 소비 칼로리입니다. 식단 계획은 TDEE를 기준으로 합니다.",
    },
    {
      q: "다이어트 시 적절한 감량 속도는?",
      a: "건강한 감량 속도는 주 0.5~1kg입니다. 하루 500kcal 적자를 유지하면 주당 약 0.5kg 감량이 가능합니다. 너무 급격한 칼로리 제한은 근손실, 영양 불균형, 요요 현상의 원인이 됩니다.",
    },
    {
      q: "고단백 식단은 누구에게 적합한가요?",
      a: "근력 운동을 병행하는 사람, 체중 감량 중 근육량을 유지하고 싶은 사람, 포만감을 오래 유지하고 싶은 사람에게 적합합니다. 체중 1kg당 1.6~2.2g의 단백질 섭취가 권장됩니다.",
    },
    {
      q: "저탄고지(키토) 식단의 주의점은?",
      a: "키토 식단은 탄수화물을 극도로 제한하여 체지방을 에너지원으로 사용하게 합니다. 초기 적응기에 피로감, 두통 등이 나타날 수 있으며, 장기 지속 시 영양 불균형 위험이 있으므로 전문가 상담을 권장합니다.",
    },
  ];

  return (
    <div className="calc-faq">
      {items.map((item, i) => (
        <div key={i} className="calc-faq-item">
          <button className="calc-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && <div className="calc-faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Format number ── */
function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

/* ── Main Component ── */
export default function MacroDietCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [activityIdx, setActivityIdx] = useState(1);
  const [goalIdx, setGoalIdx] = useState(2);
  const [dietIdx, setDietIdx] = useState(0);
  const [mealSeed, setMealSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return null;

    // BMR: Mifflin-St Jeor
    const bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * ACTIVITY_LEVELS[activityIdx].value;
    const goalAdj = GOALS[goalIdx].value;
    const targetCal = tdee + goalAdj;

    const diet = DIET_TYPES[dietIdx];
    const carbGrams = (targetCal * diet.carb) / 4;
    const proteinGrams = (targetCal * diet.protein) / 4;
    const fatGrams = (targetCal * diet.fat) / 9;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCal: Math.round(targetCal),
      carbGrams: Math.round(carbGrams),
      proteinGrams: Math.round(proteinGrams),
      fatGrams: Math.round(fatGrams),
      carbPercent: Math.round(diet.carb * 100),
      proteinPercent: Math.round(diet.protein * 100),
      fatPercent: Math.round(diet.fat * 100),
      goalColor: GOALS[goalIdx].color,
    };
  }, [gender, age, height, weight, activityIdx, goalIdx, dietIdx]);

  const meals = useMemo(() => {
    if (!result) return null;
    const seed = generateSeed(gender, age, height, weight, activityIdx, goalIdx, dietIdx, mealSeed);
    const rng = seededRandom(seed);

    const breakfastCal = result.targetCal * 0.3;
    const lunchCal = result.targetCal * 0.35;
    const dinnerCal = result.targetCal * 0.25;
    const snackCal = result.targetCal * 0.1;

    const breakfast = pickMeal(FOODS.breakfast, breakfastCal, rng, 2, 4);
    const lunch = pickMeal(FOODS.lunch, lunchCal, rng, 2, 4);
    const dinner = pickMeal(FOODS.dinner, dinnerCal, rng, 2, 4);
    const snack = pickMeal(FOODS.snack, snackCal, rng, 1, 2);

    return { breakfast, lunch, dinner, snack };
  }, [result, gender, age, height, weight, activityIdx, goalIdx, dietIdx, mealSeed]);

  const mealSummary = useMemo(() => {
    if (!meals) return null;
    return {
      breakfast: sumFoods(meals.breakfast),
      lunch: sumFoods(meals.lunch),
      dinner: sumFoods(meals.dinner),
      snack: sumFoods(meals.snack),
    };
  }, [meals]);

  const totalSummary = useMemo(() => {
    if (!mealSummary) return null;
    return {
      cal: mealSummary.breakfast.cal + mealSummary.lunch.cal + mealSummary.dinner.cal + mealSummary.snack.cal,
      carb: mealSummary.breakfast.carb + mealSummary.lunch.carb + mealSummary.dinner.carb + mealSummary.snack.carb,
      protein: mealSummary.breakfast.protein + mealSummary.lunch.protein + mealSummary.dinner.protein + mealSummary.snack.protein,
      fat: mealSummary.breakfast.fat + mealSummary.lunch.fat + mealSummary.dinner.fat + mealSummary.snack.fat,
    };
  }, [mealSummary]);

  const handleReset = () => {
    setGender("male");
    setAge("25");
    setHeight("170");
    setWeight("70");
    setActivityIdx(1);
    setGoalIdx(2);
    setDietIdx(0);
    setMealSeed(0);
    setCopied(false);
  };

  const buildMealText = useCallback(() => {
    if (!meals || !mealSummary || !result || !totalSummary) return "";
    const lines: string[] = [];
    lines.push(`[AI 식단 추천 결과]`);
    lines.push(`목표 칼로리: ${fmt(result.targetCal)} kcal`);
    lines.push(`BMR: ${fmt(result.bmr)} kcal / TDEE: ${fmt(result.tdee)} kcal`);
    lines.push(`탄수화물: ${fmt(result.carbGrams)}g (${result.carbPercent}%)`);
    lines.push(`단백질: ${fmt(result.proteinGrams)}g (${result.proteinPercent}%)`);
    lines.push(`지방: ${fmt(result.fatGrams)}g (${result.fatPercent}%)`);
    lines.push("");

    const mealEntries: [string, Food[], { cal: number; carb: number; protein: number; fat: number }][] = [
      ["아침", meals.breakfast, mealSummary.breakfast],
      ["점심", meals.lunch, mealSummary.lunch],
      ["저녁", meals.dinner, mealSummary.dinner],
      ["간식", meals.snack, mealSummary.snack],
    ];

    for (const [label, foods, summary] of mealEntries) {
      lines.push(`[${label}] ${summary.cal}kcal`);
      for (const f of foods) {
        lines.push(`  - ${f.name} (${f.cal}kcal / 탄${f.carb}g 단${f.protein}g 지${f.fat}g)`);
      }
      lines.push("");
    }

    lines.push(`[합계] ${totalSummary.cal}kcal / 탄${totalSummary.carb}g 단${totalSummary.protein}g 지${totalSummary.fat}g`);
    return lines.join("\n");
  }, [meals, mealSummary, result, totalSummary]);

  const handleCopy = async () => {
    const text = buildMealText();
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

  const goalHeaderBg =
    result?.goalColor === "blue"
      ? "bg-blue-600"
      : result?.goalColor === "green"
      ? "bg-emerald-600"
      : "bg-orange-500";

  const goalHeaderSubText =
    result?.goalColor === "blue"
      ? "text-blue-100"
      : result?.goalColor === "green"
      ? "text-emerald-100"
      : "text-orange-100";

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">AI 식단 추천 계산기</h1>
      <p className="text-gray-500 mb-8">
        AI가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다.
      </p>

      {/* ── Inputs ── */}
      <div className="calc-card p-6 mb-6 space-y-4">
        {/* Gender Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                gender === "male"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                gender === "female"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
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
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">활동량</label>
          <select
            aria-label="활동량"
            value={activityIdx}
            onChange={(e) => setActivityIdx(Number(e.target.value))}
            className="calc-input"
          >
            {ACTIVITY_LEVELS.map((a, i) => (
              <option key={i} value={i}>{a.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">목표</label>
          <select
            aria-label="체중 목표"
            value={goalIdx}
            onChange={(e) => setGoalIdx(Number(e.target.value))}
            className="calc-input"
          >
            {GOALS.map((g, i) => (
              <option key={i} value={i}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">식단 유형</label>
          <select
            aria-label="식단 유형"
            value={dietIdx}
            onChange={(e) => setDietIdx(Number(e.target.value))}
            className="calc-input"
          >
            {DIET_TYPES.map((d, i) => (
              <option key={i} value={i}>
                {d.label} (탄 {d.carb * 100}% / 단 {d.protein * 100}% / 지 {d.fat * 100}%)
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">초기화</button>
        </div>
      </div>

      {/* ── Section 1: Calorie Summary ── */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className={`${goalHeaderBg} text-white p-6 text-center`}>
            <p className={`${goalHeaderSubText} text-sm mb-1`}>목표 칼로리</p>
            <p className="text-4xl font-bold">{fmt(result.targetCal)} kcal</p>
            <div className={`mt-3 flex items-center justify-center gap-2 text-sm ${goalHeaderSubText}`}>
              <span>BMR {fmt(result.bmr)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>TDEE {fmt(result.tdee)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>목표 {fmt(result.targetCal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 2: Macro Nutrients ── */}
      {result && (
        <div className="calc-card p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">AI 추천 영양소 비율</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Carb Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-500 font-medium mb-1">탄수화물</p>
              <p className="text-2xl font-bold text-blue-700">{fmt(result.carbGrams)}g</p>
              <p className="text-xs text-blue-400 mt-1">{result.carbPercent}%</p>
            </div>
            {/* Protein Card */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
              <p className="text-xs text-rose-500 font-medium mb-1">단백질</p>
              <p className="text-2xl font-bold text-rose-700">{fmt(result.proteinGrams)}g</p>
              <p className="text-xs text-rose-400 mt-1">{result.proteinPercent}%</p>
            </div>
            {/* Fat Card */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-500 font-medium mb-1">지방</p>
              <p className="text-2xl font-bold text-amber-700">{fmt(result.fatGrams)}g</p>
              <p className="text-xs text-amber-400 mt-1">{result.fatPercent}%</p>
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div className="flex rounded-full overflow-hidden h-8 text-xs font-semibold text-white">
            <div
              className="bg-blue-500 flex items-center justify-center transition-all"
              style={{ width: `${result.carbPercent}%` }}
            >
              {result.carbPercent >= 15 && `탄 ${result.carbPercent}%`}
            </div>
            <div
              className="bg-rose-500 flex items-center justify-center transition-all"
              style={{ width: `${result.proteinPercent}%` }}
            >
              {result.proteinPercent >= 15 && `단 ${result.proteinPercent}%`}
            </div>
            <div
              className="bg-amber-500 flex items-center justify-center transition-all"
              style={{ width: `${result.fatPercent}%` }}
            >
              {result.fatPercent >= 15 && `지 ${result.fatPercent}%`}
            </div>
          </div>
        </div>
      )}

      {/* ── Section 3: Meal Plan ── */}
      {meals && mealSummary && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">끼니별 추천 식단</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMealSeed((s) => s + 1)}
                className="calc-btn-secondary text-xs px-3 py-2"
              >
                식단 새로고침
              </button>
              <button
                onClick={handleCopy}
                className="calc-btn-primary text-xs px-3 py-2"
              >
                {copied ? "복사됨!" : "식단 복사"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Breakfast */}
            <MealCard label="아침" emoji="🌅" foods={meals.breakfast} summary={mealSummary.breakfast} />
            {/* Lunch */}
            <MealCard label="점심" emoji="☀️" foods={meals.lunch} summary={mealSummary.lunch} />
            {/* Dinner */}
            <MealCard label="저녁" emoji="🌙" foods={meals.dinner} summary={mealSummary.dinner} />
            {/* Snack */}
            <MealCard label="간식" emoji="🍎" foods={meals.snack} summary={mealSummary.snack} />
          </div>
        </div>
      )}

      {/* ── Section 4: Daily Summary Table ── */}
      {mealSummary && totalSummary && result && (
        <div className="calc-card overflow-hidden mb-6">
          <h3 className="font-semibold text-gray-900 p-6 pb-0 mb-4">하루 영양 요약</h3>
          <div className="overflow-x-auto">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>끼니</th>
                  <th className="text-right">칼로리</th>
                  <th className="text-right">탄수화물</th>
                  <th className="text-right">단백질</th>
                  <th className="text-right">지방</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["아침", mealSummary.breakfast],
                  ["점심", mealSummary.lunch],
                  ["저녁", mealSummary.dinner],
                  ["간식", mealSummary.snack],
                ] as [string, { cal: number; carb: number; protein: number; fat: number }][]).map(([label, s]) => (
                  <tr key={label}>
                    <td className="font-medium">{label}</td>
                    <td className="text-right">{fmt(s.cal)} kcal</td>
                    <td className="text-right">{fmt(s.carb)}g</td>
                    <td className="text-right">{fmt(s.protein)}g</td>
                    <td className="text-right">{fmt(s.fat)}g</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td>합계</td>
                  <td className="text-right">
                    <span className={
                      Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.1
                        ? "text-green-600"
                        : Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.2
                        ? "text-yellow-600"
                        : "text-red-600"
                    }>
                      {fmt(totalSummary.cal)} kcal
                    </span>
                  </td>
                  <td className="text-right">{fmt(totalSummary.carb)}g</td>
                  <td className="text-right">{fmt(totalSummary.protein)}g</td>
                  <td className="text-right">{fmt(totalSummary.fat)}g</td>
                </tr>
              </tbody>
            </table>
          </div>
          {result && (
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
              목표 칼로리 대비{" "}
              <span className={
                Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.1
                  ? "text-green-600 font-semibold"
                  : Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.2
                  ? "text-yellow-600 font-semibold"
                  : "text-red-600 font-semibold"
              }>
                {totalSummary.cal > result.targetCal ? "+" : ""}{fmt(totalSummary.cal - result.targetCal)} kcal
              </span>{" "}
              ({Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.1
                ? "적절"
                : Math.abs(totalSummary.cal - result.targetCal) <= result.targetCal * 0.2
                ? "약간 차이"
                : "큰 차이"})
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Sticky Bottom Bar ── */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">목표 칼로리</p>
              <p className={`text-lg font-extrabold ${
                result.goalColor === "blue" ? "text-blue-600" : result.goalColor === "green" ? "text-emerald-600" : "text-orange-500"
              }`}>
                {fmt(result.targetCal)} kcal
              </p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
              {copied ? "복사됨!" : "식단 복사"}
            </button>
          </div>
        </div>
      )}

      {/* ── SEO Sections ── */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">탄단지 영양소란?</h2>
          <p className="text-gray-600 leading-relaxed">
            탄단지(탄수화물·단백질·지방)는 우리 몸에 에너지를 공급하는 세 가지 주요 영양소를 말합니다.
            <strong>탄수화물</strong>은 1g당 4kcal의 에너지를 제공하며, 뇌와 근육의 주요 에너지원입니다.
            <strong>단백질</strong>은 1g당 4kcal을 제공하며, 근육 합성과 면역 기능에 필수적입니다.
            <strong>지방</strong>은 1g당 9kcal로 가장 높은 에너지 밀도를 가지며, 호르몬 생성과 지용성 비타민 흡수에 중요합니다.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            이 세 가지 영양소의 비율(탄단지 비율)을 조절하면 체중 감량, 근육 증가, 체중 유지 등 다양한 건강 목표를 효과적으로 달성할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">목표별 식단 가이드</h2>
          <ul className="text-gray-600 space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold flex-shrink-0">감량</span>
              <span>TDEE보다 250~500kcal 적게 섭취합니다. 단백질을 충분히 섭취하여 근손실을 방지하고, 복합 탄수화물과 건강한 지방을 선택하세요. 주 0.5~1kg 감량이 건강합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold flex-shrink-0">유지</span>
              <span>TDEE와 동일한 칼로리를 섭취합니다. 균형 잡힌 탄단지 비율로 영양소를 고르게 섭취하면 현재 체중과 체력을 유지할 수 있습니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold flex-shrink-0">증량</span>
              <span>TDEE보다 250~500kcal 더 섭취합니다. 린벌크의 경우 고단백 식단과 함께 근력 운동을 병행하면 체지방 증가를 최소화하면서 근육량을 늘릴 수 있습니다.</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">식단 관리 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span>매일 같은 시간에 식사하여 <strong>규칙적인 식습관</strong>을 만드세요.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>단백질은 매 끼니 분배</strong>하여 섭취하면 흡수율이 높아집니다. 한 번에 30~40g 이상은 비효율적입니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span><strong>가공식품 대신 자연식품</strong>을 선택하세요. 현미, 고구마, 닭가슴살, 생선 등이 좋습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span><strong>충분한 수분 섭취</strong>(하루 2L 이상)는 대사 활동과 포만감 유지에 도움됩니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">5.</span><span>식단 관리와 함께 <strong>충분한 수면</strong>(7~8시간)과 <strong>규칙적인 운동</strong>을 병행하세요.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문</h2>
          <FAQ />
        </div>
      </section>

      <RelatedTools current="macro-diet" />
    </div>
  );
}

/* ── Meal Card Component ── */
function MealCard({
  label,
  emoji,
  foods,
  summary,
}: {
  label: string;
  emoji: string;
  foods: Food[];
  summary: { cal: number; carb: number; protein: number; fat: number };
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-semibold text-gray-900 text-sm">{label}</span>
        </div>
        <span className="text-xs font-medium text-gray-500">{fmt(summary.cal)} kcal</span>
      </div>
      <div className="space-y-2">
        {foods.map((f, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-gray-700">{f.name}</span>
            <span className="text-gray-400 flex-shrink-0 ml-2">
              {f.cal}kcal
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-200 flex gap-3 text-[10px] text-gray-400">
        <span>탄 {fmt(summary.carb)}g</span>
        <span>단 {fmt(summary.protein)}g</span>
        <span>지 {fmt(summary.fat)}g</span>
      </div>
    </div>
  );
}
