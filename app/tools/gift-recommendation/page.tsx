"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ══════════════════════════════════════════
   Types & Constants
   ══════════════════════════════════════════ */

type Recipient = "연인" | "부모님" | "친구" | "직장동료" | "선생님" | "아이";
type Gender = "남" | "여" | "무관";
type AgeGroup = "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
type Occasion =
  | "생일"
  | "크리스마스"
  | "기념일"
  | "졸업"
  | "승진"
  | "감사"
  | "명절"
  | "집들이"
  | "출산"
  | "기타";
type Budget =
  | "~1만원"
  | "~3만원"
  | "~5만원"
  | "~10만원"
  | "~30만원"
  | "30만원 이상";
type Interest =
  | "패션"
  | "뷰티"
  | "테크"
  | "운동"
  | "독서"
  | "요리"
  | "여행"
  | "음악"
  | "게임"
  | "인테리어";

const RECIPIENTS: Recipient[] = [
  "연인",
  "부모님",
  "친구",
  "직장동료",
  "선생님",
  "아이",
];
const GENDERS: Gender[] = ["남", "여", "무관"];
const AGE_GROUPS: AgeGroup[] = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대 이상",
];
const OCCASIONS: Occasion[] = [
  "생일",
  "크리스마스",
  "기념일",
  "졸업",
  "승진",
  "감사",
  "명절",
  "집들이",
  "출산",
  "기타",
];
const BUDGETS: Budget[] = [
  "~1만원",
  "~3만원",
  "~5만원",
  "~10만원",
  "~30만원",
  "30만원 이상",
];
const INTERESTS: Interest[] = [
  "패션",
  "뷰티",
  "테크",
  "운동",
  "독서",
  "요리",
  "여행",
  "음악",
  "게임",
  "인테리어",
];

const BUDGET_RANGE: Record<Budget, [number, number]> = {
  "~1만원": [0, 10000],
  "~3만원": [0, 30000],
  "~5만원": [0, 50000],
  "~10만원": [0, 100000],
  "~30만원": [0, 300000],
  "30만원 이상": [300000, 9999999],
};

interface Gift {
  name: string;
  emoji: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  recipients: Partial<Record<Recipient, number>>;
  occasions: Partial<Record<Occasion, number>>;
  interests: Partial<Record<Interest, number>>;
  genders: Partial<Record<Gender, number>>;
  ages: Partial<Record<AgeGroup, number>>;
  description: string;
  reason: string;
}

/* ══════════════════════════════════════════
   Gift Database (150+ items)
   ══════════════════════════════════════════ */

