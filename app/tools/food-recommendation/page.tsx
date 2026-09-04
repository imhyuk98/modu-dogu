"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */

type Mood = "평범" | "우울" | "신남" | "피곤" | "스트레스" | "배고픔 폭발";
type Weather = "맑음" | "더움" | "추움" | "비옴" | "눈옴" | "흐림";
type MealType = "아침" | "점심" | "저녁" | "야식" | "간식";
type Companion = "혼밥" | "2명" | "3~4명" | "5명 이상";
type Budget = "~5천원" | "~1만원" | "~2만원" | "~3만원" | "3만원 이상";
type Cuisine = "한식" | "중식" | "일식" | "양식" | "분식" | "패스트푸드" | "카페" | "동남아" | "멕시칸";
type Exclusion = "매운음식" | "날것" | "밀가루" | "유제품" | "없음";

interface FoodItem {
  name: string;
  emoji: string;
  category: Cuisine;
  priceRange: [number, number]; // min, max (원)
  moods: Mood[];
  weathers: Weather[];
  meals: MealType[];
  companions: Companion[];
  description: string;
  calories: number;
  spicy: number; // 0-3
  isRaw?: boolean;
  hasFlour?: boolean;
  hasDairy?: boolean;
}

interface Recommendation {
  food: FoodItem;
  reason: string;
  score: number;
}

/* ══════════════════════════════════════════
   Constants
   ══════════════════════════════════════════ */

const MOODS: { value: Mood; emoji: string }[] = [
  { value: "평범", emoji: "😐" },
  { value: "우울", emoji: "😢" },
  { value: "신남", emoji: "🥳" },
  { value: "피곤", emoji: "😴" },
  { value: "스트레스", emoji: "😤" },
  { value: "배고픔 폭발", emoji: "🤤" },
];

const WEATHERS: { value: Weather; emoji: string }[] = [
  { value: "맑음", emoji: "☀️" },
  { value: "더움", emoji: "🥵" },
  { value: "추움", emoji: "🥶" },
  { value: "비옴", emoji: "🌧️" },
  { value: "눈옴", emoji: "❄️" },
  { value: "흐림", emoji: "☁️" },
];

const MEALS: { value: MealType; emoji: string }[] = [
  { value: "아침", emoji: "🌅" },
  { value: "점심", emoji: "☀️" },
  { value: "저녁", emoji: "🌙" },
  { value: "야식", emoji: "🌃" },
  { value: "간식", emoji: "🍪" },
];

const COMPANIONS: { value: Companion; emoji: string }[] = [
  { value: "혼밥", emoji: "🧑" },
  { value: "2명", emoji: "👫" },
  { value: "3~4명", emoji: "👨‍👩‍👧" },
  { value: "5명 이상", emoji: "👨‍👩‍👧‍👦" },
];

const BUDGETS: { value: Budget; emoji: string }[] = [
  { value: "~5천원", emoji: "💸" },
  { value: "~1만원", emoji: "💵" },
  { value: "~2만원", emoji: "💰" },
  { value: "~3만원", emoji: "💎" },
  { value: "3만원 이상", emoji: "👑" },
];

const CUISINES: { value: Cuisine; emoji: string }[] = [
  { value: "한식", emoji: "🇰🇷" },
  { value: "중식", emoji: "🇨🇳" },
  { value: "일식", emoji: "🇯🇵" },
  { value: "양식", emoji: "🍝" },
  { value: "분식", emoji: "🍢" },
  { value: "패스트푸드", emoji: "🍔" },
  { value: "카페", emoji: "☕" },
  { value: "동남아", emoji: "🌴" },
  { value: "멕시칸", emoji: "🌮" },
];

const EXCLUSIONS: { value: Exclusion; emoji: string }[] = [
  { value: "매운음식", emoji: "🌶️" },
  { value: "날것", emoji: "🐟" },
  { value: "밀가루", emoji: "🌾" },
  { value: "유제품", emoji: "🥛" },
  { value: "없음", emoji: "✅" },
];

const BUDGET_MAX: Record<Budget, number> = {
  "~5천원": 5000,
  "~1만원": 10000,
  "~2만원": 20000,
  "~3만원": 30000,
  "3만원 이상": 999999,
};

/* ══════════════════════════════════════════
   Food Database (150+ items)
   ══════════════════════════════════════════ */

