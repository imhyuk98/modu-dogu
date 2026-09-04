"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type Gender = "male" | "female";
type Goal = "diet" | "strength" | "stamina" | "flexibility" | "stress";
type Level = "beginner" | "intermediate" | "advanced";
type Duration = 15 | 30 | 45 | 60 | 90;
type Location = "home" | "gym" | "outdoor";
type Frequency = 2 | 3 | 4 | 5;
type Injury = "knee" | "back" | "shoulder" | "wrist" | "none";
type Category = "strength" | "cardio" | "stretching" | "hiit";
type MuscleGroup =
  | "chest" | "back_muscle" | "shoulders" | "arms" | "core" | "legs"
  | "glutes" | "full_body" | "cardio_general" | "flexibility_general";

interface Exercise {
  name: string;
  category: Category;
  targetMuscle: MuscleGroup;
  difficulty: Level;
  locations: Location[];
  calPerMin: number;
  defaultSets: number;
  defaultReps: string;
  restSec: number;
  avoidInjury: Injury[];
}

interface ScheduledExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSec: number;
  estimatedCal: number;
  durationMin: number;
}

interface DayPlan {
  dayLabel: string;
  theme: string;
  exercises: ScheduledExercise[];
  totalCal: number;
  totalMin: number;
}

interface RoutineResult {
  bmi: number;
  bmiCategory: string;
  weeklyPlan: DayPlan[];
  weeklyCalories: number;
  tips: string[];
  warnings: string[];
}

/* ═══════════════════════════════════════════
   Exercise Database (50+ exercises)
   ═══════════════════════════════════════════ */

