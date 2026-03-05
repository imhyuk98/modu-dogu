"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categoryMap: Record<string, { label: string; href?: string }> = {
  // Calculators
  "exchange-rate": { label: "금융 계산기" },
  salary: { label: "금융 계산기" },
  loan: { label: "금융 계산기" },
  deposit: { label: "금융 계산기" },
  savings: { label: "금융 계산기" },
  retirement: { label: "금융 계산기" },
  unemployment: { label: "금융 계산기" },
  "stock-return": { label: "금융 계산기" },
  "average-price": { label: "금융 계산기" },
  inflation: { label: "금융 계산기" },
  "rent-conversion": { label: "금융 계산기" },
  "car-tax": { label: "금융 계산기" },
  electricity: { label: "금융 계산기" },
  vat: { label: "금융 계산기" },
  "lotto-tax": { label: "금융 계산기" },
  // Real Estate
  "brokerage-fee": { label: "부동산" },
  "acquisition-tax": { label: "부동산" },
  "capital-gains-tax": { label: "부동산" },
  "gift-tax": { label: "부동산" },
  "inheritance-tax": { label: "부동산" },
  // Life
  percent: { label: "생활 계산기" },
  "character-count": { label: "생활 계산기" },
  age: { label: "생활 계산기" },
  dday: { label: "생활 계산기" },
  pyeong: { label: "생활 계산기" },
  "unit-converter": { label: "생활 계산기" },
  ratio: { label: "생활 계산기" },
  bmi: { label: "생활 계산기" },
  alcohol: { label: "생활 계산기" },
  "annual-leave": { label: "생활 계산기" },
  gpa: { label: "생활 계산기" },
  scientific: { label: "생활 계산기" },
  // Fun
  "mbti-compatibility": { label: "재미/운세" },
  "name-compatibility": { label: "재미/운세" },
  constellation: { label: "재미/운세" },
  zodiac: { label: "재미/운세" },
  "blood-type": { label: "재미/운세" },
  saju: { label: "재미/운세" },
  "past-life": { label: "재미/운세" },
  "daily-fortune": { label: "재미/운세" },
  "couple-dday": { label: "재미/운세" },
  "psychology-test": { label: "재미/운세" },
  "mbti-test": { label: "재미/운세" },
  // Games
  "liar-game": { label: "게임" },
  "truth-or-dare": { label: "게임" },
  "bomb-game": { label: "게임" },
  "updown-game": { label: "게임" },
  "random-pick": { label: "게임" },
  "drinking-games": { label: "게임" },
  "ladder-game": { label: "게임" },
  "reaction-test": { label: "게임" },
  "memory-game": { label: "게임" },
  "color-blind-test": { label: "게임" },
  "game-2048": { label: "게임" },
  sudoku: { label: "게임" },
  "block-escape": { label: "게임" },
  minesweeper: { label: "게임" },
  "snake-game": { label: "게임" },
  omok: { label: "게임" },
  // Converters
  "image-converter": { label: "변환기" },
  "csv-json": { label: "변환기" },
  "markdown-html": { label: "변환기" },
  base64: { label: "변환기" },
  "color-converter": { label: "변환기" },
  // Tools
  timer: { label: "도구" },
  "json-formatter": { label: "도구" },
  "qr-code": { label: "도구" },
  "nickname-generator": { label: "도구" },
  "random-roulette": { label: "도구" },
  "random-number": { label: "도구" },
  "typing-test": { label: "도구" },
};

const titleMap: Record<string, string> = {
  "exchange-rate": "환율 계산기",
  salary: "연봉 실수령액",
  loan: "대출이자 계산기",
  deposit: "예금이자 계산기",
  savings: "적금 이자 계산기",
  retirement: "퇴직금 계산기",
  unemployment: "실업급여 계산기",
  "stock-return": "주식 수익률 계산기",
  "average-price": "물타기 계산기",
  inflation: "인플레이션 계산기",
  "rent-conversion": "전월세 전환",
  "car-tax": "자동차세 계산기",
  electricity: "전기요금 계산기",
  vat: "부가세 계산기",
  "lotto-tax": "로또 세금 계산기",
  "brokerage-fee": "중개수수료 계산기",
  "acquisition-tax": "취득세 계산기",
  "capital-gains-tax": "양도소득세 계산기",
  "gift-tax": "증여세 계산기",
  "inheritance-tax": "상속세 계산기",
  percent: "퍼센트 계산기",
  "character-count": "글자수 세기",
  age: "나이 계산기",
  dday: "날짜 계산기",
  pyeong: "평수 계산기",
  "unit-converter": "단위 변환기",
  ratio: "비율 계산기",
  bmi: "BMI 계산기",
  alcohol: "음주 측정기",
  "annual-leave": "연차 계산기",
  gpa: "학점 계산기",
  scientific: "공학용 계산기",
  "mbti-compatibility": "MBTI 궁합",
  "name-compatibility": "이름 궁합",
  constellation: "별자리 계산기",
  zodiac: "띠 계산기",
  "blood-type": "혈액형 계산기",
  saju: "사주팔자",
  "past-life": "전생 테스트",
  "daily-fortune": "오늘의 운세",
  "couple-dday": "커플 D-day",
  "psychology-test": "심리테스트",
  "mbti-test": "MBTI 검사",
  "drinking-games": "술게임 모음",
  "image-converter": "이미지 변환기",
  "csv-json": "CSV JSON 변환기",
  "markdown-html": "Markdown HTML",
  base64: "Base64 인코더",
  "color-converter": "색상 변환기",
  timer: "타이머",
  "json-formatter": "JSON 포매터",
  "qr-code": "QR 코드 생성기",
  "nickname-generator": "닉네임 생성기",
  "random-roulette": "랜덤 룰렛",
  "random-number": "랜덤 숫자",
  "typing-test": "타자 측정",
  "reaction-test": "반응속도 테스트",
  "color-blind-test": "색맹 테스트",
  "memory-game": "기억력 테스트",
  "ladder-game": "사다리 타기",
  "liar-game": "라이어 게임",
  "truth-or-dare": "진실 or 도전",
  "bomb-game": "폭탄 돌리기",
  "updown-game": "업다운 게임",
  "random-pick": "랜덤 지목",
  "game-2048": "2048",
  sudoku: "스도쿠",
  "block-escape": "블록 탈출",
  minesweeper: "지뢰찾기",
  "snake-game": "스네이크 게임",
  omok: "오목",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Only show on calculator/tool pages
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const slug = parts[parts.length - 1];
  const category = categoryMap[slug];
  const title = titleMap[slug];

  if (!category || !title) return null;

  return (
    <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-blue-600 transition-colors">
        홈
      </Link>
      <span className="text-gray-300">/</span>
      <span>{category.label}</span>
      <span className="text-gray-300">/</span>
      <span className="text-gray-700 font-medium">{title}</span>
    </nav>
  );
}