const GIFTS: Gift[] = [
  // ── 패션/뷰티 (25) ──
  {
    name: "브랜드 향수",
    emoji: "🧴",
    category: "패션/뷰티",
    minPrice: 30000,
    maxPrice: 200000,
    recipients: { 연인: 10, 친구: 7, 부모님: 5, 직장동료: 4 },
    occasions: { 생일: 9, 크리스마스: 9, 기념일: 10, 졸업: 5 },
    interests: { 뷰티: 10, 패션: 8 },
    genders: { 여: 9, 남: 7, 무관: 8 },
    ages: { "20대": 10, "30대": 9, "40대": 7, "50대": 5, "10대": 4, "60대 이상": 3 },
    description: "취향에 맞는 브랜드 향수",
    reason: "개인의 분위기를 완성하는 특별한 선물",
  },
  {
    name: "화장품 세트",
    emoji: "💄",
    category: "패션/뷰티",
    minPrice: 20000,
    maxPrice: 150000,
    recipients: { 연인: 9, 친구: 8, 부모님: 7, 직장동료: 5, 선생님: 4 },
    occasions: { 생일: 9, 크리스마스: 9, 감사: 7, 기념일: 6 },
    interests: { 뷰티: 10, 패션: 6 },
    genders: { 여: 10, 남: 2, 무관: 6 },
    ages: { "20대": 10, "30대": 9, "40대": 8, "50대": 7, "10대": 5, "60대 이상": 4 },
    description: "스킨케어 또는 메이크업 세트",
    reason: "실용적이면서도 럭셔리한 느낌을 줄 수 있는 선물",
  },
  {
    name: "가죽 지갑",
    emoji: "👛",
    category: "패션/뷰티",
    minPrice: 30000,
    maxPrice: 300000,
    recipients: { 연인: 9, 부모님: 9, 친구: 6, 직장동료: 5, 선생님: 5 },
    occasions: { 생일: 9, 기념일: 8, 크리스마스: 7, 졸업: 7, 승진: 6 },
    interests: { 패션: 9 },
    genders: { 남: 9, 여: 8, 무관: 9 },
    ages: { "20대": 8, "30대": 9, "40대": 9, "50대": 8, "60대 이상": 7, "10대": 4 },
    description: "고급 가죽 소재의 반지갑 또는 장지갑",
    reason: "매일 사용하는 실용적인 아이템으로 오래 기억에 남는 선물",
  },
  {
    name: "머플러/스카프",
    emoji: "🧣",
    category: "패션/뷰티",
    minPrice: 15000,
    maxPrice: 100000,
    recipients: { 연인: 9, 부모님: 8, 친구: 7, 직장동료: 4, 선생님: 5 },
    occasions: { 크리스마스: 10, 생일: 6, 기념일: 7, 감사: 5 },
    interests: { 패션: 9 },
    genders: { 여: 9, 남: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 6, "10대": 6 },
    description: "따뜻하고 스타일리시한 머플러",
    reason: "겨울철 따뜻함과 패션을 동시에 선물할 수 있는 아이템",
  },
  {
    name: "손목시계",
    emoji: "⌚",
    category: "패션/뷰티",
    minPrice: 50000,
    maxPrice: 500000,
    recipients: { 연인: 10, 부모님: 7, 친구: 5, 직장동료: 4 },
    occasions: { 기념일: 10, 생일: 9, 졸업: 8, 승진: 8, 크리스마스: 7 },
    interests: { 패션: 10 },
    genders: { 남: 9, 여: 8, 무관: 9 },
    ages: { "20대": 9, "30대": 10, "40대": 8, "50대": 7, "60대 이상": 5, "10대": 4 },
    description: "클래식하거나 모던한 디자인의 시계",
    reason: "특별한 날을 기념하는 의미 있는 선물",
  },
  {
    name: "선글라스",
    emoji: "🕶️",
    category: "패션/뷰티",
    minPrice: 20000,
    maxPrice: 200000,
    recipients: { 연인: 8, 친구: 7, 부모님: 5 },
    occasions: { 생일: 8, 크리스마스: 6, 기념일: 6 },
    interests: { 패션: 9, 여행: 7 },
    genders: { 남: 8, 여: 9, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "10대": 6, "60대 이상": 3 },
    description: "UV 차단 기능의 스타일리시한 선글라스",
    reason: "외출 시 실용적이면서 패션 포인트가 되는 아이템",
  },
  {
    name: "핸드크림 세트",
    emoji: "🤲",
    category: "패션/뷰티",
    minPrice: 8000,
    maxPrice: 30000,
    recipients: { 친구: 8, 직장동료: 9, 선생님: 8, 연인: 5, 부모님: 6 },
    occasions: { 크리스마스: 9, 감사: 9, 생일: 6, 명절: 5 },
    interests: { 뷰티: 9 },
    genders: { 여: 10, 남: 3, 무관: 6 },
    ages: { "20대": 9, "30대": 9, "40대": 8, "50대": 7, "10대": 5, "60대 이상": 5 },
    description: "보습력 좋은 핸드크림 기프트 세트",
    reason: "부담 없는 가격에 센스 있는 선물",
  },
  {
    name: "립스틱/립밤 세트",
    emoji: "💋",
    category: "패션/뷰티",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 연인: 8, 친구: 8, 직장동료: 5 },
    occasions: { 생일: 8, 크리스마스: 8, 기념일: 6 },
    interests: { 뷰티: 10, 패션: 6 },
    genders: { 여: 10, 남: 1, 무관: 5 },
    ages: { "20대": 10, "30대": 9, "40대": 7, "50대": 5, "10대": 6, "60대 이상": 3 },
    description: "인기 브랜드 립 제품 세트",
    reason: "여성에게 실패 없는 뷰티 선물",
  },
  {
    name: "넥타이/타이핀",
    emoji: "👔",
    category: "패션/뷰티",
    minPrice: 15000,
    maxPrice: 80000,
    recipients: { 부모님: 8, 직장동료: 7, 연인: 6, 선생님: 6 },
    occasions: { 승진: 9, 감사: 8, 생일: 6, 명절: 7 },
    interests: { 패션: 8 },
    genders: { 남: 10, 여: 1, 무관: 5 },
    ages: { "30대": 9, "40대": 10, "50대": 9, "60대 이상": 7, "20대": 5, "10대": 1 },
    description: "격식 있는 자리에 어울리는 넥타이 세트",
    reason: "직장인에게 실용적이고 품격 있는 선물",
  },
  {
    name: "모자/캡",
    emoji: "🧢",
    category: "패션/뷰티",
    minPrice: 15000,
    maxPrice: 60000,
    recipients: { 친구: 8, 연인: 7, 아이: 7 },
    occasions: { 생일: 7, 크리스마스: 6, 기타: 6 },
    interests: { 패션: 8, 운동: 7 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "10대": 9, "20대": 9, "30대": 7, "40대": 5, "50대": 4, "60대 이상": 3 },
    description: "트렌디한 브랜드 캡 또는 비니",
    reason: "일상에서 자주 착용할 수 있는 패션 아이템",
  },
  {
    name: "벨트",
    emoji: "🪢",
    category: "패션/뷰티",
    minPrice: 20000,
    maxPrice: 150000,
    recipients: { 부모님: 8, 연인: 7, 직장동료: 5 },
    occasions: { 생일: 7, 명절: 7, 승진: 6 },
    interests: { 패션: 8 },
    genders: { 남: 9, 여: 5, 무관: 7 },
    ages: { "30대": 9, "40대": 9, "50대": 8, "20대": 7, "60대 이상": 6, "10대": 3 },
    description: "고급 가죽 벨트",
    reason: "매일 사용하는 실용적인 패션 필수템",
  },
  {
    name: "키링/가방 참",
    emoji: "🔑",
    category: "패션/뷰티",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 친구: 9, 연인: 7, 직장동료: 6, 아이: 6 },
    occasions: { 생일: 7, 크리스마스: 7, 감사: 6, 기타: 7 },
    interests: { 패션: 7 },
    genders: { 여: 8, 남: 5, 무관: 7 },
    ages: { "10대": 9, "20대": 9, "30대": 7, "40대": 4, "50대": 3, "60대 이상": 2 },
    description: "귀여운 디자인의 키링이나 가방 참",
    reason: "부담 없는 가격에 센스를 보여줄 수 있는 선물",
  },
  {
    name: "양말 선물세트",
    emoji: "🧦",
    category: "패션/뷰티",
    minPrice: 5000,
    maxPrice: 20000,
    recipients: { 친구: 8, 직장동료: 8, 아이: 7, 부모님: 5 },
    occasions: { 크리스마스: 9, 감사: 7, 생일: 5, 기타: 6 },
    interests: { 패션: 5 },
    genders: { 남: 7, 여: 7, 무관: 8 },
    ages: { "10대": 7, "20대": 8, "30대": 7, "40대": 6, "50대": 5, "60대 이상": 4 },
    description: "디자인이 예쁜 양말 기프트 세트",
    reason: "가볍지만 센스 있는 소소한 선물",
  },
  {
    name: "파우치/미니백",
    emoji: "👝",
    category: "패션/뷰티",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 8, 연인: 7, 직장동료: 6 },
    occasions: { 생일: 7, 크리스마스: 7, 감사: 6 },
    interests: { 패션: 8, 뷰티: 7, 여행: 6 },
    genders: { 여: 10, 남: 3, 무관: 6 },
    ages: { "20대": 9, "30대": 8, "40대": 6, "10대": 7, "50대": 4, "60대 이상": 3 },
    description: "실용적인 파우치 또는 미니백",
    reason: "화장품이나 소지품 정리에 딱 맞는 실용템",
  },
  {
    name: "헤어 액세서리",
    emoji: "🎀",
    category: "패션/뷰티",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 연인: 7, 친구: 8, 아이: 8 },
    occasions: { 생일: 7, 크리스마스: 7, 기타: 6 },
    interests: { 패션: 8, 뷰티: 7 },
    genders: { 여: 10, 남: 1, 무관: 5 },
    ages: { "10대": 9, "20대": 9, "30대": 7, "40대": 5, "50대": 3, "60대 이상": 2 },
    description: "예쁜 헤어핀, 헤어밴드, 슈슈 세트",
    reason: "소소하지만 매일 쓸 수 있는 센스 있는 선물",
  },

  // ── 테크 (25) ──
  {
    name: "에어팟/무선이어폰",
    emoji: "🎧",
    category: "테크",
    minPrice: 50000,
    maxPrice: 300000,
    recipients: { 연인: 10, 친구: 8, 아이: 6, 부모님: 5 },
    occasions: { 생일: 10, 크리스마스: 10, 기념일: 8, 졸업: 7 },
    interests: { 테크: 10, 음악: 10, 게임: 7 },
    genders: { 남: 9, 여: 9, 무관: 9 },
    ages: { "10대": 9, "20대": 10, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3 },
    description: "노이즈캔슬링 무선 이어폰",
    reason: "일상에서 가장 많이 사용하는 실용적인 테크 선물",
  },
  {
    name: "보조배터리",
    emoji: "🔋",
    category: "테크",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 친구: 8, 직장동료: 7, 연인: 6, 부모님: 6 },
    occasions: { 생일: 7, 크리스마스: 7, 감사: 6, 기타: 7 },
    interests: { 테크: 8, 여행: 7 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 8, "40대": 7, "50대": 6, "10대": 7, "60대 이상": 4 },
    description: "대용량 고속충전 보조배터리",
    reason: "누구나 필요한 실용적인 테크 필수템",
  },
  {
    name: "스마트워치",
    emoji: "⌚",
    category: "테크",
    minPrice: 100000,
    maxPrice: 500000,
    recipients: { 연인: 10, 부모님: 7, 친구: 6 },
    occasions: { 기념일: 10, 생일: 9, 졸업: 7, 승진: 7, 크리스마스: 8 },
    interests: { 테크: 10, 운동: 9 },
    genders: { 남: 9, 여: 8, 무관: 9 },
    ages: { "20대": 9, "30대": 10, "40대": 8, "50대": 6, "10대": 6, "60대 이상": 4 },
    description: "건강관리 기능이 있는 스마트워치",
    reason: "건강관리와 스마트 라이프를 동시에 선물",
  },
  {
    name: "블루투스 스피커",
    emoji: "🔊",
    category: "테크",
    minPrice: 20000,
    maxPrice: 150000,
    recipients: { 친구: 8, 연인: 8, 직장동료: 5 },
    occasions: { 생일: 8, 크리스마스: 8, 집들이: 7, 졸업: 5 },
    interests: { 테크: 9, 음악: 10 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "10대": 7, "60대 이상": 3 },
    description: "고음질 무선 블루투스 스피커",
    reason: "음악을 좋아하는 분께 감성적인 선물",
  },
  {
    name: "태블릿 거치대",
    emoji: "📱",
    category: "테크",
    minPrice: 10000,
    maxPrice: 40000,
    recipients: { 친구: 7, 직장동료: 7, 부모님: 6, 연인: 5 },
    occasions: { 생일: 6, 감사: 6, 크리스마스: 6, 기타: 7 },
    interests: { 테크: 8 },
    genders: { 남: 7, 여: 7, 무관: 8 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 6, "10대": 6, "60대 이상": 5 },
    description: "각도 조절 가능한 태블릿/스마트폰 거치대",
    reason: "영상 시청이나 업무 시 편리하게 사용 가능",
  },
  {
    name: "무선 충전기",
    emoji: "⚡",
    category: "테크",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 친구: 7, 직장동료: 8, 연인: 6, 부모님: 5 },
    occasions: { 생일: 6, 크리스마스: 7, 감사: 6, 기타: 7 },
    interests: { 테크: 9 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "10대": 5, "60대 이상": 3 },
    description: "고속 무선 충전 패드",
    reason: "책상 위에 놓으면 편리한 실용 테크 아이템",
  },
  {
    name: "게이밍 마우스",
    emoji: "🖱️",
    category: "테크",
    minPrice: 20000,
    maxPrice: 100000,
    recipients: { 친구: 8, 연인: 6, 아이: 7 },
    occasions: { 생일: 8, 크리스마스: 8, 기타: 6 },
    interests: { 게임: 10, 테크: 8 },
    genders: { 남: 9, 여: 5, 무관: 7 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 5, "50대": 3, "60대 이상": 1 },
    description: "고성능 게이밍 또는 인체공학 마우스",
    reason: "게이머에게 실전에서 바로 쓸 수 있는 선물",
  },
  {
    name: "키보드",
    emoji: "⌨️",
    category: "테크",
    minPrice: 30000,
    maxPrice: 200000,
    recipients: { 친구: 7, 연인: 6, 직장동료: 5 },
    occasions: { 생일: 7, 크리스마스: 7, 기타: 6 },
    interests: { 게임: 9, 테크: 9 },
    genders: { 남: 9, 여: 5, 무관: 7 },
    ages: { "10대": 8, "20대": 10, "30대": 8, "40대": 5, "50대": 3, "60대 이상": 1 },
    description: "기계식 키보드 또는 무선 키보드",
    reason: "타이핑 감이 좋은 키보드는 업무와 게임 모두에 최고",
  },
  {
    name: "USB 메모리/외장SSD",
    emoji: "💾",
    category: "테크",
    minPrice: 10000,
    maxPrice: 100000,
    recipients: { 직장동료: 8, 친구: 6, 선생님: 5 },
    occasions: { 감사: 7, 졸업: 6, 승진: 5, 기타: 7 },
    interests: { 테크: 8 },
    genders: { 남: 7, 여: 6, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 6, "10대": 5, "60대 이상": 3 },
    description: "고용량 USB 메모리 또는 휴대용 SSD",
    reason: "데이터 관리에 실용적인 선물",
  },
  {
    name: "셀카봉/삼각대",
    emoji: "🤳",
    category: "테크",
    minPrice: 10000,
    maxPrice: 30000,
    recipients: { 친구: 8, 연인: 7, 아이: 5 },
    occasions: { 생일: 6, 크리스마스: 6, 기타: 7 },
    interests: { 여행: 9, 테크: 6 },
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "10대": 8, "20대": 9, "30대": 7, "40대": 5, "50대": 4, "60대 이상": 2 },
    description: "블루투스 리모컨 포함 셀카봉 삼각대",
    reason: "여행이나 일상에서 사진 찍기에 딱 맞는 아이템",
  },
  {
    name: "스마트 체중계",
    emoji: "⚖️",
    category: "테크",
    minPrice: 20000,
    maxPrice: 80000,
    recipients: { 친구: 6, 연인: 6, 부모님: 6 },
    occasions: { 생일: 5, 집들이: 7, 기타: 6 },
    interests: { 운동: 9, 테크: 7 },
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "20대": 8, "30대": 9, "40대": 8, "50대": 7, "60대 이상": 5, "10대": 4 },
    description: "체성분 분석 가능한 스마트 체중계",
    reason: "건강관리에 관심 있는 분께 실용적인 선물",
  },

  // ── 생활 (30) ──
  {
    name: "디퓨저",
    emoji: "🕯️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 8, 직장동료: 8, 연인: 7, 선생님: 7, 부모님: 6 },
    occasions: { 집들이: 10, 크리스마스: 8, 감사: 8, 생일: 7 },
    interests: { 인테리어: 9 },
    genders: { 여: 9, 남: 5, 무관: 7 },
    ages: { "20대": 9, "30대": 9, "40대": 8, "50대": 6, "60대 이상": 4, "10대": 4 },
    description: "고급 향 디퓨저 또는 캔들 세트",
    reason: "공간을 향기롭게 만들어주는 인테리어 선물",
  },
  {
    name: "텀블러",
    emoji: "🥤",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 직장동료: 9, 친구: 8, 선생님: 8, 부모님: 6, 연인: 5 },
    occasions: { 감사: 9, 크리스마스: 8, 생일: 6, 기타: 7 },
    interests: { 여행: 6 },
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 8, "50대": 7, "60대 이상": 5, "10대": 5 },
    description: "보온보냉 기능의 프리미엄 텀블러",
    reason: "친환경적이고 실용적인 데일리 아이템",
  },
  {
    name: "무드등/조명",
    emoji: "💡",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 연인: 9, 친구: 8, 아이: 7 },
    occasions: { 크리스마스: 9, 생일: 8, 집들이: 8, 기념일: 6 },
    interests: { 인테리어: 10 },
    genders: { 여: 9, 남: 6, 무관: 7 },
    ages: { "10대": 8, "20대": 9, "30대": 8, "40대": 5, "50대": 4, "60대 이상": 3 },
    description: "감성적인 LED 무드등",
    reason: "방 분위기를 바꿔주는 감성 인테리어 아이템",
  },
  {
    name: "담요/블랭킷",
    emoji: "🛏️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 부모님: 8, 친구: 7, 직장동료: 6, 연인: 6 },
    occasions: { 크리스마스: 9, 집들이: 7, 생일: 5, 감사: 6 },
    interests: { 인테리어: 6 },
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "20대": 7, "30대": 7, "40대": 7, "50대": 8, "60대 이상": 8, "10대": 5 },
    description: "부드럽고 따뜻한 극세사 담요",
    reason: "집에서 편안하게 쓸 수 있는 실용적인 선물",
  },
  {
    name: "안마기/마사지건",
    emoji: "💆",
    category: "생활",
    minPrice: 20000,
    maxPrice: 200000,
    recipients: { 부모님: 10, 직장동료: 7, 연인: 6, 선생님: 6 },
    occasions: { 명절: 10, 감사: 9, 생일: 7, 크리스마스: 6 },
    interests: { 운동: 7 },
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "40대": 9, "50대": 10, "60대 이상": 10, "30대": 7, "20대": 5, "10대": 2 },
    description: "목/어깨 안마기 또는 마사지건",
    reason: "피로를 풀어주는 효도 선물의 대명사",
  },
  {
    name: "쿠션/방석",
    emoji: "🛋️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 직장동료: 7, 친구: 6, 부모님: 6, 연인: 5 },
    occasions: { 집들이: 8, 승진: 5, 감사: 5, 기타: 6 },
    interests: { 인테리어: 7 },
    genders: { 여: 7, 남: 6, 무관: 7 },
    ages: { "20대": 7, "30대": 8, "40대": 8, "50대": 7, "60대 이상": 6, "10대": 4 },
    description: "메모리폼 방석 또는 예쁜 쿠션",
    reason: "사무실이나 집에서 편안하게 앉을 수 있는 실용템",
  },
  {
    name: "수건 선물세트",
    emoji: "🛁",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 직장동료: 7, 선생님: 7, 부모님: 7 },
    occasions: { 감사: 8, 집들이: 8, 명절: 7, 기타: 6 },
    interests: {},
    genders: { 남: 6, 여: 7, 무관: 7 },
    ages: { "30대": 7, "40대": 8, "50대": 8, "60대 이상": 7, "20대": 5, "10대": 3 },
    description: "고급 호텔 수건 선물세트",
    reason: "실용적이면서도 격식 있는 선물",
  },
  {
    name: "아로마 캔들",
    emoji: "🕯️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 8, 연인: 8, 직장동료: 6, 선생님: 6 },
    occasions: { 크리스마스: 9, 집들이: 9, 생일: 7, 감사: 7 },
    interests: { 인테리어: 9 },
    genders: { 여: 9, 남: 4, 무관: 7 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3, "10대": 4 },
    description: "천연 소이왁스 아로마 캔들",
    reason: "분위기 있는 공간 연출에 딱 맞는 선물",
  },
  {
    name: "가습기",
    emoji: "💨",
    category: "생활",
    minPrice: 15000,
    maxPrice: 80000,
    recipients: { 직장동료: 7, 친구: 6, 부모님: 7, 연인: 5 },
    occasions: { 크리스마스: 7, 집들이: 7, 기타: 6, 감사: 5 },
    interests: { 인테리어: 6, 테크: 5 },
    genders: { 여: 7, 남: 6, 무관: 7 },
    ages: { "20대": 7, "30대": 8, "40대": 8, "50대": 7, "60대 이상": 6, "10대": 4 },
    description: "미니 USB 가습기 또는 초음파 가습기",
    reason: "건조한 환경을 촉촉하게 만들어주는 실용 아이템",
  },
  {
    name: "미니 화분/다육이",
    emoji: "🪴",
    category: "생활",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 친구: 8, 직장동료: 8, 선생님: 7, 연인: 5 },
    occasions: { 집들이: 9, 감사: 8, 크리스마스: 6, 기타: 7 },
    interests: { 인테리어: 8 },
    genders: { 여: 8, 남: 5, 무관: 7 },
    ages: { "20대": 8, "30대": 9, "40대": 7, "50대": 6, "60대 이상": 5, "10대": 4 },
    description: "관리가 쉬운 미니 화분이나 다육식물",
    reason: "책상 위에 놓으면 기분 좋아지는 힐링 선물",
  },
  {
    name: "탁상시계/알람시계",
    emoji: "⏰",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 6, 직장동료: 6, 아이: 7, 부모님: 5 },
    occasions: { 집들이: 7, 졸업: 6, 크리스마스: 6, 기타: 6 },
    interests: { 인테리어: 7 },
    genders: { 남: 6, 여: 7, 무관: 7 },
    ages: { "10대": 7, "20대": 7, "30대": 6, "40대": 6, "50대": 5, "60대 이상": 5 },
    description: "감성적인 디자인의 탁상시계",
    reason: "인테리어 소품으로도 좋은 실용적인 선물",
  },
  {
    name: "우산",
    emoji: "☂️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 40000,
    recipients: { 직장동료: 7, 친구: 6, 부모님: 5, 선생님: 5 },
    occasions: { 감사: 7, 기타: 7 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "20대": 7, "30대": 7, "40대": 7, "50대": 6, "60대 이상": 5, "10대": 5 },
    description: "고급 3단 자동우산 또는 장우산",
    reason: "갑작스런 비에도 걱정 없는 실용 선물",
  },
  {
    name: "에코백/토트백",
    emoji: "👜",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 8, 연인: 6, 직장동료: 5 },
    occasions: { 생일: 6, 감사: 6, 기타: 7 },
    interests: { 패션: 7, 여행: 5 },
    genders: { 여: 9, 남: 5, 무관: 7 },
    ages: { "10대": 7, "20대": 9, "30대": 8, "40대": 5, "50대": 4, "60대 이상": 3 },
    description: "실용적이고 예쁜 에코백",
    reason: "일상에서 자주 사용할 수 있는 친환경 패션 아이템",
  },
  {
    name: "목베개/여행용 베개",
    emoji: "😴",
    category: "생활",
    minPrice: 10000,
    maxPrice: 40000,
    recipients: { 친구: 7, 직장동료: 6, 부모님: 6, 연인: 5 },
    occasions: { 기타: 7, 감사: 5, 크리스마스: 5 },
    interests: { 여행: 9 },
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 6, "10대": 5 },
    description: "메모리폼 여행용 목베개",
    reason: "여행이나 출장이 잦은 분께 실용적인 선물",
  },
  {
    name: "안대/수면용품",
    emoji: "😌",
    category: "생활",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 친구: 7, 직장동료: 6, 연인: 5 },
    occasions: { 기타: 7, 크리스마스: 5, 감사: 5 },
    interests: {},
    genders: { 여: 7, 남: 6, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 6, "60대 이상": 5, "10대": 5 },
    description: "실크 안대, 수면 스프레이 세트",
    reason: "편안한 수면을 선물하는 웰빙 아이템",
  },
  {
    name: "홈트 용품",
    emoji: "🏋️",
    category: "생활",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 7, 연인: 6 },
    occasions: { 생일: 6, 크리스마스: 6, 기타: 7 },
    interests: { 운동: 10 },
    genders: { 남: 8, 여: 8, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "10대": 5, "60대 이상": 3 },
    description: "요가매트, 폼롤러, 덤벨 등 홈트레이닝 용품",
    reason: "건강한 라이프스타일을 응원하는 실용적인 선물",
  },
  {
    name: "보온병/보온도시락",
    emoji: "🫙",
    category: "생활",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 부모님: 8, 직장동료: 7, 친구: 5 },
    occasions: { 감사: 7, 명절: 6, 기타: 6 },
    interests: { 요리: 6 },
    genders: { 남: 6, 여: 7, 무관: 7 },
    ages: { "30대": 7, "40대": 8, "50대": 8, "60대 이상": 7, "20대": 6, "10대": 3 },
    description: "보온보냉 기능의 도시락 또는 보온병",
    reason: "따뜻한 식사를 즐길 수 있는 실용적인 선물",
  },

  // ── 음식 (25) ──
  {
    name: "케이크",
    emoji: "🎂",
    category: "음식",
    minPrice: 15000,
    maxPrice: 60000,
    recipients: { 연인: 10, 친구: 9, 부모님: 7, 직장동료: 6, 아이: 9 },
    occasions: { 생일: 10, 기념일: 8, 크리스마스: 7 },
    interests: {},
    genders: { 남: 7, 여: 9, 무관: 8 },
    ages: { "10대": 9, "20대": 9, "30대": 8, "40대": 7, "50대": 6, "60대 이상": 5 },
    description: "맞춤 디자인 케이크 또는 유명 베이커리 케이크",
    reason: "생일의 분위기를 완성하는 필수 선물",
  },
  {
    name: "과일 선물세트",
    emoji: "🍇",
    category: "음식",
    minPrice: 30000,
    maxPrice: 150000,
    recipients: { 부모님: 9, 선생님: 8, 직장동료: 7 },
    occasions: { 명절: 10, 감사: 9, 생일: 5 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "40대": 8, "50대": 9, "60대 이상": 9, "30대": 7, "20대": 5, "10대": 4 },
    description: "제철 프리미엄 과일 선물세트",
    reason: "명절이나 감사 인사에 격식 있는 선물",
  },
  {
    name: "한우/고기 선물세트",
    emoji: "🥩",
    category: "음식",
    minPrice: 50000,
    maxPrice: 300000,
    recipients: { 부모님: 10, 선생님: 7, 직장동료: 6 },
    occasions: { 명절: 10, 감사: 9, 생일: 6 },
    interests: { 요리: 7 },
    genders: { 남: 8, 여: 6, 무관: 7 },
    ages: { "40대": 9, "50대": 10, "60대 이상": 9, "30대": 8, "20대": 5, "10대": 3 },
    description: "프리미엄 한우 또는 수입 소고기 선물세트",
    reason: "온 가족이 함께 즐길 수 있는 푸짐한 선물",
  },
  {
    name: "건강즙/홍삼",
    emoji: "🧃",
    category: "음식",
    minPrice: 20000,
    maxPrice: 150000,
    recipients: { 부모님: 10, 선생님: 7, 직장동료: 5 },
    occasions: { 명절: 9, 감사: 9, 생일: 6 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "50대": 10, "60대 이상": 10, "40대": 9, "30대": 6, "20대": 4, "10대": 2 },
    description: "홍삼, 흑마늘즙, 석류즙 등 건강식품",
    reason: "건강을 챙기는 정성 가득한 효도 선물",
  },
  {
    name: "커피머신/드립세트",
    emoji: "☕",
    category: "음식",
    minPrice: 20000,
    maxPrice: 200000,
    recipients: { 직장동료: 8, 친구: 7, 연인: 6, 부모님: 5 },
    occasions: { 집들이: 9, 생일: 7, 크리스마스: 7, 승진: 6 },
    interests: { 요리: 8 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 10, "40대": 8, "50대": 6, "60대 이상": 4, "10대": 3 },
    description: "핸드드립 세트 또는 캡슐 커피머신",
    reason: "커피를 좋아하는 분께 매일 행복을 선사하는 선물",
  },
  {
    name: "초콜릿 선물세트",
    emoji: "🍫",
    category: "음식",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 연인: 9, 친구: 8, 직장동료: 7, 선생님: 6, 아이: 8 },
    occasions: { 크리스마스: 9, 생일: 7, 기념일: 8, 감사: 7 },
    interests: {},
    genders: { 여: 9, 남: 6, 무관: 7 },
    ages: { "10대": 8, "20대": 9, "30대": 8, "40대": 6, "50대": 5, "60대 이상": 4 },
    description: "프리미엄 수제 초콜릿 세트",
    reason: "달콤한 마음을 전하는 로맨틱한 선물",
  },
  {
    name: "차 선물세트",
    emoji: "🍵",
    category: "음식",
    minPrice: 15000,
    maxPrice: 80000,
    recipients: { 부모님: 8, 선생님: 9, 직장동료: 8, 친구: 5 },
    occasions: { 감사: 9, 명절: 8, 집들이: 7, 크리스마스: 5 },
    interests: {},
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "40대": 9, "50대": 9, "60대 이상": 9, "30대": 7, "20대": 5, "10대": 3 },
    description: "고급 녹차, 허브티, 전통차 세트",
    reason: "격식을 갖춘 정성 있는 선물",
  },
  {
    name: "마카롱/쿠키 세트",
    emoji: "🧁",
    category: "음식",
    minPrice: 10000,
    maxPrice: 40000,
    recipients: { 친구: 9, 연인: 8, 직장동료: 7, 아이: 8 },
    occasions: { 생일: 8, 크리스마스: 8, 감사: 7, 기타: 6 },
    interests: {},
    genders: { 여: 9, 남: 5, 무관: 7 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 5, "50대": 4, "60대 이상": 3 },
    description: "예쁜 포장의 수제 마카롱 또는 쿠키",
    reason: "보기도 좋고 먹기도 좋은 감성 간식 선물",
  },
  {
    name: "건과일/견과류 세트",
    emoji: "🥜",
    category: "음식",
    minPrice: 15000,
    maxPrice: 80000,
    recipients: { 부모님: 8, 직장동료: 7, 선생님: 7 },
    occasions: { 명절: 9, 감사: 8, 기타: 5 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "40대": 8, "50대": 9, "60대 이상": 8, "30대": 7, "20대": 5, "10대": 3 },
    description: "프리미엄 견과류 또는 건과일 선물세트",
    reason: "건강하고 실용적인 식품 선물",
  },
  {
    name: "와인/양주",
    emoji: "🍷",
    category: "음식",
    minPrice: 20000,
    maxPrice: 300000,
    recipients: { 연인: 8, 부모님: 7, 친구: 7, 직장동료: 6 },
    occasions: { 기념일: 9, 생일: 7, 크리스마스: 8, 집들이: 8, 승진: 7 },
    interests: { 요리: 7 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "30대": 9, "40대": 9, "50대": 8, "60대 이상": 7, "20대": 7, "10대": 0 },
    description: "프리미엄 와인 또는 위스키",
    reason: "특별한 날을 더 특별하게 만드는 고급 선물",
  },
  {
    name: "커피 드립백 세트",
    emoji: "☕",
    category: "음식",
    minPrice: 8000,
    maxPrice: 30000,
    recipients: { 직장동료: 9, 친구: 7, 선생님: 7 },
    occasions: { 감사: 9, 크리스마스: 7, 기타: 7 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "20대": 8, "30대": 9, "40대": 8, "50대": 7, "60대 이상": 5, "10대": 3 },
    description: "스페셜티 드립백 커피 세트",
    reason: "부담 없는 가격에 센스 있는 커피 선물",
  },
  {
    name: "꿀/잼 세트",
    emoji: "🍯",
    category: "음식",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 부모님: 8, 선생님: 7, 직장동료: 6 },
    occasions: { 명절: 8, 감사: 8, 집들이: 6 },
    interests: { 요리: 7 },
    genders: { 남: 6, 여: 7, 무관: 7 },
    ages: { "40대": 8, "50대": 8, "60대 이상": 8, "30대": 7, "20대": 5, "10대": 3 },
    description: "국산 천연꿀 또는 수제 잼 세트",
    reason: "건강하고 달콤한 식탁 위의 선물",
  },
  {
    name: "밀키트/요리키트",
    emoji: "🍳",
    category: "음식",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 친구: 7, 연인: 6, 직장동료: 5 },
    occasions: { 집들이: 7, 생일: 5, 기타: 7 },
    interests: { 요리: 10 },
    genders: { 남: 7, 여: 8, 무관: 7 },
    ages: { "20대": 8, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3, "10대": 3 },
    description: "유명 맛집 밀키트 또는 요리 재료 세트",
    reason: "직접 요리하는 즐거움을 선물하는 특별한 아이템",
  },

  // ── 체험 (20) ──
  {
    name: "영화 티켓",
    emoji: "🎬",
    category: "체험",
    minPrice: 10000,
    maxPrice: 30000,
    recipients: { 연인: 9, 친구: 9, 아이: 8, 부모님: 5 },
    occasions: { 생일: 8, 크리스마스: 7, 기타: 8 },
    interests: {},
    genders: { 남: 8, 여: 8, 무관: 8 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 6, "50대": 5, "60대 이상": 3 },
    description: "CGV/메가박스 2인 관람권",
    reason: "함께 시간을 보낼 수 있는 경험 선물",
  },
  {
    name: "스파/마사지 이용권",
    emoji: "🧖",
    category: "체험",
    minPrice: 50000,
    maxPrice: 200000,
    recipients: { 연인: 9, 부모님: 9, 친구: 7, 직장동료: 5 },
    occasions: { 기념일: 9, 생일: 8, 감사: 8, 명절: 6 },
    interests: {},
    genders: { 여: 9, 남: 6, 무관: 8 },
    ages: { "30대": 9, "40대": 9, "50대": 9, "60대 이상": 7, "20대": 8, "10대": 3 },
    description: "프리미엄 스파 또는 마사지 이용권",
    reason: "피로를 풀며 힐링할 수 있는 특별한 체험 선물",
  },
  {
    name: "원데이 클래스",
    emoji: "🎨",
    category: "체험",
    minPrice: 30000,
    maxPrice: 100000,
    recipients: { 연인: 8, 친구: 9, 아이: 7 },
    occasions: { 생일: 8, 기념일: 7, 크리스마스: 6, 기타: 7 },
    interests: { 요리: 8, 인테리어: 7 },
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "10대": 6, "50대": 5, "60대 이상": 3 },
    description: "도자기, 꽃꽂이, 향수 만들기 등 원데이 클래스",
    reason: "새로운 경험과 추억을 함께 만들 수 있는 선물",
  },
  {
    name: "여행 상품권",
    emoji: "✈️",
    category: "체험",
    minPrice: 50000,
    maxPrice: 500000,
    recipients: { 연인: 9, 부모님: 8, 친구: 6 },
    occasions: { 기념일: 9, 졸업: 8, 생일: 7, 승진: 7 },
    interests: { 여행: 10 },
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 8, "50대": 7, "60대 이상": 6, "10대": 4 },
    description: "항공권 할인 상품권 또는 호텔 바우처",
    reason: "꿈꾸는 여행을 현실로 만들어주는 선물",
  },
  {
    name: "콘서트/공연 티켓",
    emoji: "🎵",
    category: "체험",
    minPrice: 30000,
    maxPrice: 200000,
    recipients: { 연인: 9, 친구: 9, 부모님: 6 },
    occasions: { 생일: 9, 기념일: 8, 크리스마스: 7 },
    interests: { 음악: 10 },
    genders: { 남: 7, 여: 9, 무관: 8 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 6, "50대": 5, "60대 이상": 3 },
    description: "좋아하는 가수의 콘서트 또는 뮤지컬 티켓",
    reason: "잊지 못할 추억을 만드는 최고의 체험 선물",
  },
  {
    name: "사진촬영권",
    emoji: "📸",
    category: "체험",
    minPrice: 50000,
    maxPrice: 200000,
    recipients: { 연인: 9, 친구: 7, 부모님: 7 },
    occasions: { 기념일: 10, 졸업: 9, 생일: 7 },
    interests: {},
    genders: { 여: 9, 남: 6, 무관: 7 },
    ages: { "20대": 9, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 6, "10대": 6 },
    description: "전문 스튜디오 촬영권",
    reason: "특별한 순간을 아름답게 남기는 의미 있는 선물",
  },
  {
    name: "방탈출 이용권",
    emoji: "🔐",
    category: "체험",
    minPrice: 15000,
    maxPrice: 30000,
    recipients: { 친구: 10, 연인: 8, 아이: 6 },
    occasions: { 생일: 8, 기타: 8 },
    interests: { 게임: 8 },
    genders: { 남: 8, 여: 8, 무관: 8 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 5, "50대": 3, "60대 이상": 1 },
    description: "인기 방탈출 카페 이용권",
    reason: "함께 즐기며 추억을 쌓을 수 있는 체험 선물",
  },
  {
    name: "요리 클래스",
    emoji: "👨‍🍳",
    category: "체험",
    minPrice: 30000,
    maxPrice: 100000,
    recipients: { 연인: 8, 친구: 7, 부모님: 5 },
    occasions: { 생일: 7, 기념일: 7, 기타: 7 },
    interests: { 요리: 10 },
    genders: { 남: 6, 여: 8, 무관: 7 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3, "10대": 5 },
    description: "파스타, 베이킹 등 요리 클래스 이용권",
    reason: "함께 요리하며 특별한 시간을 보낼 수 있는 체험",
  },
  {
    name: "놀이공원 이용권",
    emoji: "🎢",
    category: "체험",
    minPrice: 30000,
    maxPrice: 80000,
    recipients: { 아이: 10, 연인: 8, 친구: 7 },
    occasions: { 생일: 9, 크리스마스: 7, 기타: 7 },
    interests: {},
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "10대": 10, "20대": 9, "30대": 7, "40대": 6, "50대": 4, "60대 이상": 2 },
    description: "에버랜드/롯데월드 자유이용권",
    reason: "신나는 하루를 선물하는 체험형 선물",
  },
  {
    name: "헬스/PT 이용권",
    emoji: "💪",
    category: "체험",
    minPrice: 50000,
    maxPrice: 300000,
    recipients: { 친구: 7, 연인: 7 },
    occasions: { 생일: 6, 기타: 7 },
    interests: { 운동: 10 },
    genders: { 남: 9, 여: 7, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3, "10대": 5 },
    description: "헬스장 이용권 또는 PT 체험권",
    reason: "운동을 좋아하는 분께 건강한 라이프를 선물",
  },

  // ── 실용 (15) ──
  {
    name: "백화점 상품권",
    emoji: "🎁",
    category: "실용",
    minPrice: 10000,
    maxPrice: 500000,
    recipients: { 부모님: 8, 직장동료: 8, 선생님: 9, 친구: 6 },
    occasions: { 명절: 10, 감사: 10, 졸업: 8, 승진: 8, 기타: 7 },
    interests: {},
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "30대": 8, "40대": 9, "50대": 9, "60대 이상": 8, "20대": 7, "10대": 5 },
    description: "신세계/롯데/현대 백화점 상품권",
    reason: "원하는 것을 직접 고를 수 있는 실용적인 선물",
  },
  {
    name: "문화상품권",
    emoji: "🎫",
    category: "실용",
    minPrice: 5000,
    maxPrice: 100000,
    recipients: { 친구: 8, 아이: 8, 선생님: 7, 직장동료: 6 },
    occasions: { 감사: 8, 생일: 7, 졸업: 7, 기타: 8 },
    interests: { 독서: 8, 음악: 6, 게임: 6 },
    genders: { 남: 7, 여: 7, 무관: 8 },
    ages: { "10대": 10, "20대": 9, "30대": 7, "40대": 5, "50대": 4, "60대 이상": 3 },
    description: "문화상품권 (온라인/오프라인)",
    reason: "책, 영화, 음악 등 문화생활을 즐길 수 있는 선물",
  },
  {
    name: "카페 기프티콘",
    emoji: "☕",
    category: "실용",
    minPrice: 3000,
    maxPrice: 20000,
    recipients: { 직장동료: 9, 친구: 8, 선생님: 8, 연인: 4 },
    occasions: { 감사: 10, 기타: 8 },
    interests: {},
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "20대": 9, "30대": 9, "40대": 7, "50대": 5, "60대 이상": 3, "10대": 6 },
    description: "스타벅스/투썸 음료 기프티콘",
    reason: "가볍게 마음을 전하는 센스 있는 선물",
  },
  {
    name: "용돈봉투/현금",
    emoji: "💵",
    category: "실용",
    minPrice: 10000,
    maxPrice: 500000,
    recipients: { 아이: 10, 부모님: 7 },
    occasions: { 명절: 10, 졸업: 9, 생일: 7, 기타: 6 },
    interests: {},
    genders: { 남: 7, 여: 7, 무관: 8 },
    ages: { "10대": 10, "60대 이상": 8, "50대": 6, "20대": 5, "30대": 4, "40대": 4 },
    description: "예쁜 용돈 봉투에 담은 현금",
    reason: "가장 실용적이고 받는 사람이 자유롭게 사용할 수 있는 선물",
  },
  {
    name: "배달앱 상품권",
    emoji: "🛵",
    category: "실용",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 8, 직장동료: 7 },
    occasions: { 감사: 8, 생일: 6, 기타: 8 },
    interests: {},
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 10, "30대": 9, "40대": 6, "10대": 7, "50대": 4, "60대 이상": 2 },
    description: "배민/쿠팡이츠 상품권",
    reason: "맛있는 한 끼를 선물하는 실용적인 아이템",
  },
  {
    name: "편의점 상품권",
    emoji: "🏪",
    category: "실용",
    minPrice: 3000,
    maxPrice: 30000,
    recipients: { 아이: 9, 친구: 7, 직장동료: 5 },
    occasions: { 감사: 7, 기타: 8 },
    interests: {},
    genders: { 남: 7, 여: 6, 무관: 7 },
    ages: { "10대": 10, "20대": 8, "30대": 5, "40대": 3, "50대": 2, "60대 이상": 1 },
    description: "CU/GS25 모바일 상품권",
    reason: "부담 없이 간식을 즐길 수 있는 가벼운 선물",
  },
  {
    name: "주유 상품권",
    emoji: "⛽",
    category: "실용",
    minPrice: 30000,
    maxPrice: 100000,
    recipients: { 부모님: 7, 직장동료: 6 },
    occasions: { 감사: 7, 명절: 6, 기타: 6 },
    interests: {},
    genders: { 남: 8, 여: 6, 무관: 7 },
    ages: { "30대": 8, "40대": 9, "50대": 8, "60대 이상": 6, "20대": 6, "10대": 1 },
    description: "SK/GS칼텍스 주유 상품권",
    reason: "차를 운전하는 분께 실용적인 선물",
  },

  // ── 키즈/아이 (15) ──
  {
    name: "레고/블록",
    emoji: "🧱",
    category: "키즈",
    minPrice: 10000,
    maxPrice: 200000,
    recipients: { 아이: 10, 친구: 4 },
    occasions: { 생일: 10, 크리스마스: 10, 기타: 6 },
    interests: { 게임: 7 },
    genders: { 남: 9, 여: 6, 무관: 7 },
    ages: { "10대": 9, "20대": 5, "30대": 3, "40대": 2, "50대": 1, "60대 이상": 1 },
    description: "인기 레고 시리즈 또는 나노블록",
    reason: "창의력을 자극하는 아이들의 최고 인기 선물",
  },
  {
    name: "인형/피규어",
    emoji: "🧸",
    category: "키즈",
    minPrice: 10000,
    maxPrice: 80000,
    recipients: { 아이: 10, 연인: 6, 친구: 5 },
    occasions: { 생일: 9, 크리스마스: 9, 기타: 6 },
    interests: {},
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "10대": 9, "20대": 6, "30대": 3, "40대": 2, "50대": 1, "60대 이상": 1 },
    description: "캐릭터 인형 또는 한정판 피규어",
    reason: "좋아하는 캐릭터를 소유하는 기쁨을 선물",
  },
  {
    name: "보드게임",
    emoji: "🎲",
    category: "키즈",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 아이: 9, 친구: 8, 연인: 6 },
    occasions: { 생일: 8, 크리스마스: 9, 기타: 7 },
    interests: { 게임: 9 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "10대": 9, "20대": 8, "30대": 7, "40대": 6, "50대": 4, "60대 이상": 3 },
    description: "인기 보드게임 (할리갈리, 루미큐브 등)",
    reason: "가족이나 친구와 함께 즐길 수 있는 소통 선물",
  },
  {
    name: "문구 세트",
    emoji: "✏️",
    category: "키즈",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 아이: 10, 친구: 5, 선생님: 4 },
    occasions: { 생일: 7, 크리스마스: 7, 졸업: 6, 기타: 6 },
    interests: {},
    genders: { 남: 6, 여: 8, 무관: 7 },
    ages: { "10대": 10, "20대": 5, "30대": 3, "40대": 2, "50대": 1, "60대 이상": 1 },
    description: "예쁜 디자인의 필기구 또는 문구 세트",
    reason: "학교에서 매일 사용할 수 있는 실용적인 선물",
  },
  {
    name: "동화책/학습교재",
    emoji: "📚",
    category: "키즈",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 아이: 10 },
    occasions: { 생일: 7, 크리스마스: 7, 졸업: 6, 기타: 6 },
    interests: { 독서: 10 },
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "10대": 10, "20대": 2, "30대": 1, "40대": 1, "50대": 1, "60대 이상": 1 },
    description: "연령에 맞는 동화책이나 학습 교재",
    reason: "지식과 상상력을 키워주는 교육적인 선물",
  },
  {
    name: "퍼즐",
    emoji: "🧩",
    category: "키즈",
    minPrice: 5000,
    maxPrice: 30000,
    recipients: { 아이: 9, 친구: 5 },
    occasions: { 생일: 7, 크리스마스: 7, 기타: 6 },
    interests: { 게임: 7 },
    genders: { 남: 6, 여: 7, 무관: 7 },
    ages: { "10대": 9, "20대": 5, "30대": 4, "40대": 3, "50대": 3, "60대 이상": 3 },
    description: "500~1000피스 직소퍼즐 또는 3D 퍼즐",
    reason: "집중력과 인내심을 기를 수 있는 취미 선물",
  },

  // ── 독서/문화 (10) ──
  {
    name: "베스트셀러 도서",
    emoji: "📖",
    category: "독서",
    minPrice: 10000,
    maxPrice: 30000,
    recipients: { 친구: 8, 연인: 6, 선생님: 6, 직장동료: 5 },
    occasions: { 생일: 7, 졸업: 7, 감사: 6, 기타: 7 },
    interests: { 독서: 10 },
    genders: { 남: 7, 여: 8, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 6, "10대": 6 },
    description: "최신 베스트셀러 또는 취향 맞춤 도서",
    reason: "지적 호기심을 충족시키는 감성적인 선물",
  },
  {
    name: "다이어리/플래너",
    emoji: "📓",
    category: "독서",
    minPrice: 10000,
    maxPrice: 30000,
    recipients: { 친구: 8, 직장동료: 7, 연인: 6, 선생님: 5 },
    occasions: { 크리스마스: 9, 생일: 6, 감사: 5, 기타: 6 },
    interests: { 독서: 6 },
    genders: { 여: 8, 남: 5, 무관: 7 },
    ages: { "20대": 9, "30대": 8, "40대": 6, "10대": 7, "50대": 4, "60대 이상": 3 },
    description: "고급 가죽 다이어리 또는 스티커 포함 플래너",
    reason: "새해를 맞이하며 계획을 세울 수 있는 센스 있는 선물",
  },
  {
    name: "전자책 리더기",
    emoji: "📱",
    category: "독서",
    minPrice: 100000,
    maxPrice: 300000,
    recipients: { 연인: 7, 친구: 6, 부모님: 6 },
    occasions: { 생일: 8, 크리스마스: 7, 졸업: 6 },
    interests: { 독서: 10, 테크: 7 },
    genders: { 남: 7, 여: 7, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 6, "60대 이상": 5, "10대": 5 },
    description: "킨들 또는 리디 전자책 리더기",
    reason: "독서를 사랑하는 분께 가볍게 수천 권을 품는 선물",
  },

  // ── 스포츠/아웃도어 (10) ──
  {
    name: "운동화",
    emoji: "👟",
    category: "스포츠",
    minPrice: 50000,
    maxPrice: 200000,
    recipients: { 연인: 8, 친구: 7, 아이: 7, 부모님: 5 },
    occasions: { 생일: 8, 크리스마스: 7, 기타: 6 },
    interests: { 운동: 9, 패션: 7 },
    genders: { 남: 9, 여: 8, 무관: 8 },
    ages: { "10대": 9, "20대": 10, "30대": 8, "40대": 6, "50대": 5, "60대 이상": 3 },
    description: "나이키/아디다스 등 브랜드 운동화",
    reason: "운동과 일상 모두에 활용 가능한 실용 선물",
  },
  {
    name: "스포츠 물병/보틀",
    emoji: "🧴",
    category: "스포츠",
    minPrice: 10000,
    maxPrice: 40000,
    recipients: { 친구: 7, 직장동료: 6, 연인: 5 },
    occasions: { 생일: 5, 감사: 5, 기타: 7 },
    interests: { 운동: 9 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "10대": 7, "20대": 8, "30대": 8, "40대": 7, "50대": 5, "60대 이상": 3 },
    description: "대용량 스포츠 물병",
    reason: "운동 시 수분 보충에 딱 맞는 실용적인 아이템",
  },
  {
    name: "스포츠 타월",
    emoji: "🏃",
    category: "스포츠",
    minPrice: 5000,
    maxPrice: 20000,
    recipients: { 친구: 7, 직장동료: 5 },
    occasions: { 감사: 5, 기타: 7 },
    interests: { 운동: 9 },
    genders: { 남: 8, 여: 7, 무관: 8 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 5, "10대": 6, "60대 이상": 3 },
    description: "속건 기능의 스포츠 타월",
    reason: "운동할 때 꼭 필요한 실용적인 아이템",
  },
  {
    name: "골프용품",
    emoji: "⛳",
    category: "스포츠",
    minPrice: 20000,
    maxPrice: 300000,
    recipients: { 부모님: 8, 직장동료: 7, 선생님: 5 },
    occasions: { 승진: 8, 감사: 7, 생일: 6, 명절: 6 },
    interests: { 운동: 8 },
    genders: { 남: 9, 여: 5, 무관: 7 },
    ages: { "40대": 10, "50대": 10, "60대 이상": 8, "30대": 7, "20대": 3, "10대": 1 },
    description: "골프공, 골프장갑, 마커 등 골프 소품",
    reason: "골프를 즐기는 분께 실전에서 바로 쓸 수 있는 선물",
  },

  // ── 출산/육아 (10) ──
  {
    name: "아기 옷 세트",
    emoji: "👶",
    category: "출산",
    minPrice: 20000,
    maxPrice: 80000,
    recipients: { 친구: 8, 직장동료: 7, 부모님: 5 },
    occasions: { 출산: 10, 생일: 5, 기타: 4 },
    interests: {},
    genders: { 무관: 9, 여: 7, 남: 7 },
    ages: { "30대": 9, "40대": 7, "20대": 6, "50대": 4, "60대 이상": 3, "10대": 1 },
    description: "신생아용 순면 옷 선물세트",
    reason: "출산을 축하하는 실용적인 선물",
  },
  {
    name: "기저귀 케이크",
    emoji: "🎀",
    category: "출산",
    minPrice: 30000,
    maxPrice: 80000,
    recipients: { 친구: 8, 직장동료: 7 },
    occasions: { 출산: 10 },
    interests: {},
    genders: { 무관: 9, 여: 7, 남: 7 },
    ages: { "30대": 9, "40대": 7, "20대": 7, "50대": 4, "60대 이상": 2, "10대": 1 },
    description: "기저귀로 만든 예쁜 케이크 세트",
    reason: "출산 축하에 실용성과 센스를 겸비한 인기 선물",
  },
  {
    name: "아기 식기 세트",
    emoji: "🍼",
    category: "출산",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 친구: 7, 직장동료: 6 },
    occasions: { 출산: 9, 생일: 4 },
    interests: {},
    genders: { 무관: 9, 여: 6, 남: 6 },
    ages: { "30대": 8, "40대": 6, "20대": 6, "50대": 3, "60대 이상": 2, "10대": 1 },
    description: "BPA-free 아기 식기 세트",
    reason: "이유식 시기에 꼭 필요한 실용적인 출산 선물",
  },
  {
    name: "아기 보습제 세트",
    emoji: "🧴",
    category: "출산",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 친구: 7, 직장동료: 6 },
    occasions: { 출산: 9, 기타: 3 },
    interests: {},
    genders: { 무관: 9, 여: 6, 남: 6 },
    ages: { "30대": 8, "40대": 6, "20대": 6, "50대": 3, "60대 이상": 2, "10대": 1 },
    description: "저자극 아기 보습 로션/크림 세트",
    reason: "아기 피부에 안전한 프리미엄 보습 선물",
  },

  // ── 기타/특별 (5) ──
  {
    name: "포토북/앨범",
    emoji: "📷",
    category: "특별",
    minPrice: 15000,
    maxPrice: 50000,
    recipients: { 연인: 10, 부모님: 8, 친구: 7 },
    occasions: { 기념일: 10, 생일: 8, 졸업: 7 },
    interests: {},
    genders: { 여: 9, 남: 6, 무관: 7 },
    ages: { "20대": 9, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 7, "10대": 5 },
    description: "함께한 추억을 담은 맞춤 포토북",
    reason: "세상에 하나뿐인 특별한 추억 선물",
  },
  {
    name: "커플/우정 팔찌",
    emoji: "📿",
    category: "특별",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 연인: 10, 친구: 8 },
    occasions: { 기념일: 10, 생일: 7, 크리스마스: 7 },
    interests: { 패션: 7 },
    genders: { 여: 9, 남: 6, 무관: 7 },
    ages: { "10대": 9, "20대": 10, "30대": 7, "40대": 4, "50대": 3, "60대 이상": 2 },
    description: "이니셜 각인 커플 팔찌 또는 우정 팔찌",
    reason: "서로의 유대감을 보여주는 의미 있는 선물",
  },
  {
    name: "각인 아이템",
    emoji: "✨",
    category: "특별",
    minPrice: 15000,
    maxPrice: 80000,
    recipients: { 연인: 9, 부모님: 7, 친구: 6, 선생님: 5 },
    occasions: { 기념일: 10, 생일: 8, 졸업: 7, 감사: 7 },
    interests: {},
    genders: { 남: 7, 여: 8, 무관: 8 },
    ages: { "20대": 9, "30대": 8, "40대": 7, "50대": 7, "60대 이상": 6, "10대": 5 },
    description: "이름이나 메시지를 새긴 텀블러/펜/액자",
    reason: "개인화된 메시지로 진심을 전하는 특별한 선물",
  },
  {
    name: "반려동물 용품",
    emoji: "🐾",
    category: "특별",
    minPrice: 10000,
    maxPrice: 50000,
    recipients: { 친구: 7, 연인: 6 },
    occasions: { 생일: 6, 크리스마스: 6, 기타: 7 },
    interests: {},
    genders: { 여: 8, 남: 6, 무관: 7 },
    ages: { "20대": 8, "30대": 8, "40대": 7, "50대": 5, "60대 이상": 4, "10대": 5 },
    description: "반려동물 간식, 장난감, 옷 세트",
    reason: "반려동물을 키우는 분께 가장 기쁜 선물",
  },
  {
    name: "꽃다발/꽃바구니",
    emoji: "💐",
    category: "특별",
    minPrice: 20000,
    maxPrice: 100000,
    recipients: { 연인: 10, 부모님: 8, 선생님: 8, 친구: 6, 직장동료: 5 },
    occasions: { 기념일: 10, 졸업: 9, 승진: 8, 감사: 9, 생일: 8 },
    interests: {},
    genders: { 여: 10, 남: 4, 무관: 7 },
    ages: { "20대": 9, "30대": 9, "40대": 8, "50대": 8, "60대 이상": 7, "10대": 5 },
    description: "계절에 어울리는 생화 꽃다발",
    reason: "마음을 전하는 가장 클래식하고 감동적인 선물",
  },
];