const exercises: Exercise[] = [
  // ── 근력 - 하체 ──
  { name: "스쿼트", category: "strength", targetMuscle: "legs", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 8, defaultSets: 3, defaultReps: "15회", restSec: 60, avoidInjury: ["knee"] },
  { name: "런지", category: "strength", targetMuscle: "legs", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 7, defaultSets: 3, defaultReps: "12회 (양쪽)", restSec: 60, avoidInjury: ["knee"] },
  { name: "불가리안 스플릿 스쿼트", category: "strength", targetMuscle: "legs", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 9, defaultSets: 3, defaultReps: "10회 (양쪽)", restSec: 75, avoidInjury: ["knee"] },
  { name: "레그프레스", category: "strength", targetMuscle: "legs", difficulty: "intermediate", locations: ["gym"], calPerMin: 8, defaultSets: 4, defaultReps: "12회", restSec: 90, avoidInjury: ["knee"] },
  { name: "레그컬", category: "strength", targetMuscle: "legs", difficulty: "beginner", locations: ["gym"], calPerMin: 6, defaultSets: 3, defaultReps: "15회", restSec: 60, avoidInjury: [] },
  { name: "카프레이즈", category: "strength", targetMuscle: "legs", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 5, defaultSets: 3, defaultReps: "20회", restSec: 45, avoidInjury: [] },
  { name: "힙쓰러스트", category: "strength", targetMuscle: "glutes", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 7, defaultSets: 3, defaultReps: "12회", restSec: 60, avoidInjury: ["back"] },
  { name: "글루트 브릿지", category: "strength", targetMuscle: "glutes", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: [] },
  { name: "바벨 스쿼트", category: "strength", targetMuscle: "legs", difficulty: "advanced", locations: ["gym"], calPerMin: 10, defaultSets: 4, defaultReps: "8회", restSec: 120, avoidInjury: ["knee", "back"] },
  { name: "프론트 스쿼트", category: "strength", targetMuscle: "legs", difficulty: "advanced", locations: ["gym"], calPerMin: 10, defaultSets: 4, defaultReps: "8회", restSec: 120, avoidInjury: ["knee", "back", "wrist"] },

  // ── 근력 - 가슴 ──
  { name: "푸쉬업", category: "strength", targetMuscle: "chest", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 7, defaultSets: 3, defaultReps: "15회", restSec: 60, avoidInjury: ["wrist", "shoulder"] },
  { name: "벤치프레스", category: "strength", targetMuscle: "chest", difficulty: "intermediate", locations: ["gym"], calPerMin: 9, defaultSets: 4, defaultReps: "10회", restSec: 90, avoidInjury: ["shoulder", "wrist"] },
  { name: "인클라인 벤치프레스", category: "strength", targetMuscle: "chest", difficulty: "intermediate", locations: ["gym"], calPerMin: 9, defaultSets: 4, defaultReps: "10회", restSec: 90, avoidInjury: ["shoulder"] },
  { name: "덤벨 플라이", category: "strength", targetMuscle: "chest", difficulty: "intermediate", locations: ["gym"], calPerMin: 7, defaultSets: 3, defaultReps: "12회", restSec: 60, avoidInjury: ["shoulder"] },
  { name: "딥스", category: "strength", targetMuscle: "chest", difficulty: "advanced", locations: ["gym", "outdoor"], calPerMin: 8, defaultSets: 3, defaultReps: "10회", restSec: 90, avoidInjury: ["shoulder", "wrist"] },
  { name: "무릎 푸쉬업", category: "strength", targetMuscle: "chest", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 5, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: ["wrist"] },

  // ── 근력 - 등 ──
  { name: "데드리프트", category: "strength", targetMuscle: "back_muscle", difficulty: "advanced", locations: ["gym"], calPerMin: 10, defaultSets: 4, defaultReps: "8회", restSec: 120, avoidInjury: ["back", "knee"] },
  { name: "바벨 로우", category: "strength", targetMuscle: "back_muscle", difficulty: "intermediate", locations: ["gym"], calPerMin: 8, defaultSets: 4, defaultReps: "10회", restSec: 90, avoidInjury: ["back"] },
  { name: "덤벨 로우", category: "strength", targetMuscle: "back_muscle", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 7, defaultSets: 3, defaultReps: "12회 (양쪽)", restSec: 60, avoidInjury: ["back"] },
  { name: "풀업", category: "strength", targetMuscle: "back_muscle", difficulty: "advanced", locations: ["gym", "outdoor"], calPerMin: 9, defaultSets: 3, defaultReps: "8회", restSec: 90, avoidInjury: ["shoulder"] },
  { name: "랫풀다운", category: "strength", targetMuscle: "back_muscle", difficulty: "beginner", locations: ["gym"], calPerMin: 7, defaultSets: 3, defaultReps: "12회", restSec: 60, avoidInjury: ["shoulder"] },
  { name: "슈퍼맨", category: "strength", targetMuscle: "back_muscle", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: [] },

  // ── 근력 - 어깨 ──
  { name: "오버헤드 프레스", category: "strength", targetMuscle: "shoulders", difficulty: "intermediate", locations: ["gym"], calPerMin: 8, defaultSets: 4, defaultReps: "10회", restSec: 90, avoidInjury: ["shoulder", "back"] },
  { name: "사이드 레터럴 레이즈", category: "strength", targetMuscle: "shoulders", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: ["shoulder"] },
  { name: "프론트 레이즈", category: "strength", targetMuscle: "shoulders", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "12회", restSec: 45, avoidInjury: ["shoulder"] },
  { name: "페이스풀", category: "strength", targetMuscle: "shoulders", difficulty: "intermediate", locations: ["gym"], calPerMin: 5, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: [] },
  { name: "파이크 푸쉬업", category: "strength", targetMuscle: "shoulders", difficulty: "intermediate", locations: ["home", "outdoor"], calPerMin: 7, defaultSets: 3, defaultReps: "10회", restSec: 60, avoidInjury: ["shoulder", "wrist"] },

  // ── 근력 - 팔 ──
  { name: "바이셉 컬", category: "strength", targetMuscle: "arms", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "12회", restSec: 45, avoidInjury: ["wrist"] },
  { name: "트라이셉 딥", category: "strength", targetMuscle: "arms", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 6, defaultSets: 3, defaultReps: "12회", restSec: 45, avoidInjury: ["wrist", "shoulder"] },
  { name: "해머 컬", category: "strength", targetMuscle: "arms", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "12회", restSec: 45, avoidInjury: ["wrist"] },
  { name: "트라이셉 킥백", category: "strength", targetMuscle: "arms", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 5, defaultSets: 3, defaultReps: "12회 (양쪽)", restSec: 45, avoidInjury: [] },

  // ── 근력 - 코어 ──
  { name: "플랭크", category: "strength", targetMuscle: "core", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 5, defaultSets: 3, defaultReps: "30초", restSec: 30, avoidInjury: ["back"] },
  { name: "크런치", category: "strength", targetMuscle: "core", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 6, defaultSets: 3, defaultReps: "20회", restSec: 30, avoidInjury: ["back"] },
  { name: "레그레이즈", category: "strength", targetMuscle: "core", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 6, defaultSets: 3, defaultReps: "15회", restSec: 45, avoidInjury: ["back"] },
  { name: "러시안 트위스트", category: "strength", targetMuscle: "core", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 7, defaultSets: 3, defaultReps: "20회", restSec: 45, avoidInjury: ["back"] },
  { name: "마운틴 클라이머", category: "strength", targetMuscle: "core", difficulty: "intermediate", locations: ["home", "gym", "outdoor"], calPerMin: 10, defaultSets: 3, defaultReps: "20회", restSec: 45, avoidInjury: ["wrist"] },
  { name: "바이시클 크런치", category: "strength", targetMuscle: "core", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 7, defaultSets: 3, defaultReps: "20회", restSec: 30, avoidInjury: ["back"] },

  // ── 유산소 ──
  { name: "달리기", category: "cardio", targetMuscle: "cardio_general", difficulty: "intermediate", locations: ["gym", "outdoor"], calPerMin: 12, defaultSets: 1, defaultReps: "20분", restSec: 0, avoidInjury: ["knee"] },
  { name: "빠르게 걷기", category: "cardio", targetMuscle: "cardio_general", difficulty: "beginner", locations: ["gym", "outdoor"], calPerMin: 6, defaultSets: 1, defaultReps: "30분", restSec: 0, avoidInjury: [] },
  { name: "자전거 타기", category: "cardio", targetMuscle: "cardio_general", difficulty: "beginner", locations: ["gym", "outdoor"], calPerMin: 8, defaultSets: 1, defaultReps: "20분", restSec: 0, avoidInjury: [] },
  { name: "줄넘기", category: "cardio", targetMuscle: "cardio_general", difficulty: "intermediate", locations: ["home", "outdoor"], calPerMin: 13, defaultSets: 3, defaultReps: "3분", restSec: 60, avoidInjury: ["knee"] },
  { name: "수영", category: "cardio", targetMuscle: "cardio_general", difficulty: "intermediate", locations: ["gym"], calPerMin: 10, defaultSets: 1, defaultReps: "30분", restSec: 0, avoidInjury: [] },
  { name: "실내 자전거", category: "cardio", targetMuscle: "cardio_general", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 7, defaultSets: 1, defaultReps: "20분", restSec: 0, avoidInjury: [] },
  { name: "계단 오르기", category: "cardio", targetMuscle: "cardio_general", difficulty: "intermediate", locations: ["outdoor", "gym"], calPerMin: 11, defaultSets: 1, defaultReps: "15분", restSec: 0, avoidInjury: ["knee"] },
  { name: "제자리 걷기", category: "cardio", targetMuscle: "cardio_general", difficulty: "beginner", locations: ["home"], calPerMin: 4, defaultSets: 1, defaultReps: "20분", restSec: 0, avoidInjury: [] },
  { name: "점핑잭", category: "cardio", targetMuscle: "cardio_general", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 8, defaultSets: 3, defaultReps: "30회", restSec: 30, avoidInjury: ["knee"] },

  // ── 스트레칭 / 요가 ──
  { name: "다운독", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 3, defaultSets: 1, defaultReps: "30초", restSec: 15, avoidInjury: ["wrist"] },
  { name: "고양이-소 스트레칭", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 2, defaultSets: 1, defaultReps: "10회", restSec: 10, avoidInjury: [] },
  { name: "전신 스트레칭", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 3, defaultSets: 1, defaultReps: "5분", restSec: 0, avoidInjury: [] },
  { name: "햄스트링 스트레칭", category: "stretching", targetMuscle: "legs", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 2, defaultSets: 1, defaultReps: "30초 (양쪽)", restSec: 10, avoidInjury: [] },
  { name: "어깨 스트레칭", category: "stretching", targetMuscle: "shoulders", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 2, defaultSets: 1, defaultReps: "30초 (양쪽)", restSec: 10, avoidInjury: [] },
  { name: "워리어 포즈", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 3, defaultSets: 1, defaultReps: "30초 (양쪽)", restSec: 15, avoidInjury: [] },
  { name: "차일드 포즈", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 2, defaultSets: 1, defaultReps: "1분", restSec: 0, avoidInjury: [] },
  { name: "비둘기 자세", category: "stretching", targetMuscle: "glutes", difficulty: "intermediate", locations: ["home", "gym"], calPerMin: 2, defaultSets: 1, defaultReps: "30초 (양쪽)", restSec: 10, avoidInjury: ["knee"] },
  { name: "코브라 자세", category: "stretching", targetMuscle: "core", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 2, defaultSets: 1, defaultReps: "30초", restSec: 10, avoidInjury: ["back"] },
  { name: "폼롤러 등 풀기", category: "stretching", targetMuscle: "back_muscle", difficulty: "beginner", locations: ["home", "gym"], calPerMin: 2, defaultSets: 1, defaultReps: "2분", restSec: 0, avoidInjury: [] },
  { name: "목 스트레칭", category: "stretching", targetMuscle: "flexibility_general", difficulty: "beginner", locations: ["home", "gym", "outdoor"], calPerMin: 1, defaultSets: 1, defaultReps: "30초 (양쪽)", restSec: 10, avoidInjury: [] },

  // ── HIIT ──
  { name: "버피", category: "hiit", targetMuscle: "full_body", difficulty: "advanced", locations: ["home", "gym", "outdoor"], calPerMin: 14, defaultSets: 4, defaultReps: "10회", restSec: 30, avoidInjury: ["knee", "wrist", "back"] },
  { name: "하이니", category: "hiit", targetMuscle: "full_body", difficulty: "intermediate", locations: ["home", "gym", "outdoor"], calPerMin: 11, defaultSets: 4, defaultReps: "20회", restSec: 20, avoidInjury: ["knee"] },
  { name: "스케이터 점프", category: "hiit", targetMuscle: "legs", difficulty: "intermediate", locations: ["home", "gym", "outdoor"], calPerMin: 10, defaultSets: 3, defaultReps: "15회", restSec: 30, avoidInjury: ["knee"] },
  { name: "박스 점프", category: "hiit", targetMuscle: "legs", difficulty: "advanced", locations: ["gym", "outdoor"], calPerMin: 12, defaultSets: 4, defaultReps: "10회", restSec: 45, avoidInjury: ["knee"] },
  { name: "터크 점프", category: "hiit", targetMuscle: "full_body", difficulty: "advanced", locations: ["home", "gym", "outdoor"], calPerMin: 13, defaultSets: 3, defaultReps: "10회", restSec: 30, avoidInjury: ["knee", "back"] },
  { name: "스프린트", category: "hiit", targetMuscle: "full_body", difficulty: "advanced", locations: ["outdoor", "gym"], calPerMin: 15, defaultSets: 5, defaultReps: "20초", restSec: 40, avoidInjury: ["knee"] },
  { name: "타바타 스쿼트", category: "hiit", targetMuscle: "legs", difficulty: "intermediate", locations: ["home", "gym", "outdoor"], calPerMin: 11, defaultSets: 8, defaultReps: "20초", restSec: 10, avoidInjury: ["knee"] },
  { name: "점프 런지", category: "hiit", targetMuscle: "legs", difficulty: "advanced", locations: ["home", "gym", "outdoor"], calPerMin: 12, defaultSets: 3, defaultReps: "12회", restSec: 30, avoidInjury: ["knee"] },
];