const FOODS: FoodItem[] = [
  // ── 한식 ──
  { name: "김치찌개", emoji: "🍲", category: "한식", priceRange: [7000, 9000], moods: ["평범", "우울", "스트레스"], weathers: ["추움", "비옴", "눈옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "얼큰한 김치와 돼지고기의 조합", calories: 350, spicy: 2 },
  { name: "된장찌개", emoji: "🍲", category: "한식", priceRange: [7000, 9000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "구수한 된장의 깊은 맛", calories: 300, spicy: 0 },
  { name: "비빔밥", emoji: "🍚", category: "한식", priceRange: [8000, 12000], moods: ["평범", "신남", "피곤"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "다양한 나물과 고추장의 하모니", calories: 550, spicy: 1 },
  { name: "불고기", emoji: "🥩", category: "한식", priceRange: [12000, 18000], moods: ["신남", "배고픔 폭발", "평범"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "달콤한 양념의 부드러운 소고기", calories: 450, spicy: 0 },
  { name: "삼겹살", emoji: "🥓", category: "한식", priceRange: [15000, 25000], moods: ["신남", "스트레스", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림", "비옴"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "고소한 삼겹살에 소주 한 잔", calories: 670, spicy: 0 },
  { name: "치킨", emoji: "🍗", category: "한식", priceRange: [18000, 25000], moods: ["신남", "스트레스", "배고픔 폭발", "우울"], weathers: ["맑음", "비옴", "눈옴", "흐림"], meals: ["저녁", "야식", "간식"], companions: ["혼밥", "2명", "3~4명", "5명 이상"], description: "바삭한 치킨과 맥주의 조합", calories: 600, spicy: 0 },
  { name: "떡볶이", emoji: "🍢", category: "분식", priceRange: [4000, 6000], moods: ["스트레스", "신남", "배고픔 폭발"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "간식", "야식"], companions: ["혼밥", "2명", "3~4명"], description: "매콤달콤한 국민 간식", calories: 480, spicy: 2, hasFlour: true },
  { name: "김밥", emoji: "🍙", category: "분식", priceRange: [3000, 5000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "점심", "간식"], companions: ["혼밥", "2명"], description: "간편하고 든든한 한 줄", calories: 400, spicy: 0 },
  { name: "냉면", emoji: "🍜", category: "한식", priceRange: [9000, 13000], moods: ["평범", "신남", "피곤"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "시원한 육수에 쫄깃한 면", calories: 380, spicy: 0 },
  { name: "갈비탕", emoji: "🍖", category: "한식", priceRange: [12000, 16000], moods: ["피곤", "우울", "평범"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "뜨끈한 갈비 국물의 보양식", calories: 500, spicy: 0 },
  { name: "설렁탕", emoji: "🥣", category: "한식", priceRange: [10000, 14000], moods: ["피곤", "우울", "평범"], weathers: ["추움", "비옴", "눈옴", "흐림"], meals: ["아침", "점심", "저녁"], companions: ["혼밥", "2명"], description: "뽀얀 사골 국물의 깊은 맛", calories: 420, spicy: 0 },
  { name: "삼계탕", emoji: "🐔", category: "한식", priceRange: [13000, 18000], moods: ["피곤", "우울", "평범"], weathers: ["더움", "추움"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "영양 만점 보양식의 대명사", calories: 550, spicy: 0 },
  { name: "감자탕", emoji: "🦴", category: "한식", priceRange: [10000, 25000], moods: ["스트레스", "배고픔 폭발", "신남"], weathers: ["추움", "비옴", "눈옴"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "뼈다귀 감자탕 한 솥", calories: 480, spicy: 1 },
  { name: "부대찌개", emoji: "🫕", category: "한식", priceRange: [10000, 15000], moods: ["스트레스", "배고픔 폭발", "신남"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "햄, 소시지, 라면이 듬뿍", calories: 550, spicy: 2 },
  { name: "순두부찌개", emoji: "🍲", category: "한식", priceRange: [7000, 10000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "부드러운 순두부에 계란 톡", calories: 320, spicy: 2 },
  { name: "제육볶음", emoji: "🍳", category: "한식", priceRange: [8000, 11000], moods: ["스트레스", "배고픔 폭발", "평범"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "매콤한 돼지고기 볶음 백반", calories: 520, spicy: 2 },
  { name: "보쌈", emoji: "🥬", category: "한식", priceRange: [15000, 30000], moods: ["신남", "배고픔 폭발", "스트레스"], weathers: ["맑음", "추움", "흐림"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "부드러운 수육과 쌈채소", calories: 450, spicy: 0 },
  { name: "족발", emoji: "🦶", category: "한식", priceRange: [18000, 35000], moods: ["신남", "배고픔 폭발", "스트레스"], weathers: ["맑음", "추움", "흐림"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "쫀득한 족발에 새우젓", calories: 550, spicy: 0 },
  { name: "칼국수", emoji: "🍜", category: "한식", priceRange: [7000, 10000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "눈옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "뜨끈한 국물에 쫄깃한 면발", calories: 420, spicy: 0, hasFlour: true },
  { name: "수제비", emoji: "🍜", category: "한식", priceRange: [7000, 9000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "쫀득한 밀가루 반죽의 구수함", calories: 380, spicy: 0, hasFlour: true },
  { name: "잔치국수", emoji: "🍝", category: "한식", priceRange: [6000, 8000], moods: ["평범", "피곤"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "멸치 육수의 따뜻한 국수", calories: 350, spicy: 0, hasFlour: true },
  { name: "콩나물국밥", emoji: "🍲", category: "한식", priceRange: [7000, 9000], moods: ["피곤", "우울", "평범"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "해장의 정석, 아삭한 콩나물", calories: 350, spicy: 1 },
  { name: "국밥", emoji: "🥘", category: "한식", priceRange: [8000, 11000], moods: ["피곤", "배고픔 폭발", "평범"], weathers: ["추움", "비옴", "눈옴", "흐림"], meals: ["아침", "점심", "저녁"], companions: ["혼밥", "2명"], description: "든든한 한 그릇 국밥", calories: 500, spicy: 0 },
  { name: "김치볶음밥", emoji: "🍳", category: "한식", priceRange: [7000, 9000], moods: ["평범", "스트레스", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁", "야식"], companions: ["혼밥", "2명"], description: "볶음밥에 계란 후라이 올려", calories: 480, spicy: 1 },
  { name: "돌솥비빔밥", emoji: "🍚", category: "한식", priceRange: [9000, 13000], moods: ["평범", "신남"], weathers: ["추움", "맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "뜨끈한 돌솥에 누룽지까지", calories: 580, spicy: 1 },
  { name: "해물파전", emoji: "🥞", category: "한식", priceRange: [12000, 18000], moods: ["신남", "평범", "스트레스"], weathers: ["비옴", "흐림", "추움"], meals: ["저녁", "야식"], companions: ["2명", "3~4명"], description: "비 오는 날 막걸리와 함께", calories: 400, spicy: 0, hasFlour: true },
  { name: "닭갈비", emoji: "🍗", category: "한식", priceRange: [12000, 16000], moods: ["신남", "스트레스", "배고픔 폭발"], weathers: ["추움", "맑음", "흐림"], meals: ["저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "매콤한 춘천 닭갈비", calories: 500, spicy: 2 },
  { name: "쌈밥", emoji: "🥬", category: "한식", priceRange: [8000, 12000], moods: ["평범", "피곤"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "신선한 쌈채소에 쌈장", calories: 380, spicy: 0 },
  { name: "곱창", emoji: "🔥", category: "한식", priceRange: [15000, 25000], moods: ["신남", "스트레스", "배고픔 폭발"], weathers: ["추움", "맑음"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "불맛 가득한 곱창볶음", calories: 480, spicy: 1 },
  { name: "찜닭", emoji: "🍗", category: "한식", priceRange: [15000, 25000], moods: ["신남", "배고픔 폭발", "스트레스"], weathers: ["추움", "비옴", "흐림"], meals: ["저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "안동 찜닭, 매콤달콤", calories: 500, spicy: 2 },
  { name: "해장국", emoji: "🍲", category: "한식", priceRange: [8000, 11000], moods: ["피곤", "우울"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "뜨끈한 국물로 속을 달래요", calories: 400, spicy: 1 },
  { name: "청국장", emoji: "🍲", category: "한식", priceRange: [8000, 10000], moods: ["평범", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "구수한 냄새가 매력적인", calories: 300, spicy: 0 },
  { name: "육회", emoji: "🥩", category: "한식", priceRange: [15000, 25000], moods: ["신남", "평범"], weathers: ["맑음", "더움"], meals: ["저녁", "야식"], companions: ["2명", "3~4명"], description: "신선한 소고기 육회", calories: 280, spicy: 0, isRaw: true },
  { name: "닭볶음탕", emoji: "🍗", category: "한식", priceRange: [10000, 15000], moods: ["스트레스", "배고픔 폭발"], weathers: ["추움", "비옴", "흐림"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "매콤한 닭볶음탕 한 냄비", calories: 450, spicy: 2 },
  { name: "오징어볶음", emoji: "🦑", category: "한식", priceRange: [9000, 12000], moods: ["스트레스", "배고픔 폭발", "평범"], weathers: ["맑음", "추움"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "쫄깃한 오징어에 매콤한 양념", calories: 380, spicy: 2 },
  { name: "떡갈비", emoji: "🥩", category: "한식", priceRange: [10000, 15000], moods: ["평범", "신남"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "부드러운 다진 갈비의 풍미", calories: 450, spicy: 0 },
  { name: "물냉면", emoji: "🍜", category: "한식", priceRange: [9000, 13000], moods: ["평범", "신남"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "시원한 동치미 육수 냉면", calories: 380, spicy: 0 },
  { name: "비빔냉면", emoji: "🍜", category: "한식", priceRange: [9000, 13000], moods: ["스트레스", "신남"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "매콤새콤 비빔냉면", calories: 400, spicy: 2 },
  { name: "샤브샤브", emoji: "🍲", category: "한식", priceRange: [15000, 25000], moods: ["평범", "피곤"], weathers: ["추움", "비옴"], meals: ["점심", "저녁"], companions: ["2명", "3~4명"], description: "신선한 채소와 얇은 고기", calories: 350, spicy: 0 },
  { name: "곱돌김밥", emoji: "🍙", category: "분식", priceRange: [4000, 6000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "점심", "간식"], companions: ["혼밥"], description: "속이 꽉 찬 충무김밥", calories: 380, spicy: 0 },

  // ── 중식 ──
  { name: "짜장면", emoji: "🍜", category: "중식", priceRange: [7000, 9000], moods: ["평범", "우울", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림", "비옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "달콤한 춘장의 국민 메뉴", calories: 600, spicy: 0, hasFlour: true },
  { name: "짬뽕", emoji: "🍜", category: "중식", priceRange: [8000, 10000], moods: ["스트레스", "배고픔 폭발", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "얼큰한 해물 짬뽕", calories: 550, spicy: 3, hasFlour: true },
  { name: "탕수육", emoji: "🍖", category: "중식", priceRange: [15000, 25000], moods: ["신남", "배고픔 폭발", "평범"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "바삭한 튀김에 새콤달콤 소스", calories: 650, spicy: 0, hasFlour: true },
  { name: "마라탕", emoji: "🌶️", category: "중식", priceRange: [10000, 15000], moods: ["스트레스", "신남", "배고픔 폭발"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁", "야식"], companions: ["혼밥", "2명", "3~4명"], description: "얼얼한 마라의 중독성", calories: 500, spicy: 3 },
  { name: "양꼬치", emoji: "🍢", category: "중식", priceRange: [15000, 25000], moods: ["신남", "스트레스", "배고픔 폭발"], weathers: ["추움", "맑음"], meals: ["저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "꼬치에 꽂힌 양고기의 풍미", calories: 450, spicy: 1 },
  { name: "마라샹궈", emoji: "🔥", category: "중식", priceRange: [12000, 18000], moods: ["스트레스", "신남", "배고픔 폭발"], weathers: ["추움", "비옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "볶은 마라의 진한 풍미", calories: 550, spicy: 3 },
  { name: "깐풍기", emoji: "🍗", category: "중식", priceRange: [18000, 25000], moods: ["신남", "배고픔 폭발"], weathers: ["맑음", "흐림"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "매콤달콤 바삭한 닭튀김", calories: 580, spicy: 2, hasFlour: true },
  { name: "볶음밥", emoji: "🍳", category: "중식", priceRange: [8000, 10000], moods: ["평범", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "고슬고슬 중화 볶음밥", calories: 520, spicy: 0 },
  { name: "유린기", emoji: "🍗", category: "중식", priceRange: [15000, 22000], moods: ["신남", "배고픔 폭발"], weathers: ["맑음", "더움"], meals: ["점심", "저녁"], companions: ["2명", "3~4명"], description: "바삭한 튀김에 상큼한 소스", calories: 520, spicy: 0, hasFlour: true },
  { name: "마파두부", emoji: "🍲", category: "중식", priceRange: [9000, 12000], moods: ["스트레스", "평범"], weathers: ["추움", "비옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "부드러운 두부에 매콤한 소스", calories: 380, spicy: 2 },
  { name: "짜장밥", emoji: "🍚", category: "중식", priceRange: [8000, 10000], moods: ["평범", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "짜장소스와 밥의 조합", calories: 580, spicy: 0 },
  { name: "잡채밥", emoji: "🍚", category: "중식", priceRange: [8000, 10000], moods: ["평범", "배고픔 폭발"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "다양한 재료의 잡채덮밥", calories: 500, spicy: 0 },

  // ── 일식 ──
  { name: "초밥", emoji: "🍣", category: "일식", priceRange: [12000, 30000], moods: ["신남", "평범"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "신선한 해산물의 정수", calories: 350, spicy: 0, isRaw: true },
  { name: "라멘", emoji: "🍜", category: "일식", priceRange: [10000, 15000], moods: ["피곤", "우울", "배고픔 폭발"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁", "야식"], companions: ["혼밥", "2명"], description: "진한 돈코츠 라멘", calories: 550, spicy: 0, hasFlour: true },
  { name: "돈카츠", emoji: "🍱", category: "일식", priceRange: [10000, 15000], moods: ["배고픔 폭발", "평범", "스트레스"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "바삭한 돈카츠와 소스", calories: 650, spicy: 0, hasFlour: true },
  { name: "우동", emoji: "🍜", category: "일식", priceRange: [8000, 12000], moods: ["평범", "피곤", "우울"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "따뜻한 육수의 쫄깃한 면", calories: 400, spicy: 0, hasFlour: true },
  { name: "규동", emoji: "🍚", category: "일식", priceRange: [8000, 11000], moods: ["평범", "피곤", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "달콤한 양념 소고기 덮밥", calories: 500, spicy: 0 },
  { name: "카레", emoji: "🍛", category: "일식", priceRange: [8000, 12000], moods: ["평범", "피곤", "배고픔 폭발"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "진한 일본식 카레라이스", calories: 550, spicy: 1 },
  { name: "사시미", emoji: "🐟", category: "일식", priceRange: [20000, 40000], moods: ["신남", "평범"], weathers: ["맑음", "더움"], meals: ["저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "두툼한 회 한 점의 행복", calories: 250, spicy: 0, isRaw: true },
  { name: "오니기리", emoji: "🍙", category: "일식", priceRange: [2000, 4000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "간식"], companions: ["혼밥"], description: "간편한 삼각 주먹밥", calories: 200, spicy: 0 },
  { name: "텐동", emoji: "🍤", category: "일식", priceRange: [10000, 15000], moods: ["배고픔 폭발", "평범"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "바삭한 튀김 덮밥", calories: 600, spicy: 0, hasFlour: true },
  { name: "타코야키", emoji: "🐙", category: "일식", priceRange: [4000, 7000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "동글동글 문어빵", calories: 350, spicy: 0, hasFlour: true },
  { name: "일본식 카츠카레", emoji: "🍛", category: "일식", priceRange: [11000, 15000], moods: ["배고픔 폭발", "평범"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "카레 + 돈카츠의 최강 조합", calories: 750, spicy: 1, hasFlour: true },
  { name: "소바", emoji: "🍜", category: "일식", priceRange: [9000, 13000], moods: ["평범", "피곤"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "시원한 메밀 소바", calories: 350, spicy: 0 },

  // ── 양식 ──
  { name: "파스타", emoji: "🍝", category: "양식", priceRange: [12000, 20000], moods: ["신남", "평범", "우울"], weathers: ["맑음", "흐림", "비옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "크림/토마토/오일 파스타", calories: 550, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "피자", emoji: "🍕", category: "양식", priceRange: [15000, 30000], moods: ["신남", "배고픔 폭발", "스트레스"], weathers: ["맑음", "비옴", "흐림"], meals: ["점심", "저녁", "야식"], companions: ["2명", "3~4명", "5명 이상"], description: "치즈 가득한 피자 한 판", calories: 700, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "스테이크", emoji: "🥩", category: "양식", priceRange: [20000, 50000], moods: ["신남", "배고픔 폭발"], weathers: ["맑음", "추움", "흐림"], meals: ["저녁"], companions: ["혼밥", "2명"], description: "미디엄으로 구운 스테이크", calories: 600, spicy: 0 },
  { name: "햄버거", emoji: "🍔", category: "패스트푸드", priceRange: [6000, 15000], moods: ["배고픔 폭발", "스트레스", "평범"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁", "야식"], companions: ["혼밥", "2명"], description: "육즙 터지는 수제 버거", calories: 650, spicy: 0, hasFlour: true },
  { name: "리조또", emoji: "🍚", category: "양식", priceRange: [13000, 20000], moods: ["평범", "피곤", "신남"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "크리미한 이탈리안 리조또", calories: 500, spicy: 0, hasDairy: true },
  { name: "샐러드", emoji: "🥗", category: "양식", priceRange: [8000, 15000], moods: ["평범", "피곤"], weathers: ["더움", "맑음"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "신선한 채소의 가벼운 식사", calories: 250, spicy: 0 },
  { name: "오믈렛", emoji: "🥚", category: "양식", priceRange: [8000, 13000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "부드러운 계란 오믈렛", calories: 350, spicy: 0, hasDairy: true },
  { name: "감바스", emoji: "🦐", category: "양식", priceRange: [15000, 22000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "마늘 올리브유에 새우", calories: 380, spicy: 0 },
  { name: "그라탕", emoji: "🧀", category: "양식", priceRange: [12000, 16000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "치즈 듬뿍 오븐 그라탕", calories: 500, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "필라프", emoji: "🍚", category: "양식", priceRange: [10000, 14000], moods: ["평범", "배고픔 폭발"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "버터 향 가득한 볶음밥", calories: 480, spicy: 0, hasDairy: true },
  { name: "크림수프", emoji: "🍵", category: "양식", priceRange: [6000, 10000], moods: ["우울", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "부드러운 크림 수프", calories: 250, spicy: 0, hasDairy: true },
  { name: "브런치", emoji: "🥞", category: "양식", priceRange: [12000, 20000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "팬케이크, 에그 베네딕트", calories: 550, spicy: 0, hasFlour: true, hasDairy: true },

  // ── 분식 ──
  { name: "라볶이", emoji: "🍜", category: "분식", priceRange: [5000, 7000], moods: ["스트레스", "배고픔 폭발", "신남"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "간식", "야식"], companions: ["혼밥", "2명"], description: "라면 + 떡볶이의 조합", calories: 520, spicy: 2, hasFlour: true },
  { name: "순대", emoji: "🌭", category: "분식", priceRange: [4000, 7000], moods: ["평범", "배고픔 폭발"], weathers: ["추움", "비옴", "흐림"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "쫀득한 순대에 소금 찍어", calories: 350, spicy: 0 },
  { name: "어묵탕", emoji: "🍢", category: "분식", priceRange: [3000, 5000], moods: ["평범", "우울", "피곤"], weathers: ["추움", "비옴", "눈옴"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "뜨끈한 어묵 국물 한 잔", calories: 200, spicy: 0, hasFlour: true },
  { name: "튀김", emoji: "🍤", category: "분식", priceRange: [3000, 5000], moods: ["평범", "배고픔 폭발"], weathers: ["추움", "흐림"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "바삭한 모듬 튀김", calories: 400, spicy: 0, hasFlour: true },
  { name: "쫄면", emoji: "🍜", category: "분식", priceRange: [6000, 8000], moods: ["평범", "스트레스"], weathers: ["더움", "맑음"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "매콤새콤한 쫄깃한 면", calories: 420, spicy: 2, hasFlour: true },
  { name: "라면", emoji: "🍜", category: "분식", priceRange: [4000, 6000], moods: ["우울", "피곤", "배고픔 폭발", "스트레스"], weathers: ["추움", "비옴", "눈옴"], meals: ["야식", "간식"], companions: ["혼밥"], description: "간편한 라면 한 그릇", calories: 500, spicy: 2, hasFlour: true },
  { name: "떡꼬치", emoji: "🍡", category: "분식", priceRange: [2000, 3000], moods: ["평범", "신남"], weathers: ["추움", "흐림"], meals: ["간식"], companions: ["혼밥", "2명"], description: "달콤 매콤한 떡꼬치", calories: 250, spicy: 1 },
  { name: "핫도그", emoji: "🌭", category: "분식", priceRange: [3000, 5000], moods: ["평범", "신남"], weathers: ["맑음", "흐림"], meals: ["간식"], companions: ["혼밥", "2명"], description: "바삭한 모짜렐라 핫도그", calories: 350, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "만두", emoji: "🥟", category: "분식", priceRange: [4000, 7000], moods: ["평범", "배고픔 폭발", "피곤"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "찐만두, 군만두 골라 먹는 재미", calories: 350, spicy: 0, hasFlour: true },

  // ── 패스트푸드 ──
  { name: "프라이드치킨", emoji: "🍗", category: "패스트푸드", priceRange: [8000, 12000], moods: ["배고픔 폭발", "스트레스", "신남"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁", "야식"], companions: ["혼밥", "2명", "3~4명"], description: "바삭한 프라이드 한 마리", calories: 580, spicy: 0, hasFlour: true },
  { name: "감자튀김", emoji: "🍟", category: "패스트푸드", priceRange: [3000, 5000], moods: ["평범", "스트레스", "신남"], weathers: ["맑음", "흐림"], meals: ["간식"], companions: ["혼밥", "2명"], description: "짭짤 바삭한 감자튀김", calories: 350, spicy: 0 },
  { name: "핫윙", emoji: "🍗", category: "패스트푸드", priceRange: [6000, 10000], moods: ["스트레스", "배고픔 폭발"], weathers: ["맑음", "흐림"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "매콤한 양념 핫윙", calories: 400, spicy: 2 },
  { name: "너겟", emoji: "🍗", category: "패스트푸드", priceRange: [4000, 7000], moods: ["평범", "신남"], weathers: ["맑음", "흐림"], meals: ["간식"], companions: ["혼밥", "2명"], description: "한 입 크기 치킨 너겟", calories: 300, spicy: 0, hasFlour: true },
  { name: "서브웨이", emoji: "🥪", category: "패스트푸드", priceRange: [6000, 10000], moods: ["평범", "피곤"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "신선한 채소 가득 샌드위치", calories: 400, spicy: 0, hasFlour: true },
  { name: "타코", emoji: "🌮", category: "멕시칸", priceRange: [8000, 13000], moods: ["신남", "평범"], weathers: ["맑음", "더움"], meals: ["점심", "저녁"], companions: ["혼밥", "2명", "3~4명"], description: "토르티야에 싸 먹는 맛", calories: 400, spicy: 1, hasFlour: true },
  { name: "부리또", emoji: "🌯", category: "멕시칸", priceRange: [9000, 14000], moods: ["배고픔 폭발", "신남"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "든든한 멕시칸 부리또", calories: 600, spicy: 1, hasFlour: true },
  { name: "나초", emoji: "🧀", category: "멕시칸", priceRange: [8000, 13000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["간식", "야식"], companions: ["2명", "3~4명"], description: "바삭한 나초에 살사 소스", calories: 450, spicy: 1, hasDairy: true },
  { name: "케사디아", emoji: "🫓", category: "멕시칸", priceRange: [9000, 14000], moods: ["평범", "신남"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁", "간식"], companions: ["혼밥", "2명"], description: "치즈 듬뿍 토르티야 구이", calories: 480, spicy: 0, hasFlour: true, hasDairy: true },

  // ── 동남아 ──
  { name: "쌀국수(포)", emoji: "🍜", category: "동남아", priceRange: [9000, 13000], moods: ["피곤", "평범", "우울"], weathers: ["더움", "맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "깔끔한 베트남 쌀국수", calories: 380, spicy: 0 },
  { name: "팟타이", emoji: "🍝", category: "동남아", priceRange: [10000, 14000], moods: ["평범", "신남"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "새콤달콤 태국식 볶음면", calories: 450, spicy: 1 },
  { name: "똠양꿍", emoji: "🍲", category: "동남아", priceRange: [11000, 16000], moods: ["스트레스", "신남", "피곤"], weathers: ["추움", "비옴", "더움"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "새콤매콤한 태국식 수프", calories: 300, spicy: 3 },
  { name: "카오팟", emoji: "🍳", category: "동남아", priceRange: [9000, 12000], moods: ["평범", "배고픔 폭발"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "태국식 볶음밥", calories: 480, spicy: 1 },
  { name: "반미", emoji: "🥖", category: "동남아", priceRange: [6000, 9000], moods: ["평범", "피곤"], weathers: ["맑음", "더움", "흐림"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "베트남식 바게트 샌드위치", calories: 380, spicy: 0, hasFlour: true },
  { name: "분짜", emoji: "🍜", category: "동남아", priceRange: [10000, 14000], moods: ["평범", "신남"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "하노이식 숯불 쌀국수", calories: 420, spicy: 0 },
  { name: "나시고렝", emoji: "🍳", category: "동남아", priceRange: [10000, 13000], moods: ["평범", "배고픔 폭발"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "인도네시아식 볶음밥", calories: 500, spicy: 1 },
  { name: "그린커리", emoji: "🍛", category: "동남아", priceRange: [11000, 15000], moods: ["평범", "피곤", "신남"], weathers: ["추움", "비옴", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "코코넛 향 가득한 태국 커리", calories: 450, spicy: 2 },
  { name: "망고밥", emoji: "🥭", category: "동남아", priceRange: [8000, 12000], moods: ["신남", "평범"], weathers: ["더움", "맑음"], meals: ["간식"], companions: ["혼밥", "2명"], description: "달콤한 망고와 찹쌀밥", calories: 350, spicy: 0 },
  { name: "월남쌈", emoji: "🥬", category: "동남아", priceRange: [10000, 14000], moods: ["평범", "피곤"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["2명", "3~4명"], description: "쌀 라이스페이퍼에 싸 먹는", calories: 280, spicy: 0 },

  // ── 카페 ──
  { name: "아메리카노", emoji: "☕", category: "카페", priceRange: [3000, 5000], moods: ["피곤", "평범"], weathers: ["맑음", "더움", "추움", "흐림"], meals: ["아침", "간식"], companions: ["혼밥", "2명"], description: "깔끔한 에스프레소 한 잔", calories: 10, spicy: 0 },
  { name: "카페라떼", emoji: "☕", category: "카페", priceRange: [4000, 6000], moods: ["피곤", "평범", "우울"], weathers: ["추움", "흐림", "비옴"], meals: ["아침", "간식"], companions: ["혼밥", "2명"], description: "부드러운 우유와 에스프레소", calories: 150, spicy: 0, hasDairy: true },
  { name: "빙수", emoji: "🍧", category: "카페", priceRange: [8000, 15000], moods: ["신남", "평범"], weathers: ["더움", "맑음"], meals: ["간식"], companions: ["2명", "3~4명"], description: "시원한 팥빙수", calories: 400, spicy: 0, hasDairy: true },
  { name: "케이크", emoji: "🍰", category: "카페", priceRange: [5000, 9000], moods: ["우울", "신남", "평범"], weathers: ["맑음", "흐림", "비옴"], meals: ["간식"], companions: ["혼밥", "2명"], description: "달콤한 조각 케이크", calories: 350, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "와플", emoji: "🧇", category: "카페", priceRange: [6000, 10000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["간식", "아침"], companions: ["혼밥", "2명"], description: "바삭한 와플에 생크림", calories: 400, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "크로플", emoji: "🥐", category: "카페", priceRange: [5000, 8000], moods: ["신남", "평범"], weathers: ["맑음", "흐림"], meals: ["간식", "아침"], companions: ["혼밥", "2명"], description: "크루아상 + 와플의 바삭함", calories: 350, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "스무디", emoji: "🥤", category: "카페", priceRange: [5000, 7000], moods: ["신남", "피곤", "평범"], weathers: ["더움", "맑음"], meals: ["간식"], companions: ["혼밥", "2명"], description: "과일 듬뿍 시원한 스무디", calories: 200, spicy: 0 },
  { name: "에이드", emoji: "🍹", category: "카페", priceRange: [4000, 6000], moods: ["신남", "평범"], weathers: ["더움", "맑음"], meals: ["간식"], companions: ["혼밥", "2명"], description: "톡 쏘는 레몬/자몽 에이드", calories: 150, spicy: 0 },
  { name: "마카롱", emoji: "🍪", category: "카페", priceRange: [2000, 4000], moods: ["우울", "신남", "평범"], weathers: ["맑음", "흐림"], meals: ["간식"], companions: ["혼밥", "2명"], description: "알록달록 달콤한 마카롱", calories: 100, spicy: 0, hasDairy: true },
  { name: "토스트", emoji: "🍞", category: "카페", priceRange: [3000, 6000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "간식"], companions: ["혼밥"], description: "간단한 아침 토스트", calories: 300, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "핫초코", emoji: "🍫", category: "카페", priceRange: [4000, 6000], moods: ["우울", "피곤"], weathers: ["추움", "눈옴", "비옴"], meals: ["간식"], companions: ["혼밥", "2명"], description: "달콤한 핫초코 한 잔", calories: 250, spicy: 0, hasDairy: true },
  { name: "샌드위치", emoji: "🥪", category: "카페", priceRange: [5000, 8000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["아침", "점심", "간식"], companions: ["혼밥", "2명"], description: "가볍고 든든한 카페 샌드위치", calories: 350, spicy: 0, hasFlour: true },
  { name: "아이스크림", emoji: "🍦", category: "카페", priceRange: [3000, 6000], moods: ["신남", "우울", "평범"], weathers: ["더움", "맑음"], meals: ["간식"], companions: ["혼밥", "2명"], description: "달콤한 아이스크림 한 스쿱", calories: 200, spicy: 0, hasDairy: true },

  // ── 추가 한식/기타 ──
  { name: "불닭볶음면", emoji: "🔥", category: "분식", priceRange: [2000, 4000], moods: ["스트레스", "배고픔 폭발"], weathers: ["추움", "비옴"], meals: ["야식"], companions: ["혼밥"], description: "불타는 맛의 라면", calories: 530, spicy: 3, hasFlour: true },
  { name: "떡만두국", emoji: "🍲", category: "한식", priceRange: [7000, 10000], moods: ["평범", "피곤", "우울"], weathers: ["추움", "눈옴", "비옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "쫄깃한 떡과 만두의 조합", calories: 400, spicy: 0, hasFlour: true },
  { name: "닭꼬치", emoji: "🍢", category: "한식", priceRange: [3000, 5000], moods: ["평범", "신남"], weathers: ["맑음", "추움", "흐림"], meals: ["간식", "야식"], companions: ["혼밥", "2명"], description: "달콤 짭짤한 닭꼬치", calories: 250, spicy: 0 },
  { name: "생선구이 정식", emoji: "🐟", category: "한식", priceRange: [10000, 14000], moods: ["평범", "피곤"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "구수한 생선구이 백반", calories: 400, spicy: 0 },
  { name: "참치회", emoji: "🐟", category: "일식", priceRange: [15000, 30000], moods: ["신남", "평범"], weathers: ["맑음", "더움"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "입에서 살살 녹는 참치", calories: 220, spicy: 0, isRaw: true },
  { name: "해물찜", emoji: "🦀", category: "한식", priceRange: [20000, 40000], moods: ["신남", "배고픔 폭발"], weathers: ["추움", "맑음"], meals: ["저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "각종 해산물의 매콤한 찜", calories: 400, spicy: 2 },
  { name: "주꾸미볶음", emoji: "🐙", category: "한식", priceRange: [12000, 16000], moods: ["스트레스", "배고픔 폭발"], weathers: ["맑음", "추움"], meals: ["점심", "저녁"], companions: ["2명", "3~4명"], description: "불맛 가득 매콤한 주꾸미", calories: 350, spicy: 3 },
  { name: "황태해장국", emoji: "🍲", category: "한식", priceRange: [8000, 11000], moods: ["피곤", "우울"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "시원한 황태 국물 해장", calories: 300, spicy: 0 },
  { name: "곱창전골", emoji: "🫕", category: "한식", priceRange: [20000, 35000], moods: ["신남", "배고픔 폭발"], weathers: ["추움", "비옴"], meals: ["저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "곱창과 각종 재료의 전골", calories: 500, spicy: 1 },
  { name: "물회", emoji: "🐟", category: "한식", priceRange: [12000, 18000], moods: ["신남", "평범"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "시원한 여름 보양식 물회", calories: 300, spicy: 1, isRaw: true },
  { name: "막국수", emoji: "🍜", category: "한식", priceRange: [8000, 11000], moods: ["평범", "신남"], weathers: ["더움", "맑음"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "시원한 메밀 막국수", calories: 380, spicy: 1 },
  { name: "한정식", emoji: "🍽️", category: "한식", priceRange: [20000, 50000], moods: ["신남", "평범"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["2명", "3~4명", "5명 이상"], description: "다양한 반찬이 가득한 한상", calories: 600, spicy: 0 },
  { name: "아구찜", emoji: "🐟", category: "한식", priceRange: [20000, 35000], moods: ["신남", "배고픔 폭발"], weathers: ["추움", "맑음"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "매콤한 아귀와 콩나물", calories: 380, spicy: 3 },
  { name: "장어구이", emoji: "🐟", category: "한식", priceRange: [25000, 45000], moods: ["피곤", "신남"], weathers: ["더움", "추움"], meals: ["저녁"], companions: ["2명", "3~4명"], description: "고소한 장어 보양식", calories: 450, spicy: 0 },
  { name: "백반", emoji: "🍚", category: "한식", priceRange: [7000, 10000], moods: ["평범", "피곤"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "집밥 느낌의 정갈한 백반", calories: 500, spicy: 0 },
  { name: "돼지국밥", emoji: "🍲", category: "한식", priceRange: [8000, 10000], moods: ["피곤", "배고픔 폭발", "우울"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심", "저녁"], companions: ["혼밥", "2명"], description: "부산식 돼지국밥 한 그릇", calories: 500, spicy: 0 },
  { name: "비빔국수", emoji: "🍜", category: "한식", priceRange: [6000, 9000], moods: ["평범", "스트레스"], weathers: ["더움", "맑음"], meals: ["점심", "간식"], companions: ["혼밥", "2명"], description: "매콤새콤한 비빔국수", calories: 380, spicy: 2, hasFlour: true },
  { name: "덮밥", emoji: "🍚", category: "한식", priceRange: [7000, 10000], moods: ["평범", "배고픔 폭발", "피곤"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "알차게 올린 한 그릇 덮밥", calories: 500, spicy: 0 },
  { name: "전복죽", emoji: "🥣", category: "한식", priceRange: [10000, 15000], moods: ["피곤", "우울"], weathers: ["추움", "비옴", "눈옴"], meals: ["아침", "점심"], companions: ["혼밥", "2명"], description: "영양가 높은 부드러운 전복죽", calories: 300, spicy: 0 },
  { name: "치즈돈까스", emoji: "🧀", category: "일식", priceRange: [11000, 14000], moods: ["배고픔 폭발", "신남"], weathers: ["맑음", "추움", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "치즈가 쭈욱 늘어나는", calories: 750, spicy: 0, hasFlour: true, hasDairy: true },
  { name: "치킨마요덮밥", emoji: "🍚", category: "패스트푸드", priceRange: [5000, 8000], moods: ["평범", "배고픔 폭발", "피곤"], weathers: ["맑음", "흐림"], meals: ["점심", "저녁"], companions: ["혼밥", "2명"], description: "간편하고 든든한 치킨마요", calories: 600, spicy: 0 },
];

/* ══════════════════════════════════════════
   Recommendation Reasons
   ══════════════════════════════════════════ */

const MOOD_REASONS: Record<Mood, string[]> = {
  "평범": ["평범한 하루에 딱 어울리는 편안한 메뉴예요.", "부담 없이 즐기기 좋은 메뉴!"],
  "우울": ["기분이 안 좋을 땐 따뜻한 음식이 위로가 돼요.", "마음을 달래줄 comfort food!"],
  "신남": ["신나는 기분에 어울리는 특별한 메뉴!", "오늘 같은 날은 맛있는 걸 먹어야죠!"],
  "피곤": ["피곤한 몸에 영양 보충! 힘을 낼 수 있는 메뉴예요.", "에너지 충전에 딱 좋은 선택!"],
  "스트레스": ["스트레스 날려버릴 자극적인 맛!", "맛있는 음식으로 스트레스 해소!"],
  "배고픔 폭발": ["배고플 땐 든든하게! 양 걱정 없는 메뉴예요.", "폭발하는 식욕을 잠재울 든든한 한 끼!"],
};

const WEATHER_REASONS: Record<Weather, string[]> = {
  "맑음": ["화창한 날씨에 잘 어울리는 메뉴!", "맑은 날 기분 좋게 먹기 딱 좋아요."],
  "더움": ["더운 날 시원하게 즐길 수 있는 메뉴!", "무더위를 이겨낼 수 있는 선택!"],
  "추움": ["추운 날에는 뜨끈한 게 최고! 몸을 녹여줄 메뉴.", "한기를 날려줄 따뜻한 음식!"],
  "비옴": ["비 오는 날에 딱 어울리는 메뉴!", "빗소리 들으며 먹으면 더 맛있어요."],
  "눈옴": ["눈 오는 날 따뜻하게 즐기기 좋은 메뉴!", "설경 보며 먹으면 분위기 최고!"],
  "흐림": ["흐린 날 기분 UP 시켜줄 메뉴!", "날씨는 흐려도 맛은 맑음!"],
};

const COMPANION_REASONS: Record<Companion, string[]> = {
  "혼밥": ["혼자 편하게 즐기기에 딱 좋은 메뉴!", "나만의 식사 시간에 안성맞춤!"],
  "2명": ["둘이 나눠 먹기에 딱 좋은 양이에요!", "함께 먹으면 더 맛있는 메뉴!"],
  "3~4명": ["여럿이 함께 나눠 먹기 좋은 메뉴!", "모임에서 인기 만점!"],
  "5명 이상": ["단체로 즐기기에 제격인 메뉴!", "대인원 모임에 추천!"],
};

/* ══════════════════════════════════════════
   Scoring & Recommendation Logic
   ══════════════════════════════════════════ */

function scoreFood(
  food: FoodItem,
  mood: Mood,
  weather: Weather,
  meal: MealType,
  companion: Companion,
  budget: Budget,
  cuisines: Cuisine[],
  exclusions: Exclusion[],
): number {
  let score = 0;

  // Exclusion filters (hard exclude)
  if (exclusions.includes("매운음식") && food.spicy >= 2) return -1;
  if (exclusions.includes("날것") && food.isRaw) return -1;
  if (exclusions.includes("밀가루") && food.hasFlour) return -1;
  if (exclusions.includes("유제품") && food.hasDairy) return -1;

  // Budget filter
  const maxBudget = BUDGET_MAX[budget];
  if (food.priceRange[0] > maxBudget) return -1;

  // Cuisine preference
  if (cuisines.length > 0 && !cuisines.includes(food.category)) return -1;

  // Mood match
  if (food.moods.includes(mood)) score += 30;

  // Weather match
  if (food.weathers.includes(weather)) score += 25;

  // Meal type match
  if (food.meals.includes(meal)) score += 20;

  // Companion match
  if (food.companions.includes(companion)) score += 15;

  // Budget sweet spot (prefer foods in range)
  if (food.priceRange[1] <= maxBudget) score += 10;

  // Random factor for variety
  score += Math.random() * 15;

  return score;
}

function generateReason(food: FoodItem, mood: Mood, weather: Weather, companion: Companion): string {
  const parts: string[] = [];

  const moodReasons = MOOD_REASONS[mood];
  parts.push(moodReasons[Math.floor(Math.random() * moodReasons.length)]);

  if (food.weathers.includes(weather)) {
    const weatherReasons = WEATHER_REASONS[weather];
    parts.push(weatherReasons[Math.floor(Math.random() * weatherReasons.length)]);
  }

  if (food.companions.includes(companion)) {
    const compReasons = COMPANION_REASONS[companion];
    parts.push(compReasons[Math.floor(Math.random() * compReasons.length)]);
  }

  return parts.slice(0, 2).join(" ");
}

function formatPrice(range: [number, number]): string {
  const fmt = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}만원`;
    return `${(n / 1000).toFixed(0)}천원`;
  };
  return `${fmt(range[0])} ~ ${fmt(range[1])}`;
}

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */

export default function FoodRecommendationPage() {
  const [mood, setMood] = useState<Mood>("평범");
  const [weather, setWeather] = useState<Weather>("맑음");
  const [meal, setMeal] = useState<MealType>("점심");
  const [companion, setCompanion] = useState<Companion>("혼밥");
  const [budget, setBudget] = useState<Budget>("~1만원");
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>(["없음"]);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<FoodItem | null>(null);
  const [slotAnim, setSlotAnim] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const toggleCuisine = useCallback((c: Cuisine) => {
    setCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }, []);

  const toggleExclusion = useCallback((e: Exclusion) => {
    if (e === "없음") {
      setExclusions(["없음"]);
    } else {
      setExclusions((prev) => {
        const next = prev.filter((x) => x !== "없음");
        return next.includes(e) ? next.filter((x) => x !== e) : [...next, e];
      });
    }
  }, []);

  const getRecommendations = useCallback(() => {
    const realExclusions = exclusions.filter((e) => e !== "없음");

    const scored = FOODS.map((food) => ({
      food,
      score: scoreFood(food, mood, weather, meal, companion, budget, cuisines, realExclusions),
      reason: "",
    }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => ({
        ...r,
        reason: generateReason(r.food, mood, weather, companion),
      }));

    return scored;
  }, [mood, weather, meal, companion, budget, cuisines, exclusions]);

  const handleRecommend = useCallback(() => {
    setSlotAnim(true);
    setShowResult(false);
    setRouletteResult(null);

    setTimeout(() => {
      const recs = getRecommendations();
      setResults(recs);
      setShowResult(true);
      setSlotAnim(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 800);
  }, [getRecommendations]);

  const handleRoulette = useCallback(() => {
    const realExclusions = exclusions.filter((e) => e !== "없음");

    const eligible = FOODS.filter(
      (food) => scoreFood(food, mood, weather, meal, companion, budget, cuisines, realExclusions) > 0,
    );

    if (eligible.length === 0) {
      alert("조건에 맞는 메뉴가 없어요! 조건을 조금 넓혀보세요.");
      return;
    }

    setSpinning(true);
    setShowResult(false);
    setRouletteResult(null);

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const random = eligible[Math.floor(Math.random() * eligible.length)];
      setRouletteResult(random);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        setSpinning(false);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }, 100);
  }, [mood, weather, meal, companion, budget, cuisines, exclusions]);

  // Auto-detect time-of-day for meal
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setMeal("아침");
    else if (hour >= 10 && hour < 14) setMeal("점심");
    else if (hour >= 14 && hour < 17) setMeal("간식");
    else if (hour >= 17 && hour < 21) setMeal("저녁");
    else setMeal("야식");
  }, []);

  const spicyIndicator = (level: number) => {
    if (level === 0) return "🫧 안 매움";
    if (level === 1) return "🌶️ 약간 매움";
    if (level === 2) return "🌶️🌶️ 매움";
    return "🌶️🌶️🌶️ 매우 매움";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🍽️</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          오늘 뭐 먹지?
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          기분, 날씨, 상황을 알려주면 딱 맞는 메뉴를 추천해 드려요!
        </p>
      </div>

      <div className="calc-card p-5 sm:p-6 space-y-6">
        {/* 기분 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            지금 기분이 어때요?
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  mood === m.value
                    ? "bg-orange-100 text-orange-700 ring-2 ring-orange-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg block mb-0.5">{m.emoji}</span>
                {m.value}
              </button>
            ))}
          </div>
        </div>

        {/* 날씨 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            오늘 날씨는?
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {WEATHERS.map((w) => (
              <button
                key={w.value}
                onClick={() => setWeather(w.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  weather === w.value
                    ? "bg-sky-100 text-sky-700 ring-2 ring-sky-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg block mb-0.5">{w.emoji}</span>
                {w.value}
              </button>
            ))}
          </div>
        </div>

        {/* 식사 종류 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            어떤 끼니인가요?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {MEALS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMeal(m.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  meal === m.value
                    ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg block mb-0.5">{m.emoji}</span>
                {m.value}
              </button>
            ))}
          </div>
        </div>

        {/* 인원 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            몇 명이서 먹어요?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {COMPANIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCompanion(c.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  companion === c.value
                    ? "bg-violet-100 text-violet-700 ring-2 ring-violet-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg block mb-0.5">{c.emoji}</span>
                {c.value}
              </button>
            ))}
          </div>
        </div>

        {/* 예산 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1인 예산은?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                onClick={() => setBudget(b.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  budget === b.value
                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg block mb-0.5">{b.emoji}</span>
                {b.value}
              </button>
            ))}
          </div>
        </div>

        {/* 선호 카테고리 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            선호 카테고리 <span className="text-gray-400 font-normal">(다중선택, 미선택시 전체)</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {CUISINES.map((c) => (
              <button
                key={c.value}
                onClick={() => toggleCuisine(c.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  cuisines.includes(c.value)
                    ? "bg-rose-100 text-rose-700 ring-2 ring-rose-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base block mb-0.5">{c.emoji}</span>
                {c.value}
              </button>
            ))}
          </div>
        </div>

        {/* 제외 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            제외할 것 <span className="text-gray-400 font-normal">(다중선택)</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {EXCLUSIONS.map((e) => (
              <button
                key={e.value}
                onClick={() => toggleExclusion(e.value)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  exclusions.includes(e.value)
                    ? "bg-red-100 text-red-700 ring-2 ring-red-400 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base block mb-0.5">{e.emoji}</span>
                {e.value}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleRecommend}
            disabled={slotAnim}
            className="flex-1 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
          >
            {slotAnim ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-bounce">🎰</span> 추천 중...
              </span>
            ) : (
              "🍽️ 메뉴 추천받기"
            )}
          </button>
          <button
            onClick={handleRoulette}
            disabled={spinning}
            className="py-3.5 px-5 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 active:scale-[0.98] transition-all shadow-lg shadow-purple-200 disabled:opacity-60"
          >
            {spinning ? (
              <span className="animate-spin inline-block">🎡</span>
            ) : (
              "🎡 룰렛"
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div ref={resultRef}>
        {/* Slot Machine / Top 3 Recommendations */}
        {showResult && results.length > 0 && (
          <div className="mt-8 space-y-4 animate-fade-in">
            {/* Hero pick */}
            <div className="calc-card p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <p className="text-sm text-orange-600 font-semibold mb-2">
                오늘은 이거 어때요?
              </p>
              <div className="text-6xl mb-3">{results[0].food.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {results[0].food.name}
              </h2>
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                {results[0].food.category}
              </span>
              <p className="text-gray-500 text-sm">{results[0].food.description}</p>
            </div>

            {/* Top 3 detail cards */}
            <div className="space-y-3">
              {results.map((rec, idx) => (
                <div
                  key={rec.food.name}
                  className="calc-card p-4 sm:p-5"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{rec.food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {idx === 0 && "🥇 "}
                          {idx === 1 && "🥈 "}
                          {idx === 2 && "🥉 "}
                          {rec.food.name}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {rec.food.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                        <span>{formatPrice(rec.food.priceRange)}</span>
                        <span>~{rec.food.calories}kcal</span>
                        <span>{spicyIndicator(rec.food.spicy)}</span>
                      </div>
                      <p className="text-sm text-gray-600 bg-orange-50 rounded-lg p-2.5">
                        💡 {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRecommend}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              🔄 다시 추천받기
            </button>
          </div>
        )}

        {showResult && results.length === 0 && (
          <div className="mt-8 calc-card p-8 text-center">
            <div className="text-5xl mb-3">😢</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              조건에 맞는 메뉴가 없어요!
            </h2>
            <p className="text-gray-500 text-sm">
              선호 카테고리나 제외 조건을 조금 넓혀보세요.
            </p>
          </div>
        )}

        {/* Roulette result */}
        {!spinning && rouletteResult && !showResult && (
          <div className="mt-8 animate-fade-in">
            <div className="calc-card p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <p className="text-sm text-purple-600 font-semibold mb-2">
                🎡 룰렛 결과!
              </p>
              <div className="text-7xl mb-3">{rouletteResult.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {rouletteResult.name}
              </h2>
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                {rouletteResult.category}
              </span>
              <p className="text-gray-500 text-sm mb-3">
                {rouletteResult.description}
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>{formatPrice(rouletteResult.priceRange)}</span>
                <span>~{rouletteResult.calories}kcal</span>
                <span>{spicyIndicator(rouletteResult.spicy)}</span>
              </div>
            </div>
            <button
              onClick={handleRoulette}
              className="w-full mt-3 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              🎡 다시 돌리기
            </button>
          </div>
        )}

        {/* Roulette spinning display */}
        {spinning && rouletteResult && (
          <div className="mt-8">
            <div className="calc-card p-6 text-center">
              <p className="text-sm text-purple-600 font-semibold mb-2">
                🎡 룰렛 돌리는 중...
              </p>
              <div className="text-7xl mb-3 animate-bounce">
                {rouletteResult.emoji}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {rouletteResult.name}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="mt-10 calc-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          🤔 이 도구는 어떻게 추천하나요?
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            150개 이상의 메뉴 데이터베이스에서 입력한 기분, 날씨, 식사 종류, 인원, 예산, 선호 카테고리를 종합적으로 분석하여 최적의 메뉴를 추천합니다.
          </p>
          <p>
            같은 조건이라도 매번 다른 결과가 나올 수 있어요. 마음에 드는 메뉴가 나올 때까지 다시 추천받아 보세요!
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
            <li>기분에 맞는 comfort food 매칭</li>
            <li>날씨에 따른 온도감 있는 메뉴 추천</li>
            <li>인원수에 따른 메뉴 적합도 분석</li>
            <li>예산 범위 내 최적의 선택</li>
            <li>알레르기/선호도 제외 필터</li>
          </ul>
        </div>
      </div>

      <RelatedTools current="food-recommendation" />
    </div>
  );
}