/* ══════════════════════════════════════════
   Scoring & Recommendation Engine
   ══════════════════════════════════════════ */

interface FormState {
  recipient: Recipient;
  gender: Gender;
  ageGroup: AgeGroup;
  occasion: Occasion;
  budget: Budget;
  interests: Interest[];
}

function scoreGift(gift: Gift, form: FormState): number {
  let score = 0;
  let weights = 0;

  // Recipient (weight 3)
  const rScore = gift.recipients[form.recipient] ?? 0;
  score += rScore * 3;
  weights += 3;

  // Gender (weight 2)
  const gScore =
    form.gender === "무관"
      ? gift.genders["무관"] ?? 7
      : gift.genders[form.gender] ?? gift.genders["무관"] ?? 5;
  score += gScore * 2;
  weights += 2;

  // Age (weight 2)
  const aScore = gift.ages[form.ageGroup] ?? 5;
  score += aScore * 2;
  weights += 2;

  // Occasion (weight 3)
  const oScore = gift.occasions[form.occasion] ?? 0;
  score += oScore * 3;
  weights += 3;

  // Interests (weight 2 each, averaged)
  if (form.interests.length > 0) {
    let iTotal = 0;
    let iCount = 0;
    for (const interest of form.interests) {
      const s = gift.interests[interest];
      if (s !== undefined) {
        iTotal += s;
        iCount++;
      }
    }
    if (iCount > 0) {
      score += (iTotal / iCount) * 2;
      weights += 2;
    }
  }

  return weights > 0 ? (score / weights / 10) * 100 : 0;
}