/* ═══════════════════════════════════════════
   Utility functions
   ═══════════════════════════════════════════ */

const goalLabels: Record<Goal, string> = {
  diet: "다이어트",
  strength: "근력 증가",
  stamina: "체력 향상",
  flexibility: "유연성",
  stress: "스트레스 해소",
};
const levelLabels: Record<Level, string> = {
  beginner: "초보",
  intermediate: "중급",
  advanced: "고급",
};
const locationLabels: Record<Location, string> = {
  home: "집",
  gym: "헬스장",
  outdoor: "야외",
};
const injuryLabels: Record<Injury, string> = {
  knee: "무릎",
  back: "허리",
  shoulder: "어깨",
  wrist: "손목",
  none: "없음",
};
const categoryLabels: Record<Category, string> = {
  strength: "근력",
  cardio: "유산소",
  stretching: "스트레칭",
  hiit: "HIIT",
};
const categoryColors: Record<Category, string> = {
  strength: "bg-blue-100 text-blue-700",
  cardio: "bg-green-100 text-green-700",
  stretching: "bg-purple-100 text-purple-700",
  hiit: "bg-red-100 text-red-700",
};

function calcBmi(height: number, weight: number) {
  const h = height / 100;
  return weight / (h * h);
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "저체중";
  if (bmi < 23) return "정상";
  if (bmi < 25) return "과체중";
  if (bmi < 30) return "비만 (1단계)";
  if (bmi < 35) return "비만 (2단계)";
  return "고도 비만";
}

/** Goal → category ratio { strength, cardio, stretching, hiit } summing to 1 */
function goalRatio(goal: Goal): Record<Category, number> {
  switch (goal) {
    case "diet": return { strength: 0.2, cardio: 0.45, stretching: 0.1, hiit: 0.25 };
    case "strength": return { strength: 0.6, cardio: 0.1, stretching: 0.15, hiit: 0.15 };
    case "stamina": return { strength: 0.2, cardio: 0.4, stretching: 0.1, hiit: 0.3 };
    case "flexibility": return { strength: 0.15, cardio: 0.15, stretching: 0.55, hiit: 0.15 };
    case "stress": return { strength: 0.2, cardio: 0.3, stretching: 0.35, hiit: 0.15 };
  }
}

const dayNames = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════
   Routine Generation
   ═══════════════════════════════════════════ */

function generateRoutine(
  gender: Gender,
  age: number,
  height: number,
  weight: number,
  goal: Goal,
  level: Level,
  duration: Duration,
  location: Location,
  frequency: Frequency,
  injury: Injury,
): RoutineResult {
  const bmi = calcBmi(height, weight);
  const bmiCat = bmiCategory(bmi);

  // Filter exercises by location, difficulty, and injury
  const maxDiff: Level[] =
    level === "beginner" ? ["beginner"] :
    level === "intermediate" ? ["beginner", "intermediate"] :
    ["beginner", "intermediate", "advanced"];

  const availableExercises = exercises.filter(
    (e) =>
      e.locations.includes(location) &&
      maxDiff.includes(e.difficulty) &&
      (injury === "none" || !e.avoidInjury.includes(injury))
  );

  const ratio = goalRatio(goal);

  // Determine day themes based on goal and frequency
  const themes = buildDayThemes(goal, frequency);

  // Spread training days across the week
  const trainingDayIndices = spreadDays(frequency);

  const weeklyPlan: DayPlan[] = [];
  let weeklyCalories = 0;

  for (let i = 0; i < frequency; i++) {
    const dayIndex = trainingDayIndices[i];
    const theme = themes[i];
    const dayExercises = pickExercisesForDay(
      availableExercises, theme, ratio, duration, level, gender, age, weight
    );
    const totalCal = dayExercises.reduce((s, e) => s + e.estimatedCal, 0);
    const totalMin = dayExercises.reduce((s, e) => s + e.durationMin, 0);
    weeklyCalories += totalCal;

    weeklyPlan.push({
      dayLabel: dayNames[dayIndex],
      theme: theme,
      exercises: dayExercises,
      totalCal,
      totalMin,
    });
  }

  // Tips
  const tips = generateTips(goal, level, bmi, age);
  const warnings = generateWarnings(injury, age, bmi);

  return { bmi, bmiCategory: bmiCat, weeklyPlan, weeklyCalories, tips, warnings };
}