function filterByBudget(gift: Gift, budget: Budget): boolean {
  const [bMin, bMax] = BUDGET_RANGE[budget];
  return gift.maxPrice >= bMin && gift.minPrice <= bMax;
}

function formatPrice(n: number): string {
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    const remainder = n % 10000;
    return remainder > 0
      ? `${man}만${remainder.toLocaleString()}원`
      : `${man}만원`;
  }
  return `${n.toLocaleString()}원`;
}

function generateReason(gift: Gift, form: FormState): string {
  const recipientLabel =
    form.recipient === "아이"
      ? "아이에게"
      : form.recipient === "부모님"
        ? "부모님께"
        : form.recipient === "선생님"
          ? "선생님께"
          : `${form.recipient}에게`;

  const occasionLabel =
    form.occasion === "기타" ? "" : ` ${form.occasion}에`;

  const interestLabel =
    form.interests.length > 0
      ? ` ${form.interests.slice(0, 2).join(", ")}에 관심이 있는`
      : "";

  return `${interestLabel} ${form.ageGroup} ${recipientLabel}${occasionLabel} ${gift.reason.toLowerCase().replace(/.$/, "")}는 선물입니다.`.replace(
    /^\s+/,
    "",
  );
}

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */

export default function GiftRecommendationPage() {
  const [form, setForm] = useState<FormState>({
    recipient: "연인",
    gender: "무관",
    ageGroup: "20대",
    occasion: "생일",
    budget: "~5만원",
    interests: [],
  });
  const [results, setResults] = useState<
    { gift: Gift; score: number; reason: string }[] | null
  >(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const toggleInterest = (i: Interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter((x) => x !== i)
        : [...prev.interests, i],
    }));
  };

  const recommend = () => {
    const filtered = GIFTS.filter((g) => filterByBudget(g, form.budget));
    const scored = filtered.map((gift) => ({
      gift,
      score: scoreGift(gift, form),
      reason: generateReason(gift, form),
    }));
    scored.sort((a, b) => b.score - a.score);

    // Add slight randomness for "다시 추천받기"
    const seed = shuffleSeed;
    const top15 = scored.slice(0, 15);
    for (let i = top15.length - 1; i > 0; i--) {
      const j = Math.floor(((seed + i) * 9301 + 49297) % 233280 / 233280 * (i + 1));
      if (Math.abs(top15[i].score - top15[j].score) < 8) {
        [top15[i], top15[j]] = [top15[j], top15[i]];
      }
    }

    setResults(top15.slice(0, 5));
    setShuffleSeed((s) => s + 1);
  };

  const reRecommend = () => {
    recommend();
  };

  // Popular gifts (static)
  const popularGifts = useMemo(
    () => [
      { rank: 1, emoji: "🎧", name: "에어팟/무선이어폰" },
      { rank: 2, emoji: "🧴", name: "브랜드 향수" },
      { rank: 3, emoji: "💄", name: "화장품 세트" },
      { rank: 4, emoji: "🎁", name: "백화점 상품권" },
      { rank: 5, emoji: "👛", name: "가죽 지갑" },
      { rank: 6, emoji: "☕", name: "커피머신/드립세트" },
      { rank: 7, emoji: "💆", name: "안마기/마사지건" },
      { rank: 8, emoji: "⌚", name: "스마트워치" },
      { rank: 9, emoji: "🕯️", name: "디퓨저" },
      { rank: 10, emoji: "💐", name: "꽃다발/꽃바구니" },
    ],
    [],
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          <span className="text-3xl sm:text-4xl mr-2">🎁</span>
          선물 아이디어 추천
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          받는 사람, 상황, 예산을 입력하면 도구가 최적의 선물을 추천합니다
        </p>
      </div>

      {/* Input Form */}
      <div className="calc-card p-6 sm:p-8 mb-8">
        {/* Recipient */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            받는 사람
          </label>
          <div className="flex flex-wrap gap-2">
            {RECIPIENTS.map((r) => (
              <button
                key={r}
                onClick={() => setForm((p) => ({ ...p, recipient: r }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.recipient === r
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            성별
          </label>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => setForm((p) => ({ ...p, gender: g }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.gender === g
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            나이대
          </label>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map((a) => (
              <button
                key={a}
                onClick={() => setForm((p) => ({ ...p, ageGroup: a }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.ageGroup === a
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            상황
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                onClick={() => setForm((p) => ({ ...p, occasion: o }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.occasion === o
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            예산
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setForm((p) => ({ ...p, budget: b }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.budget === b
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            취향/관심사{" "}
            <span className="text-gray-400 font-normal">(다중선택 가능)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.interests.includes(i)
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={recommend}
          className="calc-btn-primary w-full text-base py-3.5"
        >
          <span className="text-lg">🎯</span>
          선물 아이디어 추천받기
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mb-8 animate-fade-in">
          <div className="calc-card overflow-hidden">
            <div className="calc-result-header">
              <p className="text-sm opacity-80 mb-1">추천 결과</p>
              <h2 className="text-xl font-bold relative z-10">
                맞춤 선물 TOP 5
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {results.map((r, idx) => (
                <div
                  key={`${r.gift.name}-${idx}`}
                  className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : idx === 1
                            ? "bg-gray-200 text-gray-600"
                            : idx === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name & Emoji */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{r.gift.emoji}</span>
                        <h3 className="text-base font-bold text-gray-900">
                          {r.gift.name}
                        </h3>
                      </div>

                      {/* Price & Category */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm text-blue-600 font-semibold">
                          {formatPrice(r.gift.minPrice)} ~{" "}
                          {formatPrice(r.gift.maxPrice)}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {r.gift.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-2">
                        {r.gift.description}
                      </p>

                      {/* Recommendation reason */}
                      <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                        <p className="text-xs font-semibold text-purple-600 mb-1">
                          <span className="mr-1">🤖</span>추천 이유
                        </p>
                        <p className="text-sm text-gray-700">{r.reason}</p>
                      </div>

                      {/* Score Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          적합도
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(Math.round(r.score), 100)}%`,
                              background:
                                r.score >= 70
                                  ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                                  : r.score >= 50
                                    ? "linear-gradient(90deg, #f59e0b, #f97316)"
                                    : "#9ca3af",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 w-10 text-right">
                          {Math.min(Math.round(r.score), 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Re-recommend */}
            <div className="p-4 sm:p-6 pt-0">
              <button
                onClick={reRecommend}
                className="calc-btn-secondary w-full"
              >
                <span className="text-base">🔄</span>
                다시 추천받기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Gifts TOP 10 */}
      <div className="calc-card p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🏆</span>
          인기 선물 TOP 10
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularGifts.map((g) => (
            <div
              key={g.rank}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  g.rank <= 3
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {g.rank}
              </span>
              <span className="text-lg">{g.emoji}</span>
              <span className="text-sm font-medium text-gray-700">
                {g.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="calc-seo-card mb-8">
        <h2 className="calc-seo-title">선물 아이디어 추천 사용 가이드</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            선물 아이디어 추천은 받는 사람의 특성, 상황, 예산, 취향을 종합적으로
            분석하여 가장 적합한 선물을 추천해 드리는 서비스입니다.
          </p>
          <p>
            150가지 이상의 선물 데이터베이스를 기반으로, 받는 사람과의 관계
            (연인, 부모님, 친구 등), 선물을 주는 상황 (생일, 크리스마스, 기념일
            등), 예산 범위, 관심사를 고려하여 최적의 선물 5가지를 추천합니다.
          </p>
          <p>
            추천 결과가 마음에 들지 않으면 &quot;다시 추천받기&quot; 버튼을 눌러
            다른 선물 조합을 확인할 수 있습니다. 다양한 조건을 변경해가며
            최적의 선물을 찾아보세요.
          </p>
        </div>
      </div>

      <RelatedTools current="gift-recommendation" />
    </div>
  );
}