function buildDayThemes(goal: Goal, freq: Frequency): string[] {
  if (goal === "strength") {
    if (freq <= 2) return ["전신 근력", "전신 근력"].slice(0, freq);
    if (freq === 3) return ["상체", "하체", "전신"];
    if (freq === 4) return ["가슴/삼두", "등/이두", "하체/둔근", "어깨/코어"];
    return ["가슴/삼두", "등/이두", "하체", "어깨/코어", "전신 + 유산소"];
  }
  if (goal === "diet") {
    if (freq <= 2) return ["유산소 + 전신", "HIIT + 코어"].slice(0, freq);
    if (freq === 3) return ["유산소 + 상체", "HIIT + 코어", "유산소 + 하체"];
    if (freq === 4) return ["유산소", "근력 + HIIT", "유산소 + 코어", "HIIT + 전신"];
    return ["유산소", "근력 상체", "HIIT", "근력 하체", "유산소 + 코어"];
  }
  if (goal === "flexibility") {
    if (freq <= 2) return ["요가 + 스트레칭", "스트레칭 + 가벼운 운동"].slice(0, freq);
    if (freq === 3) return ["요가 플로우", "스트레칭 + 코어", "요가 + 유산소"];
    if (freq === 4) return ["상체 스트레칭", "하체 스트레칭", "전신 요가", "코어 + 유연성"];
    return ["전신 스트레칭", "요가", "코어 + 유연성", "유산소 + 스트레칭", "전신 요가"];
  }
  if (goal === "stress") {
    if (freq <= 2) return ["유산소 + 요가", "전신 + 스트레칭"].slice(0, freq);
    if (freq === 3) return ["유산소", "요가 + 스트레칭", "전신 + 코어"];
    if (freq === 4) return ["유산소", "요가", "전신 근력", "스트레칭 + 유산소"];
    return ["유산소", "요가", "전신 근력", "HIIT", "스트레칭 + 유산소"];
  }
  // stamina
  if (freq <= 2) return ["유산소 + HIIT", "전신 + 유산소"].slice(0, freq);
  if (freq === 3) return ["유산소", "HIIT + 근력", "유산소 + 코어"];
  if (freq === 4) return ["유산소", "HIIT", "근력 + 유산소", "HIIT + 코어"];
  return ["유산소", "HIIT", "근력 상체", "유산소 + HIIT", "근력 하체 + 코어"];
}

function spreadDays(freq: Frequency): number[] {
  if (freq === 2) return [0, 3];
  if (freq === 3) return [0, 2, 4];
  if (freq === 4) return [0, 1, 3, 4];
  return [0, 1, 2, 4, 5];
}

function pickExercisesForDay(
  available: Exercise[],
  theme: string,
  ratio: Record<Category, number>,
  duration: Duration,
  level: Level,
  gender: Gender,
  age: number,
  weight: number,
): ScheduledExercise[] {
  // warmup stretching ~3min
  const warmupTime = 3;
  const cooldownTime = 2;
  const mainTime = duration - warmupTime - cooldownTime;

  const result: ScheduledExercise[] = [];
  const used = new Set<string>();

  // Always start with warmup
  const warmups = shuffleArray(available.filter((e) => e.category === "stretching"));
  if (warmups.length > 0) {
    const w = warmups[0];
    used.add(w.name);
    result.push(makeScheduled(w, warmupTime, weight, gender, age));
  }

  // Determine category distribution for main part
  const themeLC = theme.toLowerCase();
  const wantCategories: Category[] = [];

  if (themeLC.includes("hiit")) wantCategories.push("hiit");
  if (themeLC.includes("유산소")) wantCategories.push("cardio");
  if (themeLC.includes("근력") || themeLC.includes("상체") || themeLC.includes("하체") || themeLC.includes("전신") || themeLC.includes("가슴") || themeLC.includes("등") || themeLC.includes("어깨") || themeLC.includes("둔근") || themeLC.includes("코어") || themeLC.includes("삼두") || themeLC.includes("이두")) wantCategories.push("strength");
  if (themeLC.includes("요가") || themeLC.includes("스트레칭") || themeLC.includes("유연")) wantCategories.push("stretching");

  if (wantCategories.length === 0) wantCategories.push("strength", "cardio");

  // Also filter by muscle group based on theme
  const targetMuscles = getTargetMuscles(theme);

  let timeLeft = mainTime;
  const perExerciseTime = level === "beginner" ? 4 : level === "intermediate" ? 5 : 5;
  const maxExercises = Math.floor(mainTime / perExerciseTime);

  // Build candidate pool
  let candidates = shuffleArray(
    available.filter(
      (e) =>
        !used.has(e.name) &&
        (wantCategories.includes(e.category)) &&
        (targetMuscles.length === 0 || targetMuscles.includes(e.targetMuscle) || e.targetMuscle === "full_body" || e.targetMuscle === "cardio_general" || e.targetMuscle === "flexibility_general")
    )
  );

  // If not enough candidates, broaden search
  if (candidates.length < 3) {
    candidates = shuffleArray(
      available.filter((e) => !used.has(e.name) && wantCategories.includes(e.category))
    );
  }
  if (candidates.length < 3) {
    candidates = shuffleArray(available.filter((e) => !used.has(e.name)));
  }

  for (const ex of candidates) {
    if (result.length >= maxExercises + 1 || timeLeft <= 0) break;
    used.add(ex.name);
    const exTime = Math.min(perExerciseTime, timeLeft);
    result.push(makeScheduled(ex, exTime, weight, gender, age));
    timeLeft -= exTime;
  }

  // Cooldown stretch
  const cooldowns = shuffleArray(available.filter((e) => e.category === "stretching" && !used.has(e.name)));
  if (cooldowns.length > 0) {
    result.push(makeScheduled(cooldowns[0], cooldownTime, weight, gender, age));
  }

  return result;
}

function getTargetMuscles(theme: string): MuscleGroup[] {
  const t = theme.toLowerCase();
  const muscles: MuscleGroup[] = [];
  if (t.includes("상체") || t.includes("가슴")) muscles.push("chest");
  if (t.includes("상체") || t.includes("등")) muscles.push("back_muscle");
  if (t.includes("상체") || t.includes("어깨")) muscles.push("shoulders");
  if (t.includes("삼두") || t.includes("이두")) muscles.push("arms");
  if (t.includes("하체")) muscles.push("legs", "glutes");
  if (t.includes("둔근")) muscles.push("glutes");
  if (t.includes("코어")) muscles.push("core");
  if (t.includes("전신")) muscles.push("chest", "back_muscle", "legs", "core");
  return muscles;
}

function makeScheduled(
  ex: Exercise,
  allocatedMin: number,
  weight: number,
  gender: Gender,
  age: number,
): ScheduledExercise {
  const genderFactor = gender === "male" ? 1.0 : 0.85;
  const ageFactor = age > 50 ? 0.85 : age > 40 ? 0.9 : 1.0;
  const weightFactor = weight / 70;
  const cal = Math.round(ex.calPerMin * allocatedMin * genderFactor * ageFactor * weightFactor);

  return {
    exercise: ex,
    sets: ex.defaultSets,
    reps: ex.defaultReps,
    restSec: ex.restSec,
    estimatedCal: cal,
    durationMin: allocatedMin,
  };
}

function generateTips(goal: Goal, level: Level, bmi: number, age: number): string[] {
  const tips: string[] = [];

  if (goal === "diet") {
    tips.push("운동 후 30분 이내에 단백질 섭취를 하면 근손실을 방지하면서 체지방을 줄일 수 있습니다.");
    tips.push("공복 유산소는 지방 연소에 효과적이지만, 근손실 위험이 있으니 BCAA 섭취를 고려하세요.");
    tips.push("칼로리 적자를 하루 300~500kcal 수준으로 유지하면 건강하게 체중을 감량할 수 있습니다.");
  } else if (goal === "strength") {
    tips.push("근력 향상을 위해 체중 1kg당 1.6~2.2g의 단백질을 섭취하세요.");
    tips.push("같은 부위 운동 사이에 최소 48시간의 휴식을 가져야 근성장에 효과적입니다.");
    tips.push("점진적 과부하(Progressive Overload) 원칙에 따라 매주 조금씩 무게나 횟수를 늘려가세요.");
  } else if (goal === "stamina") {
    tips.push("체력 향상을 위해 유산소 운동의 강도를 점진적으로 높여가세요.");
    tips.push("인터벌 트레이닝은 체력 향상에 매우 효과적입니다. 고강도와 저강도를 번갈아 하세요.");
    tips.push("충분한 수분 섭취와 탄수화물 보충이 체력 운동에 중요합니다.");
  } else if (goal === "flexibility") {
    tips.push("스트레칭은 근육이 따뜻할 때 더 효과적이므로, 가벼운 유산소 후에 수행하세요.");
    tips.push("한 자세를 최소 20~30초 이상 유지해야 유연성 향상 효과가 있습니다.");
    tips.push("호흡을 통해 긴장을 풀면서 스트레칭하면 가동 범위가 넓어집니다.");
  } else {
    tips.push("규칙적인 운동은 엔도르핀과 세로토닌 분비를 촉진하여 스트레스를 효과적으로 해소합니다.");
    tips.push("자연 속에서 하는 운동(야외 걷기, 달리기 등)은 정신 건강에 더욱 도움이 됩니다.");
    tips.push("요가와 호흡 운동을 병행하면 스트레스 관리에 큰 도움이 됩니다.");
  }

  if (bmi >= 25 && goal !== "diet") {
    tips[2] = "BMI가 과체중 범위이므로, 유산소 운동을 추가하면 건강 관리에 도움이 됩니다.";
  }
  if (age >= 50) {
    tips.push("관절에 무리가 가지 않도록 워밍업과 쿨다운을 충분히 하세요.");
  }

  return tips.slice(0, 3);
}

function generateWarnings(injury: Injury, age: number, bmi: number): string[] {
  const warnings: string[] = [];

  if (injury === "knee") {
    warnings.push("무릎 부상 이력이 있으므로 점프 동작과 깊은 스쿼트를 피하고, 통증이 느껴지면 즉시 중단하세요.");
    warnings.push("무릎 보호대 착용을 권장하며, 운동 전후 무릎 주변 근육 스트레칭을 충분히 하세요.");
  } else if (injury === "back") {
    warnings.push("허리 부상 이력이 있으므로 데드리프트, 크런치 등 허리에 부담이 가는 운동을 피하세요.");
    warnings.push("코어 근력을 강화하되, 허리가 과도하게 꺾이는 자세는 피하고 중립 자세를 유지하세요.");
  } else if (injury === "shoulder") {
    warnings.push("어깨 부상 이력이 있으므로 오버헤드 동작과 무거운 프레스를 피하세요.");
    warnings.push("운동 전 어깨 회전근개 워밍업을 반드시 수행하고, 가동 범위 내에서만 운동하세요.");
  } else if (injury === "wrist") {
    warnings.push("손목 부상 이력이 있으므로 푸쉬업, 프론트 스쿼트 등 손목에 하중이 가는 운동에 주의하세요.");
    warnings.push("손목 보호대를 착용하고, 그립 위치와 각도를 조정하여 손목 부담을 줄이세요.");
  }

  if (age >= 60) {
    warnings.push("고령자의 경우 운동 전 의사와 상담 후 시작하시길 권장합니다.");
  }
  if (bmi >= 30) {
    warnings.push("비만인 경우 관절에 무리가 갈 수 있으니 저충격 운동부터 시작하세요.");
  }

  if (warnings.length === 0) {
    warnings.push("현재 특별한 제한사항은 없지만, 운동 중 통증이 느껴지면 즉시 중단하고 전문가와 상담하세요.");
  }

  return warnings;
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export default function ExerciseRecommendation() {
  // Form state
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [goal, setGoal] = useState<Goal>("diet");
  const [level, setLevel] = useState<Level>("beginner");
  const [duration, setDuration] = useState<Duration>(30);
  const [location, setLocation] = useState<Location>("home");
  const [frequency, setFrequency] = useState<Frequency>(3);
  const [injury, setInjury] = useState<Injury>("none");

  // Result state
  const [result, setResult] = useState<RoutineResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [generationKey, setGenerationKey] = useState(0);

  const handleGenerate = useCallback(() => {
    const a = parseInt(age) || 30;
    const h = parseFloat(height) || 175;
    const w = parseFloat(weight) || 70;
    const r = generateRoutine(gender, a, h, w, goal, level, duration, location, frequency, injury);
    setResult(r);
    setGenerationKey((k) => k + 1);
  }, [gender, age, height, weight, goal, level, duration, location, frequency, injury]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = result.weeklyPlan.map((day) => {
      const exList = day.exercises
        .map((e) => `  - ${e.exercise.name} ${e.sets}x${e.reps} (휴식 ${e.restSec}초) ~${e.estimatedCal}kcal`)
        .join("\n");
      return `[${day.dayLabel}] ${day.theme}\n${exList}\n  소모 칼로리: ~${day.totalCal}kcal`;
    }).join("\n\n");
    const full = `운동 루틴 추천 루틴\nBMI: ${result.bmi.toFixed(1)} (${result.bmiCategory})\n주간 예상 소모 칼로리: ~${result.weeklyCalories}kcal\n\n${text}`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const faqs = [
    { q: "운동 루틴 추천은 어떻게 작동하나요?", a: "입력한 신체 정보, 운동 목표, 경험 수준 등을 바탕으로 알고리즘이 최적의 운동 조합과 주간 스케줄을 생성합니다. 50개 이상의 운동 데이터베이스에서 조건에 맞는 운동을 선택합니다." },
    { q: "운동 루틴을 매번 다르게 생성할 수 있나요?", a: "네, '루틴 다시 생성' 버튼을 누르면 같은 조건에서도 다른 운동 조합으로 새로운 루틴이 생성됩니다. 다양한 루틴을 시도해보세요." },
    { q: "칼로리 소모량은 정확한가요?", a: "제시된 칼로리 소모량은 운동 종류, 체중, 성별, 나이를 기반으로 한 추정치입니다. 실제 소모량은 운동 강도, 개인 체질 등에 따라 달라질 수 있습니다." },
    { q: "부상이 있을 때 운동해도 되나요?", a: "부상 부위를 선택하면 해당 부위에 무리가 가는 운동을 자동으로 제외합니다. 다만 심각한 부상의 경우 반드시 의사나 물리치료사와 상담 후 운동을 시작하세요." },
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          운동 루틴 추천
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          체형과 목표에 맞는 맞춤 운동 루틴을 도구가 생성합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-5 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" />
          신체 정보
        </h2>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
          <div className="flex gap-2">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  gender === g
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        {/* 나이, 키, 몸무게 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">나이</label>
            <div className="relative">
              <input type="number" aria-label="나이" value={age} onChange={(e) => setAge(e.target.value)} className="calc-input text-center pr-7" min={10} max={100} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">세</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">키</label>
            <div className="relative">
              <input type="number" aria-label="키" value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input text-center pr-7" min={100} max={250} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">몸무게</label>
            <div className="relative">
              <input type="number" aria-label="몸무게" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input text-center pr-7" min={30} max={200} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">kg</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-5 pt-5" />

        <h2 className="font-bold text-gray-900 mb-5 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-green-500 rounded-full" />
          운동 설정
        </h2>

        {/* 운동 목표 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">운동 목표</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(goalLabels) as Goal[]).map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  goal === g
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {goalLabels[g]}
              </button>
            ))}
          </div>
        </div>

        {/* 운동 경험 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">운동 경험</label>
          <div className="flex gap-2">
            {(Object.keys(levelLabels) as Level[]).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  level === l
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {levelLabels[l]}
              </button>
            ))}
          </div>
        </div>

        {/* 운동 가능 시간 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">운동 가능 시간</label>
          <div className="flex flex-wrap gap-2">
            {([15, 30, 45, 60, 90] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  duration === d
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}분
              </button>
            ))}
          </div>
        </div>

        {/* 운동 장소 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">운동 장소</label>
          <div className="flex gap-2">
            {(Object.keys(locationLabels) as Location[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocation(l)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location === l
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {l === "home" ? "🏠 " : l === "gym" ? "🏋️ " : "🌳 "}{locationLabels[l]}
              </button>
            ))}
          </div>
        </div>

        {/* 운동 빈도 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">운동 빈도</label>
          <div className="flex gap-2">
            {([2, 3, 4, 5] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  frequency === f
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                주 {f}회{f === 5 ? "+" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* 부상/제한 부위 */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">부상/제한 부위 (선택)</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(injuryLabels) as Injury[]).map((i) => (
              <button
                key={i}
                onClick={() => setInjury(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  injury === i
                    ? i === "none" ? "bg-gray-700 text-white shadow-md" : "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {injuryLabels[i]}
              </button>
            ))}
          </div>
        </div>

        {/* 생성 버튼 */}
        <button onClick={handleGenerate} className="calc-btn-primary w-full text-base py-3.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          운동 루틴 만들기
        </button>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div key={generationKey} className="animate-fade-in space-y-4">
          {/* BMI + 체형 분석 */}
          <div className="calc-card overflow-hidden">
            <div className="calc-result-header">
              <p className="text-blue-200 text-sm mb-1 relative z-10">BMI 분석</p>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {result.bmi.toFixed(1)}
                </p>
              </div>
              <p className="text-blue-200/80 text-sm mt-2 relative z-10">
                체형: {result.bmiCategory}
              </p>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-500">목표</span>
                <span className="font-semibold text-gray-900">{goalLabels[goal]}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-500">경험 수준</span>
                <span className="font-semibold text-gray-900">{levelLabels[level]}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-500">주간 운동</span>
                <span className="font-semibold text-gray-900">주 {frequency}회, 회당 {duration}분</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">주간 예상 소모 칼로리</span>
                <span className="font-bold text-blue-600 text-base">~{result.weeklyCalories.toLocaleString()}kcal</span>
              </div>
            </div>
          </div>

          {/* 주간 운동 계획 */}
          <div className="calc-card p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full" />
                주간 운동 루틴
              </h3>
              <div className="flex gap-2">
                <button onClick={handleRegenerate} className="calc-btn-secondary text-xs px-3 py-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  다시 생성
                </button>
                <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-1.5">
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      복사됨!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      복사
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {result.weeklyPlan.map((day, di) => (
                <div key={di} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{day.dayLabel}</span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">{day.theme}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>~{day.totalMin}분</span>
                      <span className="font-semibold text-blue-600">~{day.totalCal}kcal</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {day.exercises.map((ex, ei) => (
                      <div key={ei} className="px-4 py-3 flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[ex.exercise.category]}`}>
                          {categoryLabels[ex.exercise.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ex.exercise.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {ex.sets > 1 ? `${ex.sets}세트 x ${ex.reps}` : ex.reps}
                            {ex.restSec > 0 ? ` · 휴식 ${ex.restSec}초` : ""}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-gray-700">~{ex.estimatedCal}kcal</p>
                          <p className="text-[10px] text-gray-400">{ex.durationMin}분</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 운동 팁 */}
          <div className="calc-card p-5">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-amber-500 rounded-full" />
              운동 팁
            </h3>
            <div className="space-y-3">
              {result.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1z" />
                      <path fillRule="evenodd" d="M10 2a6 6 0 00-3.815 10.631C7.237 13.452 8 14.702 8 16h4c0-1.298.763-2.548 1.815-3.369A6 6 0 0010 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="calc-card p-5">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-red-500 rounded-full" />
              주의사항
            </h3>
            <div className="space-y-3">
              {result.warnings.map((warn, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-red-400 text-sm mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{warn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">운동 루틴 추천이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            운동 루틴 추천은 사용자의 신체 정보(키, 몸무게, 나이, 성별), 운동 목표, 경험 수준,
            가용 시간, 운동 장소 등을 종합적으로 분석하여 최적의 주간 운동 루틴을 자동으로
            생성하는 서비스입니다. 50개 이상의 운동 데이터베이스를 기반으로 개인 맞춤형
            운동 계획을 제공하며, 부상 부위를 고려한 안전한 운동 추천이 가능합니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">운동 목표별 추천 가이드</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>목표</th>
                  <th>추천 운동 비율</th>
                  <th>권장 빈도</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="font-medium">다이어트</td><td>유산소 45% + HIIT 25% + 근력 20%</td><td>주 4~5회</td></tr>
                <tr><td className="font-medium">근력 증가</td><td>근력 60% + HIIT 15% + 스트레칭 15%</td><td>주 3~4회</td></tr>
                <tr><td className="font-medium">체력 향상</td><td>유산소 40% + HIIT 30% + 근력 20%</td><td>주 3~5회</td></tr>
                <tr><td className="font-medium">유연성</td><td>스트레칭 55% + 근력 15% + 유산소 15%</td><td>주 3~5회</td></tr>
                <tr><td className="font-medium">스트레스 해소</td><td>스트레칭 35% + 유산소 30% + 근력 20%</td><td>주 3~4회</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">운동 경험별 권장 사항</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>수준</th>
                  <th>운동 강도</th>
                  <th>권장 시간</th>
                  <th>주의사항</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="font-medium">초보</td><td>저~중강도</td><td>15~30분</td><td>정확한 자세 습득이 우선</td></tr>
                <tr><td className="font-medium">중급</td><td>중~고강도</td><td>30~60분</td><td>점진적 과부하 적용</td></tr>
                <tr><td className="font-medium">고급</td><td>고강도</td><td>45~90분</td><td>충분한 회복 시간 확보</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="calc-faq mt-3">
            {faqs.map((faq, i) => (
              <div key={i} className="calc-faq-item">
                <button
                  className="calc-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="calc-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedTools current="exercise" />
    </div>
  );
}
