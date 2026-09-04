"use client";

import { useState, useMemo, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ══════════════════════════════════════════
   Types & Constants
   ══════════════════════════════════════════ */

type Mood =
  | "위로받고 싶을 때"
  | "동기부여"
  | "지식 습득"
  | "재미"
  | "잠들기 전"
  | "여행 중"
  | "힐링";

type Genre =
  | "소설"
  | "에세이"
  | "자기계발"
  | "경제경영"
  | "인문"
  | "과학"
  | "역사"
  | "심리"
  | "여행"
  | "요리"
  | "시"
  | "만화";

type ReadingLevel = "가벼운 읽기" | "보통" | "깊은 읽기";

type PageLength =
  | "짧은 책(~200p)"
  | "보통(200~400p)"
  | "긴 책(400p~)"
  | "상관없음";

type AgeGroup = "10대" | "20대" | "30대" | "40대" | "50대 이상";

interface Book {
  title: string;
  author: string;
  genre: Genre;
  year: number;
  pages: number;
  rating: number;
  level: ReadingLevel;
  moods: Mood[];
  ages: AgeGroup[];
  description: string;
  reason: string;
}

const MOODS: { label: Mood; emoji: string }[] = [
  { label: "위로받고 싶을 때", emoji: "🤗" },
  { label: "동기부여", emoji: "🔥" },
  { label: "지식 습득", emoji: "📚" },
  { label: "재미", emoji: "😄" },
  { label: "잠들기 전", emoji: "🌙" },
  { label: "여행 중", emoji: "✈️" },
  { label: "힐링", emoji: "🌿" },
];

const GENRES: Genre[] = [
  "소설",
  "에세이",
  "자기계발",
  "경제경영",
  "인문",
  "과학",
  "역사",
  "심리",
  "여행",
  "요리",
  "시",
  "만화",
];

const READING_LEVELS: ReadingLevel[] = ["가벼운 읽기", "보통", "깊은 읽기"];

const PAGE_LENGTHS: PageLength[] = [
  "짧은 책(~200p)",
  "보통(200~400p)",
  "긴 책(400p~)",
  "상관없음",
];

const AGE_GROUPS: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];

/* ══════════════════════════════════════════
   Book Database (120+ books)
   ══════════════════════════════════════════ */

const BOOKS: Book[] = [
  // ── Korean Fiction ──
  { title: "아몬드", author: "손원평", genre: "소설", year: 2017, pages: 264, rating: 9, level: "보통", moods: ["위로받고 싶을 때", "힐링"], ages: ["10대", "20대", "30대"], description: "감정을 느끼지 못하는 소년 선윤재의 성장 이야기. 타인의 감정을 이해하는 법을 배워가는 과정을 그렸다.", reason: "따뜻한 위로와 함께 감정에 대해 깊이 생각해볼 수 있는 소설입니다." },
  { title: "82년생 김지영", author: "조남주", genre: "소설", year: 2016, pages: 190, rating: 8, level: "가벼운 읽기", moods: ["지식 습득", "위로받고 싶을 때"], ages: ["20대", "30대", "40대"], description: "1982년에 태어난 평범한 여성 김지영의 삶을 통해 한국 사회의 성차별 문제를 조명한다.", reason: "사회적 공감과 이해를 넓혀주는 필독서입니다." },
  { title: "불편한 편의점", author: "김호연", genre: "소설", year: 2021, pages: 268, rating: 8, level: "가벼운 읽기", moods: ["힐링", "위로받고 싶을 때", "잠들기 전"], ages: ["20대", "30대", "40대"], description: "노숙인 독고씨가 편의점 야간 알바를 시작하면서 벌어지는 따뜻한 이야기.", reason: "편안하게 읽을 수 있는 힐링 소설로, 마음이 따뜻해지는 이야기입니다." },
  { title: "달러구트 꿈 백화점", author: "이미예", genre: "소설", year: 2020, pages: 280, rating: 8, level: "가벼운 읽기", moods: ["잠들기 전", "힐링", "재미"], ages: ["10대", "20대", "30대"], description: "잠들면 방문할 수 있는 꿈 백화점에서 벌어지는 판타지 이야기.", reason: "잠들기 전 읽기 좋은 판타지 소설로, 상상력을 자극합니다." },
  { title: "파친코", author: "이민진", genre: "소설", year: 2017, pages: 560, rating: 9, level: "깊은 읽기", moods: ["지식 습득", "위로받고 싶을 때"], ages: ["20대", "30대", "40대", "50대 이상"], description: "일제강점기부터 4대에 걸친 재일 한국인 가족의 대하소설.", reason: "역사와 가족, 정체성에 대해 깊이 생각하게 만드는 걸작입니다." },
  { title: "종의 기원", author: "정유정", genre: "소설", year: 2016, pages: 324, rating: 8, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대", "40대"], description: "어머니를 살해한 아들의 시점에서 진행되는 심리 스릴러.", reason: "몰입감 높은 심리 스릴러로, 인간 본성에 대해 탐구합니다." },
  { title: "채식주의자", author: "한강", genre: "소설", year: 2007, pages: 247, rating: 9, level: "보통", moods: ["지식 습득", "힐링"], ages: ["20대", "30대", "40대", "50대 이상"], description: "채식을 선언한 한 여성의 이야기를 세 편의 연작으로 그린 소설. 한강 작가의 부커상 수상작.", reason: "노벨문학상 수상 작가의 대표작으로, 한국 문학의 정수를 경험할 수 있습니다." },
  { title: "완전한 행복", author: "정유정", genre: "소설", year: 2021, pages: 480, rating: 8, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대", "40대"], description: "연쇄 실종 사건을 추적하는 형사와 범인의 치열한 두뇌 싸움.", reason: "탁월한 서사와 긴장감으로 단숨에 읽게 되는 스릴러입니다." },
  { title: "시선으로부터,", author: "정세랑", genre: "소설", year: 2020, pages: 244, rating: 8, level: "가벼운 읽기", moods: ["힐링", "위로받고 싶을 때"], ages: ["20대", "30대"], description: "서울의 한 아파트 주민들이 서로를 돌보며 살아가는 이야기.", reason: "따뜻한 공동체 이야기로 마음의 안식을 줍니다." },
  { title: "지구 끝의 온실", author: "김초엽", genre: "소설", year: 2021, pages: 312, rating: 8, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대"], description: "기후 재앙 이후의 세계를 배경으로 한 SF 소설.", reason: "한국 SF의 새로운 가능성을 보여주는 작품입니다." },
  { title: "작별하지 않는다", author: "한강", genre: "소설", year: 2021, pages: 324, rating: 9, level: "깊은 읽기", moods: ["위로받고 싶을 때", "지식 습득"], ages: ["30대", "40대", "50대 이상"], description: "제주 4.3 사건을 배경으로 한 한강 작가의 장편소설.", reason: "역사적 아픔을 문학적으로 승화시킨 깊은 작품입니다." },
  { title: "살인자의 기억법", author: "김영하", genre: "소설", year: 2013, pages: 220, rating: 8, level: "보통", moods: ["재미"], ages: ["20대", "30대", "40대"], description: "치매에 걸린 연쇄살인범이 딸의 남자친구가 살인범임을 알아차리는 이야기.", reason: "독특한 설정과 반전이 돋보이는 심리 스릴러입니다." },
  { title: "소년이 온다", author: "한강", genre: "소설", year: 2014, pages: 216, rating: 9, level: "깊은 읽기", moods: ["위로받고 싶을 때", "지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "5.18 광주민주화운동을 배경으로 한 소설.", reason: "역사의 아픔을 직시하게 만드는 강렬한 작품입니다." },
  { title: "나의 아름다운 이웃", author: "정세랑", genre: "소설", year: 2019, pages: 248, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["20대", "30대"], description: "이웃 간의 소소한 일상과 따뜻한 관계를 그린 단편집.", reason: "일상의 소소한 행복을 발견하게 해주는 이야기입니다." },
  { title: "우리가 빛의 속도로 갈 수 없다면", author: "김초엽", genre: "소설", year: 2019, pages: 284, rating: 8, level: "보통", moods: ["재미", "힐링", "지식 습득"], ages: ["20대", "30대"], description: "과학적 상상력과 따뜻한 감성이 결합된 SF 단편집.", reason: "한국 SF 문학의 새로운 지평을 연 작품입니다." },
  { title: "연년세세", author: "황정은", genre: "소설", year: 2020, pages: 256, rating: 8, level: "보통", moods: ["위로받고 싶을 때", "지식 습득"], ages: ["20대", "30대", "40대"], description: "자매의 이야기를 통해 가족과 삶의 의미를 탐구한다.", reason: "담담하면서도 깊은 울림을 주는 가족 소설입니다." },
  { title: "고양이", author: "구병모", genre: "소설", year: 2018, pages: 236, rating: 7, level: "보통", moods: ["재미", "힐링"], ages: ["20대", "30대"], description: "고양이를 키우는 사람들의 이야기를 모은 연작 소설.", reason: "반려동물과 함께하는 일상의 따뜻함을 느낄 수 있습니다." },
  { title: "빛의 과거", author: "은희경", genre: "소설", year: 2017, pages: 320, rating: 7, level: "보통", moods: ["지식 습득", "위로받고 싶을 때"], ages: ["30대", "40대", "50대 이상"], description: "기억과 시간, 사랑에 대한 이야기를 섬세하게 풀어낸 소설.", reason: "삶의 깊은 면을 성찰하게 하는 문학 작품입니다." },

  // ── Korean Non-fiction / Self-help ──
  { title: "역행자", author: "자청", genre: "자기계발", year: 2022, pages: 300, rating: 8, level: "가벼운 읽기", moods: ["동기부여"], ages: ["20대", "30대"], description: "평범한 사람이 인생을 역전시키는 7단계 알고리즘을 제시한다.", reason: "실행력을 높이고 삶의 방향을 바꾸고 싶은 분에게 추천합니다." },
  { title: "부의 추월차선", author: "엠제이 드마코", genre: "경제경영", year: 2012, pages: 424, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "부를 빠르게 축적하기 위한 사고방식과 전략을 제시한다.", reason: "재무적 자유를 꿈꾸는 분에게 새로운 시각을 열어줍니다." },
  { title: "트렌드 코리아 2025", author: "김난도 외", genre: "경제경영", year: 2024, pages: 400, rating: 7, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "2025년 한국 사회의 소비 트렌드를 10개 키워드로 전망한다.", reason: "시대의 흐름을 읽고 미래를 준비하는 데 도움이 됩니다." },
  { title: "아주 작은 습관의 힘", author: "제임스 클리어", genre: "자기계발", year: 2019, pages: 320, rating: 9, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "작은 습관의 변화가 놀라운 결과를 만들어내는 원리와 실천법을 설명한다.", reason: "습관 형성의 과학적 원리를 알기 쉽게 설명한 필독서입니다." },
  { title: "돈의 속성", author: "김승호", genre: "경제경영", year: 2020, pages: 340, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "사업가 김승호 회장이 전하는 돈에 대한 통찰과 철학.", reason: "돈에 대한 근본적인 이해를 돕는 경제 필독서입니다." },
  { title: "미움받을 용기", author: "기시미 이치로", genre: "심리", year: 2014, pages: 336, rating: 9, level: "보통", moods: ["위로받고 싶을 때", "동기부여", "힐링"], ages: ["20대", "30대", "40대", "50대 이상"], description: "아들러 심리학을 대화 형식으로 쉽게 풀어낸 책.", reason: "대인관계 고민이 있다면 반드시 읽어야 할 심리학 필독서입니다." },
  { title: "원씽", author: "게리 켈러", genre: "자기계발", year: 2013, pages: 264, rating: 8, level: "가벼운 읽기", moods: ["동기부여"], ages: ["20대", "30대", "40대"], description: "가장 중요한 한 가지에 집중하는 것의 힘을 강조한다.", reason: "집중력과 생산성을 높이고 싶은 분에게 추천합니다." },
  { title: "부자 아빠 가난한 아빠", author: "로버트 기요사키", genre: "경제경영", year: 2000, pages: 336, rating: 8, level: "가벼운 읽기", moods: ["동기부여", "지식 습득"], ages: ["10대", "20대", "30대"], description: "두 아버지의 대조적인 돈에 대한 관점을 통해 재무 교육의 중요성을 알려준다.", reason: "경제적 사고의 기초를 다지는 데 필수적인 책입니다." },
  { title: "타이탄의 도구들", author: "팀 페리스", genre: "자기계발", year: 2017, pages: 736, rating: 8, level: "깊은 읽기", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "200명 이상의 세계적 성공인들의 습관, 루틴, 사고법을 정리한 책.", reason: "다양한 분야 성공인들의 노하우를 한 권으로 만날 수 있습니다." },
  { title: "레버리지", author: "롭 무어", genre: "자기계발", year: 2017, pages: 328, rating: 7, level: "보통", moods: ["동기부여"], ages: ["20대", "30대", "40대"], description: "시간, 돈, 사람의 레버리지를 활용한 효율적 성공 전략.", reason: "더 적게 일하고 더 많이 성취하는 방법을 알려줍니다." },
  { title: "자기 앞의 생", author: "에밀 아자르", genre: "소설", year: 1975, pages: 240, rating: 9, level: "보통", moods: ["위로받고 싶을 때", "힐링"], ages: ["20대", "30대", "40대", "50대 이상"], description: "아랍 소년 모모와 노창녀 로자 아줌마의 감동적인 이야기.", reason: "삶과 사랑, 죽음에 대해 깊이 생각하게 만드는 명작입니다." },

  // ── Korean Essay ──
  { title: "하마터면 열심히 살 뻔했다", author: "하완", genre: "에세이", year: 2018, pages: 272, rating: 7, level: "가벼운 읽기", moods: ["힐링", "위로받고 싶을 때", "잠들기 전"], ages: ["20대", "30대"], description: "무기력과 나태를 긍정적으로 바라보는 에세이. 쉬어도 괜찮다고 말해준다.", reason: "지친 일상에서 잠시 쉬어가도 된다는 위로를 줍니다." },
  { title: "보건교사 안은영", author: "정세랑", genre: "소설", year: 2015, pages: 264, rating: 8, level: "가벼운 읽기", moods: ["재미", "힐링"], ages: ["10대", "20대", "30대"], description: "학교에 숨겨진 비밀을 파헤치는 보건교사의 판타지 이야기.", reason: "한국식 판타지와 유쾌한 전개가 매력적인 소설입니다." },
  { title: "죽고 싶지만 떡볶이는 먹고 싶어", author: "백세희", genre: "에세이", year: 2018, pages: 216, rating: 8, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "힐링"], ages: ["20대", "30대"], description: "가벼운 우울증을 겪는 저자의 정신과 상담 기록.", reason: "마음의 병에 대해 솔직하게 이야기하는 용기 있는 에세이입니다." },
  { title: "언어의 온도", author: "이기주", genre: "에세이", year: 2016, pages: 280, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["20대", "30대", "40대"], description: "말과 글의 온도에 대한 감성적인 에세이.", reason: "언어가 가진 힘과 따뜻함을 느낄 수 있는 에세이입니다." },
  { title: "나는 나로 살기로 했다", author: "김수현", genre: "에세이", year: 2016, pages: 272, rating: 7, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "힐링", "동기부여"], ages: ["20대", "30대"], description: "타인의 시선에서 벗어나 자기 자신으로 살아가는 용기에 대한 에세이.", reason: "자존감을 높이고 싶은 분에게 따뜻한 위로가 됩니다." },
  { title: "매일 매일이 좋은 날", author: "이성선", genre: "에세이", year: 2020, pages: 240, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["30대", "40대", "50대 이상"], description: "소소한 일상에서 행복을 발견하는 에세이.", reason: "일상의 작은 행복을 소중히 여기게 만듭니다." },
  { title: "어른의 문장력", author: "김선영", genre: "에세이", year: 2021, pages: 260, rating: 7, level: "가벼운 읽기", moods: ["지식 습득", "동기부여"], ages: ["20대", "30대", "40대"], description: "글쓰기와 표현력을 향상시키는 실용적인 문장 가이드.", reason: "글쓰기 능력을 키우고 싶은 분에게 유용한 안내서입니다." },
  { title: "걷는 사람 하정우", author: "하정우", genre: "에세이", year: 2018, pages: 276, rating: 7, level: "가벼운 읽기", moods: ["힐링", "동기부여", "여행 중"], ages: ["20대", "30대", "40대"], description: "배우 하정우의 걷기 예찬 에세이. 걸으며 사유하는 삶.", reason: "걷기의 즐거움과 삶의 여유를 느낄 수 있습니다." },

  // ── Translated Classics / Literature ──
  { title: "사피엔스", author: "유발 하라리", genre: "인문", year: 2015, pages: 636, rating: 9, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "인류의 역사를 인지혁명, 농업혁명, 과학혁명으로 나누어 통찰력 있게 설명한다.", reason: "인류 역사에 대한 시야를 넓혀주는 21세기 필독서입니다." },
  { title: "총, 균, 쇠", author: "재레드 다이아몬드", genre: "역사", year: 1998, pages: 752, rating: 9, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "환경적 요인이 인류 문명의 발전에 어떤 영향을 미쳤는지 탐구한다.", reason: "문명 발전의 근본 원인을 이해할 수 있는 명저입니다." },
  { title: "어린 왕자", author: "생텍쥐페리", genre: "소설", year: 1943, pages: 120, rating: 10, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "잠들기 전", "힐링", "여행 중"], ages: ["10대", "20대", "30대", "40대", "50대 이상"], description: "사막에 불시착한 조종사와 소행성에서 온 어린 왕자의 만남.", reason: "나이와 관계없이 읽을 때마다 새로운 깨달음을 주는 영원한 고전입니다." },
  { title: "데미안", author: "헤르만 헤세", genre: "소설", year: 1919, pages: 200, rating: 9, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["10대", "20대", "30대"], description: "싱클레어의 자아 찾기 여정을 그린 헤세의 대표작.", reason: "자아 정체성을 탐구하는 청춘 시기에 꼭 읽어야 할 고전입니다." },
  { title: "노인과 바다", author: "어니스트 헤밍웨이", genre: "소설", year: 1952, pages: 128, rating: 9, level: "가벼운 읽기", moods: ["동기부여", "힐링", "여행 중"], ages: ["20대", "30대", "40대", "50대 이상"], description: "84일간 물고기를 잡지 못한 노인이 거대한 청새치와 사투를 벌이는 이야기.", reason: "인간 의지의 위대함을 보여주는 노벨문학상 수상작입니다." },
  { title: "1984", author: "조지 오웰", genre: "소설", year: 1949, pages: 368, rating: 9, level: "보통", moods: ["지식 습득", "재미"], ages: ["20대", "30대", "40대"], description: "전체주의 사회를 배경으로 한 디스토피아 소설의 고전.", reason: "현대 사회를 비판적으로 바라보는 눈을 길러줍니다." },
  { title: "멋진 신세계", author: "올더스 헉슬리", genre: "소설", year: 1932, pages: 304, rating: 8, level: "보통", moods: ["지식 습득", "재미"], ages: ["20대", "30대", "40대"], description: "쾌락과 안정이 지배하는 미래 사회를 그린 디스토피아 소설.", reason: "기술 발전과 자유의 관계에 대해 생각하게 만듭니다." },
  { title: "이방인", author: "알베르 카뮈", genre: "소설", year: 1942, pages: 160, rating: 9, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "어머니의 장례식에서도 눈물을 흘리지 않는 뫼르소의 이야기.", reason: "부조리 문학의 걸작으로, 존재의 의미를 탐구합니다." },
  { title: "앵무새 죽이기", author: "하퍼 리", genre: "소설", year: 1960, pages: 384, rating: 9, level: "보통", moods: ["지식 습득", "위로받고 싶을 때"], ages: ["10대", "20대", "30대", "40대"], description: "인종차별이 만연한 미국 남부를 배경으로 정의와 양심에 대해 이야기한다.", reason: "정의와 용기에 대해 생각하게 만드는 퓰리처상 수상작입니다." },
  { title: "해리 포터와 마법사의 돌", author: "J.K. 롤링", genre: "소설", year: 1997, pages: 328, rating: 9, level: "가벼운 읽기", moods: ["재미", "잠들기 전", "힐링", "여행 중"], ages: ["10대", "20대", "30대", "40대"], description: "고아 소년 해리 포터가 마법 세계에 입문하며 벌어지는 모험.", reason: "전 세계를 사로잡은 판타지의 시작, 순수한 즐거움을 줍니다." },
  { title: "나미야 잡화점의 기적", author: "히가시노 게이고", genre: "소설", year: 2012, pages: 392, rating: 9, level: "보통", moods: ["위로받고 싶을 때", "힐링", "잠들기 전"], ages: ["10대", "20대", "30대", "40대"], description: "시간을 초월해 고민을 해결해주는 잡화점의 감동 이야기.", reason: "따뜻한 감동과 절묘한 이야기 구조가 돋보이는 명작입니다." },
  { title: "호밀밭의 파수꾼", author: "J.D. 샐린저", genre: "소설", year: 1951, pages: 240, rating: 8, level: "보통", moods: ["위로받고 싶을 때", "재미"], ages: ["10대", "20대"], description: "학교를 퇴학당한 16세 홀든의 뉴욕 방황기.", reason: "청춘의 방황과 성장통을 공감할 수 있는 고전입니다." },
  { title: "위대한 개츠비", author: "F. 스콧 피츠제럴드", genre: "소설", year: 1925, pages: 224, rating: 8, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대", "40대"], description: "1920년대 미국의 화려함 속에 숨겨진 사랑과 꿈의 이야기.", reason: "아메리칸 드림의 허상을 아름답게 그린 걸작입니다." },
  { title: "백년의 고독", author: "가브리엘 마르케스", genre: "소설", year: 1967, pages: 512, rating: 9, level: "깊은 읽기", moods: ["지식 습득"], ages: ["30대", "40대", "50대 이상"], description: "부엔디아 가문 7대에 걸친 이야기를 마술적 사실주의로 그린 대작.", reason: "라틴아메리카 문학의 정수이자 노벨문학상 수상작입니다." },
  { title: "참을 수 없는 존재의 가벼움", author: "밀란 쿤데라", genre: "소설", year: 1984, pages: 408, rating: 8, level: "깊은 읽기", moods: ["지식 습득"], ages: ["30대", "40대", "50대 이상"], description: "프라하의 봄을 배경으로 사랑과 존재의 의미를 탐구하는 철학 소설.", reason: "존재와 자유에 대한 깊은 사유를 자극하는 작품입니다." },
  { title: "동물농장", author: "조지 오웰", genre: "소설", year: 1945, pages: 152, rating: 8, level: "가벼운 읽기", moods: ["재미", "지식 습득"], ages: ["10대", "20대", "30대", "40대"], description: "동물들이 농장을 차지한 뒤 벌어지는 권력의 부패를 그린 우화.", reason: "권력과 정치에 대한 날카로운 풍자를 담은 필독 고전입니다." },
  { title: "코스모스", author: "칼 세이건", genre: "과학", year: 1980, pages: 480, rating: 9, level: "보통", moods: ["지식 습득", "힐링"], ages: ["10대", "20대", "30대", "40대", "50대 이상"], description: "우주의 탄생부터 인류 문명까지 과학의 경이로움을 전하는 교양서.", reason: "우주에 대한 경외감과 과학적 호기심을 불러일으킵니다." },
  { title: "호모 데우스", author: "유발 하라리", genre: "인문", year: 2017, pages: 584, rating: 8, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "인류의 미래를 기술, 종교, 인문의 관점에서 전망하는 책.", reason: "사피엔스의 후속작으로 인류의 미래를 조망합니다." },
  { title: "이기적 유전자", author: "리처드 도킨스", genre: "과학", year: 1976, pages: 416, rating: 9, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "유전자의 관점에서 생물의 행동과 진화를 설명하는 혁명적 과학서.", reason: "생명의 본질에 대한 이해를 완전히 바꿔주는 과학 고전입니다." },
  { title: "정의란 무엇인가", author: "마이클 샌델", genre: "인문", year: 2010, pages: 404, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["10대", "20대", "30대", "40대"], description: "하버드대 교수의 정의에 대한 철학적 탐구.", reason: "공정과 정의에 대해 깊이 생각해볼 수 있는 인문학 필독서입니다." },
  { title: "생각의 지도", author: "리처드 니스벳", genre: "심리", year: 2003, pages: 308, rating: 7, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "동양과 서양의 사고방식 차이를 과학적으로 분석한 책.", reason: "문화적 차이에 대한 이해를 넓혀주는 흥미로운 심리학 서적입니다." },
  { title: "싱크 어게인", author: "애덤 그랜트", genre: "심리", year: 2021, pages: 368, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "다시 생각하는 힘, 유연한 사고의 중요성을 강조하는 책.", reason: "기존 관념에서 벗어나 유연하게 사고하는 법을 알려줍니다." },

  // ── Psychology / Mind ──
  { title: "넛지", author: "리처드 탈러", genre: "심리", year: 2008, pages: 416, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "작은 개입으로 더 나은 선택을 이끌어내는 행동경제학의 원리.", reason: "일상의 의사결정을 개선하는 실용적 통찰을 줍니다." },
  { title: "마음의 탄생", author: "레이 커즈와일", genre: "과학", year: 2012, pages: 408, rating: 7, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "인간 뇌의 작동 원리와 인공지능의 미래를 탐구하는 책.", reason: "AI와 뇌과학에 관심 있는 분에게 추천하는 미래 과학서입니다." },
  { title: "빠르게 생각하고 느리게 생각하라", author: "대니얼 카너먼", genre: "심리", year: 2011, pages: 568, rating: 9, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "인간 사고의 두 시스템과 판단의 오류를 밝힌 노벨 경제학상 수상자의 역작.", reason: "의사결정의 심리학을 이해하는 데 최고의 책입니다." },
  { title: "나는 왜 너를 사랑하는가", author: "알랭 드 보통", genre: "에세이", year: 1993, pages: 256, rating: 7, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "힐링", "잠들기 전"], ages: ["20대", "30대"], description: "사랑의 시작부터 끝까지를 철학적으로 탐구하는 에세이.", reason: "사랑에 대한 깊은 통찰을 유머와 함께 전하는 에세이입니다." },
  { title: "긱이 되는 법", author: "마이크 왈시", genre: "경제경영", year: 2019, pages: 288, rating: 7, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "알고리즘 시대에 살아남기 위한 사고법과 전략.", reason: "디지털 시대에 적응하는 법을 알려주는 실용적인 안내서입니다." },

  // ── History ──
  { title: "역사의 쓸모", author: "최태성", genre: "역사", year: 2019, pages: 280, rating: 7, level: "가벼운 읽기", moods: ["지식 습득", "동기부여"], ages: ["10대", "20대", "30대", "40대"], description: "역사 강사 최태성이 역사에서 배우는 삶의 지혜를 이야기한다.", reason: "역사를 재미있게 배우며 인생의 통찰을 얻을 수 있습니다." },
  { title: "설민석의 한국사 대모험", author: "설민석", genre: "역사", year: 2017, pages: 200, rating: 7, level: "가벼운 읽기", moods: ["재미", "지식 습득"], ages: ["10대"], description: "만화로 쉽게 배우는 한국사 이야기.", reason: "한국사를 재미있게 입문할 수 있는 학습 만화입니다." },
  { title: "칭기즈 칸의 제국", author: "잭 웨더포드", genre: "역사", year: 2004, pages: 432, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "칭기즈 칸과 몽골 제국이 세계사에 미친 영향을 재조명한다.", reason: "세계 역사를 새로운 시각에서 바라볼 수 있게 해줍니다." },

  // ── Travel ──
  { title: "여행의 이유", author: "김영하", genre: "여행", year: 2019, pages: 224, rating: 8, level: "가벼운 읽기", moods: ["여행 중", "힐링"], ages: ["20대", "30대", "40대"], description: "작가 김영하가 여행을 통해 발견한 삶의 의미에 대한 에세이.", reason: "여행의 본질과 의미를 깊이 생각하게 만드는 에세이입니다." },
  { title: "나의 문화유산답사기", author: "유홍준", genre: "여행", year: 1993, pages: 360, rating: 8, level: "보통", moods: ["여행 중", "지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "한국의 문화유산을 답사하며 그 의미와 아름다움을 전하는 책.", reason: "한국 문화유산에 대한 이해를 높이는 교양 필독서입니다." },
  { title: "1년째 세계일주 중", author: "꿈꾸는여우", genre: "여행", year: 2016, pages: 312, rating: 7, level: "가벼운 읽기", moods: ["여행 중", "힐링", "동기부여"], ages: ["20대", "30대"], description: "1년간의 세계일주 경험을 담은 여행 에세이.", reason: "세계 여행에 대한 꿈과 용기를 주는 책입니다." },

  // ── Science ──
  { title: "오리진", author: "루이스 다트넬", genre: "과학", year: 2019, pages: 456, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "지구의 물리적 환경이 인류 역사에 미친 영향을 탐구한다.", reason: "지구과학과 인류 역사의 연결고리를 흥미롭게 풀어냅니다." },
  { title: "시간은 흐르지 않는다", author: "카를로 로벨리", genre: "과학", year: 2018, pages: 228, rating: 8, level: "보통", moods: ["지식 습득", "힐링"], ages: ["20대", "30대", "40대"], description: "물리학자가 시간의 본질에 대해 이야기하는 과학 에세이.", reason: "시간에 대한 기존 관념을 뒤집는 매혹적인 과학서입니다." },
  { title: "팩트풀니스", author: "한스 로슬링", genre: "과학", year: 2018, pages: 392, rating: 9, level: "보통", moods: ["지식 습득", "동기부여"], ages: ["10대", "20대", "30대", "40대", "50대 이상"], description: "데이터를 기반으로 세상을 올바르게 보는 방법을 알려주는 책.", reason: "편견 없이 세상을 바라보는 눈을 길러주는 필독서입니다." },
  { title: "엘레강스", author: "이안 스튜어트", genre: "과학", year: 2007, pages: 340, rating: 7, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "수학의 아름다움과 우아한 증명들을 소개하는 교양 수학서.", reason: "수학의 매력을 쉽고 재미있게 전달하는 과학서입니다." },

  // ── Poetry ──
  { title: "서시 외", author: "윤동주", genre: "시", year: 1948, pages: 140, rating: 9, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "힐링", "잠들기 전"], ages: ["10대", "20대", "30대", "40대", "50대 이상"], description: "윤동주의 대표 시집. 서시, 별 헤는 밤 등 한국인이 사랑하는 시 모음.", reason: "한국 시문학의 정수를 만날 수 있는 영원한 고전입니다." },
  { title: "풀꽃", author: "나태주", genre: "시", year: 2015, pages: 128, rating: 8, level: "가벼운 읽기", moods: ["힐링", "잠들기 전", "위로받고 싶을 때"], ages: ["10대", "20대", "30대", "40대", "50대 이상"], description: "자연의 아름다움을 따뜻한 시선으로 노래한 시집.", reason: "짧지만 깊은 울림을 주는 시로 마음이 편안해집니다." },
  { title: "반칙이다", author: "나태주", genre: "시", year: 2018, pages: 148, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["20대", "30대", "40대"], description: "일상의 소소한 순간들을 포착한 감성 시집.", reason: "짧은 시를 통해 잠시 쉬어갈 수 있는 힐링 시집입니다." },

  // ── Cooking ──
  { title: "백종원의 집밥 백선생", author: "백종원", genre: "요리", year: 2015, pages: 320, rating: 8, level: "가벼운 읽기", moods: ["힐링", "재미"], ages: ["20대", "30대", "40대", "50대 이상"], description: "백종원이 알려주는 쉽고 맛있는 집밥 레시피 모음.", reason: "요리 초보도 따라하기 쉬운 실용적인 레시피북입니다." },
  { title: "오늘의 커피 한 잔", author: "이동진", genre: "요리", year: 2020, pages: 256, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["20대", "30대", "40대"], description: "커피와 함께하는 일상의 소소한 이야기와 커피 지식.", reason: "커피를 좋아하는 분에게 힐링이 되는 에세이입니다." },

  // ── Comics / Manga ──
  { title: "유미의 세포들", author: "이동건", genre: "만화", year: 2015, pages: 180, rating: 8, level: "가벼운 읽기", moods: ["재미", "힐링", "잠들기 전"], ages: ["10대", "20대", "30대"], description: "머릿속 세포들의 활약으로 유미의 연애와 일상을 그린 웹툰.", reason: "귀여운 캐릭터와 공감 가는 스토리로 웃음과 힐링을 줍니다." },
  { title: "슬램덩크", author: "이노우에 다케히코", genre: "만화", year: 1990, pages: 200, rating: 9, level: "가벼운 읽기", moods: ["동기부여", "재미"], ages: ["10대", "20대", "30대", "40대"], description: "농구 불량소년 강백호의 성장기. 불후의 명작 스포츠 만화.", reason: "열정과 도전의 의미를 일깨워주는 전설적 스포츠 만화입니다." },
  { title: "원피스", author: "오다 에이이치로", genre: "만화", year: 1997, pages: 200, rating: 9, level: "가벼운 읽기", moods: ["재미", "동기부여"], ages: ["10대", "20대", "30대"], description: "해적왕을 꿈꾸는 루피와 동료들의 대모험.", reason: "모험, 우정, 꿈에 대한 이야기로 전 세계를 사로잡은 명작입니다." },
  { title: "나루토", author: "키시모토 마사시", genre: "만화", year: 1999, pages: 200, rating: 8, level: "가벼운 읽기", moods: ["재미", "동기부여"], ages: ["10대", "20대"], description: "호카게를 꿈꾸는 닌자 소년 나루토의 성장기.", reason: "끈기와 우정의 가치를 전하는 인기 만화입니다." },
  { title: "진격의 거인", author: "이사야마 하지메", genre: "만화", year: 2009, pages: 200, rating: 9, level: "보통", moods: ["재미", "지식 습득"], ages: ["10대", "20대", "30대"], description: "거인에 맞서 싸우는 인류의 이야기. 깊은 스토리와 반전이 돋보이는 만화.", reason: "뛰어난 스토리텔링과 철학적 메시지를 담은 걸작 만화입니다." },

  // ── More Self-help & Business ──
  { title: "마시멜로 이야기", author: "호아킨 데 포사다", genre: "자기계발", year: 2005, pages: 168, rating: 7, level: "가벼운 읽기", moods: ["동기부여"], ages: ["10대", "20대"], description: "만족 지연의 힘을 우화로 풀어낸 자기계발 동화.", reason: "인내와 자기 절제의 가치를 쉽게 전달하는 책입니다." },
  { title: "꿈꾸는 다락방", author: "이지성", genre: "자기계발", year: 2007, pages: 264, rating: 7, level: "가벼운 읽기", moods: ["동기부여"], ages: ["10대", "20대", "30대"], description: "생생하게 꿈꾸면 현실이 된다는 메시지를 전하는 자기계발서.", reason: "목표를 설정하고 꿈을 현실로 만드는 방법을 알려줍니다." },
  { title: "린 스타트업", author: "에릭 리스", genre: "경제경영", year: 2012, pages: 340, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "최소 기능 제품(MVP)으로 빠르게 실험하고 학습하는 창업 방법론.", reason: "스타트업과 비즈니스에 관심 있는 분의 필독서입니다." },
  { title: "제로 투 원", author: "피터 틸", genre: "경제경영", year: 2014, pages: 280, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "독점적 혁신을 통해 미래를 만드는 방법을 이야기한다.", reason: "혁신적 사고와 창업 정신을 자극하는 실리콘밸리 필독서입니다." },
  { title: "소프트 스킬", author: "존 소메즈", genre: "자기계발", year: 2015, pages: 470, rating: 7, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대"], description: "개발자를 위한 커리어, 학습, 재무 관리 등 비기술적 역량 가이드.", reason: "개발자의 커리어와 삶 전반에 도움이 되는 실용서입니다." },
  { title: "클루지", author: "게리 마커스", genre: "심리", year: 2008, pages: 280, rating: 7, level: "보통", moods: ["지식 습득", "재미"], ages: ["20대", "30대", "40대"], description: "인간 두뇌의 불완전한 설계를 유머러스하게 파헤친 심리학 서적.", reason: "인간 사고의 한계를 재미있게 이해할 수 있는 심리학 서적입니다." },

  // ── More Literature ──
  { title: "그리스인 조르바", author: "니코스 카잔차키스", genre: "소설", year: 1946, pages: 372, rating: 8, level: "보통", moods: ["동기부여", "힐링", "여행 중"], ages: ["30대", "40대", "50대 이상"], description: "자유로운 영혼 조르바와 지식인의 만남을 그린 소설.", reason: "삶의 열정과 자유의 의미를 깨닫게 해주는 작품입니다." },
  { title: "변신", author: "프란츠 카프카", genre: "소설", year: 1915, pages: 96, rating: 8, level: "가벼운 읽기", moods: ["지식 습득"], ages: ["10대", "20대", "30대", "40대"], description: "어느 날 벌레로 변한 그레고르 잠자의 이야기.", reason: "존재와 소외에 대한 카프카의 대표적 단편입니다." },
  { title: "수레바퀴 아래서", author: "헤르만 헤세", genre: "소설", year: 1906, pages: 208, rating: 8, level: "보통", moods: ["위로받고 싶을 때", "지식 습득"], ages: ["10대", "20대"], description: "신학교 우등생 한스 기벤라트의 비극적 이야기.", reason: "학업 스트레스와 성장의 아픔에 공감할 수 있는 고전입니다." },
  { title: "연금술사", author: "파울로 코엘료", genre: "소설", year: 1988, pages: 224, rating: 8, level: "가벼운 읽기", moods: ["동기부여", "힐링", "여행 중"], ages: ["10대", "20대", "30대", "40대"], description: "양치기 소년 산티아고의 꿈을 찾아 떠나는 여정.", reason: "자신의 꿈을 찾아 떠나는 여정에 영감을 주는 소설입니다." },
  { title: "나무", author: "베르나르 베르베르", genre: "소설", year: 2020, pages: 336, rating: 7, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대", "40대"], description: "나무의 시점에서 바라본 인류와 자연의 관계.", reason: "독특한 시점과 상상력이 돋보이는 베르베르의 소설입니다." },
  { title: "개미", author: "베르나르 베르베르", genre: "소설", year: 1991, pages: 440, rating: 8, level: "보통", moods: ["재미", "지식 습득"], ages: ["10대", "20대", "30대"], description: "개미 세계와 인간 세계가 교차하는 과학 소설.", reason: "과학적 상상력과 철학적 메시지가 결합된 걸작입니다." },
  { title: "밤의 포도밭", author: "요한나 슈피리", genre: "소설", year: 1880, pages: 196, rating: 7, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["10대", "20대"], description: "알프스의 소녀 하이디의 순수한 성장 이야기.", reason: "자연의 아름다움과 순수함을 느낄 수 있는 고전 명작입니다." },
  { title: "가면산장 살인사건", author: "히가시노 게이고", genre: "소설", year: 2017, pages: 340, rating: 8, level: "보통", moods: ["재미"], ages: ["20대", "30대", "40대"], description: "산장에서 벌어지는 밀실 살인 추리극.", reason: "추리소설의 재미를 만끽할 수 있는 히가시노 게이고의 역작입니다." },
  { title: "용의자 X의 헌신", author: "히가시노 게이고", genre: "소설", year: 2005, pages: 352, rating: 9, level: "보통", moods: ["재미", "위로받고 싶을 때"], ages: ["20대", "30대", "40대"], description: "천재 수학자의 완벽한 알리바이와 그 뒤에 숨겨진 사랑 이야기.", reason: "추리의 재미와 깊은 감동을 동시에 선사하는 명작입니다." },
  { title: "나는 고양이로소이다", author: "나쓰메 소세키", genre: "소설", year: 1905, pages: 356, rating: 7, level: "보통", moods: ["재미", "힐링"], ages: ["20대", "30대", "40대"], description: "고양이의 시선으로 인간 사회를 풍자한 일본 문학의 고전.", reason: "유머와 풍자가 넘치는 일본 근대 문학의 명작입니다." },

  // ── Humanities ──
  { title: "라틴어 수업", author: "한동일", genre: "인문", year: 2017, pages: 288, rating: 8, level: "보통", moods: ["위로받고 싶을 때", "힐링", "지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "바티칸 대법원 변호사가 들려주는 라틴어와 삶에 대한 강의.", reason: "언어를 통해 삶의 지혜를 배우는 따뜻한 인문학 에세이입니다." },
  { title: "역사란 무엇인가", author: "E.H. 카", genre: "역사", year: 1961, pages: 280, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "역사의 본질과 역사가의 역할에 대한 고전적 논의.", reason: "역사학의 기본을 다지는 데 필수적인 명저입니다." },
  { title: "군주론", author: "니콜로 마키아벨리", genre: "인문", year: 1532, pages: 176, rating: 8, level: "보통", moods: ["지식 습득", "동기부여"], ages: ["20대", "30대", "40대", "50대 이상"], description: "권력과 리더십에 대한 마키아벨리의 냉철한 분석.", reason: "리더십과 정치 철학의 고전으로, 깊은 사유를 자극합니다." },
  { title: "꽃으로도 때리지 마라", author: "법정", genre: "에세이", year: 1999, pages: 240, rating: 8, level: "가벼운 읽기", moods: ["힐링", "위로받고 싶을 때", "잠들기 전"], ages: ["20대", "30대", "40대", "50대 이상"], description: "법정 스님의 담담하고 깊은 명상 에세이.", reason: "마음의 평화와 삶의 지혜를 주는 영원한 베스트셀러입니다." },
  { title: "무소유", author: "법정", genre: "에세이", year: 1976, pages: 196, rating: 8, level: "가벼운 읽기", moods: ["힐링", "잠들기 전"], ages: ["20대", "30대", "40대", "50대 이상"], description: "법정 스님의 대표 에세이. 소유에서 벗어나 자유로워지는 삶을 이야기한다.", reason: "단순한 삶의 아름다움을 깨닫게 하는 한국 에세이의 고전입니다." },

  // ── More Economics/Business ──
  { title: "부의 인문학", author: "브라운스톤", genre: "경제경영", year: 2020, pages: 316, rating: 7, level: "보통", moods: ["지식 습득", "동기부여"], ages: ["20대", "30대", "40대"], description: "인문학적 관점에서 부의 원리를 탐구하는 책.", reason: "경제와 인문학의 융합으로 부에 대한 시야를 넓혀줍니다." },
  { title: "클린 코드", author: "로버트 C. 마틴", genre: "자기계발", year: 2008, pages: 464, rating: 8, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대"], description: "깨끗한 코드를 작성하는 원칙과 패턴을 다룬 개발자 필독서.", reason: "소프트웨어 개발자라면 반드시 읽어야 할 기술서입니다." },
  { title: "하루 3줄 쓰기의 기적", author: "황수영", genre: "자기계발", year: 2021, pages: 240, rating: 7, level: "가벼운 읽기", moods: ["동기부여", "힐링"], ages: ["20대", "30대", "40대"], description: "매일 3줄 쓰기로 삶을 변화시키는 글쓰기 습관 가이드.", reason: "글쓰기를 통한 자기 성찰의 힘을 일깨워줍니다." },

  // ── More Korean fiction ──
  { title: "아가미", author: "구병모", genre: "소설", year: 2019, pages: 220, rating: 7, level: "보통", moods: ["재미", "지식 습득"], ages: ["20대", "30대"], description: "인어 소녀와 인간 세계의 부딪힘을 그린 한국형 판타지.", reason: "독특한 소재와 사회 비판이 결합된 흥미로운 소설입니다." },
  { title: "피프티 피플", author: "정세랑", genre: "소설", year: 2016, pages: 392, rating: 8, level: "보통", moods: ["힐링", "위로받고 싶을 때"], ages: ["20대", "30대", "40대"], description: "한 종합병원을 배경으로 50명의 인물이 엮이는 이야기.", reason: "다양한 인물들의 삶이 만들어내는 따뜻한 군상극입니다." },
  { title: "구의 증명", author: "최진영", genre: "소설", year: 2015, pages: 184, rating: 8, level: "보통", moods: ["위로받고 싶을 때", "지식 습득"], ages: ["20대", "30대"], description: "떠나간 사람에 대한 기억과 상실의 이야기.", reason: "상실과 기억에 대한 아름다운 문학적 탐구입니다." },
  { title: "밤의 이야기", author: "김숨", genre: "소설", year: 2018, pages: 256, rating: 7, level: "보통", moods: ["잠들기 전", "위로받고 싶을 때"], ages: ["30대", "40대", "50대 이상"], description: "일본군 위안부 피해자의 이야기를 담담하게 풀어낸 소설.", reason: "잊지 말아야 할 역사를 문학으로 기록한 소중한 작품입니다." },

  // ── Additional well-known books ──
  { title: "모모", author: "미하엘 엔데", genre: "소설", year: 1973, pages: 300, rating: 9, level: "가벼운 읽기", moods: ["위로받고 싶을 때", "힐링", "잠들기 전"], ages: ["10대", "20대", "30대", "40대"], description: "시간 도둑에 맞서 싸우는 소녀 모모의 이야기.", reason: "시간의 소중함과 삶의 본질에 대해 생각하게 만드는 명작입니다." },
  { title: "타인의 고통", author: "수전 손택", genre: "인문", year: 2003, pages: 160, rating: 8, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "전쟁 사진과 미디어가 타인의 고통을 어떻게 재현하는지 탐구한다.", reason: "미디어와 공감에 대한 깊은 성찰을 제공하는 인문학 필독서입니다." },
  { title: "지적 대화를 위한 넓고 얕은 지식", author: "채사장", genre: "인문", year: 2014, pages: 376, rating: 7, level: "가벼운 읽기", moods: ["지식 습득", "재미"], ages: ["10대", "20대", "30대"], description: "역사, 경제, 정치, 사회, 윤리의 핵심 지식을 쉽게 정리한 교양서.", reason: "기본 교양 지식을 빠르게 습득할 수 있는 실용적인 인문서입니다." },
  { title: "나를 나답게 만드는 것들", author: "박웅현", genre: "에세이", year: 2018, pages: 240, rating: 7, level: "가벼운 읽기", moods: ["동기부여", "힐링"], ages: ["20대", "30대"], description: "광고인 박웅현이 전하는 창의성과 자기다움에 대한 에세이.", reason: "자기다움을 찾고 창의적으로 사고하는 법을 알려줍니다." },
  { title: "그릿", author: "앤절라 더크워스", genre: "심리", year: 2016, pages: 416, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["10대", "20대", "30대", "40대"], description: "재능보다 노력과 열정이 성공을 결정한다는 것을 과학적으로 증명한다.", reason: "끈기와 열정의 중요성을 과학적으로 이해할 수 있습니다." },
  { title: "멀티플라이어", author: "리즈 와이즈만", genre: "경제경영", year: 2010, pages: 368, rating: 7, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["30대", "40대"], description: "사람들의 능력을 2배로 끌어내는 리더십 원칙.", reason: "리더십의 본질에 대해 새로운 시각을 제공합니다." },
  { title: "설국", author: "가와바타 야스나리", genre: "소설", year: 1948, pages: 176, rating: 8, level: "보통", moods: ["힐링", "잠들기 전"], ages: ["30대", "40대", "50대 이상"], description: "눈 나라를 배경으로 한 아름다운 사랑 이야기. 노벨문학상 수상작.", reason: "일본 문학의 미학을 느낄 수 있는 감성적인 소설입니다." },
  { title: "지구의 정복자", author: "에드워드 윌슨", genre: "과학", year: 2012, pages: 380, rating: 7, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "인류가 지구를 정복할 수 있었던 이유를 진화생물학적으로 탐구한다.", reason: "인류 성공의 비밀을 과학적으로 이해할 수 있는 교양서입니다." },
  { title: "21세기를 위한 21가지 제언", author: "유발 하라리", genre: "인문", year: 2018, pages: 464, rating: 8, level: "깊은 읽기", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "현재 인류가 직면한 21가지 문제에 대한 하라리의 통찰.", reason: "현대 사회의 핵심 이슈를 깊이 있게 이해하는 데 도움을 줍니다." },
  { title: "은밀하게 위대하게", author: "훈", genre: "만화", year: 2010, pages: 180, rating: 7, level: "가벼운 읽기", moods: ["재미", "동기부여"], ages: ["10대", "20대", "30대"], description: "북한 엘리트 간첩이 서울에서 동네 바보로 위장 생활하는 이야기.", reason: "유머와 감동이 넘치는 한국 웹툰의 걸작입니다." },
  { title: "신의 탑", author: "SIU", genre: "만화", year: 2010, pages: 200, rating: 8, level: "가벼운 읽기", moods: ["재미", "동기부여"], ages: ["10대", "20대", "30대"], description: "소녀를 찾아 거대한 탑을 올라가는 소년의 모험 이야기.", reason: "웅장한 세계관과 탄탄한 스토리가 매력적인 웹툰입니다." },
  { title: "나 혼자만 레벨업", author: "추공", genre: "소설", year: 2018, pages: 270, rating: 8, level: "가벼운 읽기", moods: ["재미", "동기부여"], ages: ["10대", "20대", "30대"], description: "최약 랭크 헌터 성진우가 특별한 능력을 얻어 최강이 되어가는 이야기.", reason: "한국 웹소설의 대표작으로 몰입감이 뛰어납니다." },
  { title: "도둑맞은 집중력", author: "요한 하리", genre: "심리", year: 2022, pages: 420, rating: 8, level: "보통", moods: ["지식 습득", "동기부여"], ages: ["20대", "30대", "40대"], description: "현대인의 집중력 위기를 진단하고 회복 방법을 제시하는 책.", reason: "스마트폰 시대에 집중력을 되찾고 싶은 분에게 추천합니다." },
  { title: "인생은 실전이다", author: "이태석", genre: "에세이", year: 2019, pages: 256, rating: 7, level: "가벼운 읽기", moods: ["동기부여"], ages: ["20대", "30대"], description: "현실적인 조언과 경험을 바탕으로 인생을 직시하는 에세이.", reason: "실용적이고 현실적인 삶의 조언을 담은 에세이입니다." },
  { title: "세이노의 가르침", author: "세이노", genre: "자기계발", year: 2023, pages: 736, rating: 8, level: "보통", moods: ["동기부여", "지식 습득"], ages: ["20대", "30대", "40대"], description: "25년간 온라인에서 전해온 삶의 지혜와 부에 대한 통찰을 집대성한 책.", reason: "인생과 돈에 대한 솔직하고 깊은 통찰을 담은 화제의 책입니다." },
  { title: "프레임", author: "최인철", genre: "심리", year: 2007, pages: 320, rating: 8, level: "보통", moods: ["지식 습득", "동기부여"], ages: ["20대", "30대", "40대"], description: "우리가 세상을 바라보는 틀(프레임)이 삶을 어떻게 바꾸는지 설명한다.", reason: "사고의 틀을 바꾸면 세상이 달라진다는 것을 깨닫게 해줍니다." },
  { title: "국화와 칼", author: "루스 베네딕트", genre: "인문", year: 1946, pages: 352, rating: 7, level: "보통", moods: ["지식 습득"], ages: ["20대", "30대", "40대", "50대 이상"], description: "일본 문화와 사회를 분석한 문화인류학의 고전.", reason: "이웃 나라 일본을 이해하는 데 필수적인 인문학 고전입니다." },
];

/* ══════════════════════════════════════════
   Scoring & Recommendation Engine
   ══════════════════════════════════════════ */

function scoreBook(
  book: Book,
  mood: Mood | null,
  genres: Genre[],
  level: ReadingLevel | null,
  pageLength: PageLength | null,
  ageGroup: AgeGroup | null
): number {
  let score = 0;

  // Mood match (highest weight)
  if (mood && book.moods.includes(mood)) score += 30;

  // Genre match
  if (genres.length > 0 && genres.includes(book.genre)) score += 25;

  // Reading level match
  if (level && book.level === level) score += 15;

  // Page length match
  if (pageLength && pageLength !== "상관없음") {
    if (pageLength === "짧은 책(~200p)" && book.pages <= 200) score += 10;
    else if (pageLength === "보통(200~400p)" && book.pages > 200 && book.pages <= 400) score += 10;
    else if (pageLength === "긴 책(400p~)" && book.pages > 400) score += 10;
  }

  // Age group match
  if (ageGroup && book.ages.includes(ageGroup)) score += 10;

  // Rating bonus
  score += book.rating;

  // Small random factor for variety
  score += Math.random() * 3;

  return score;
}

function getStars(rating: number): string {
  const full = Math.floor(rating / 2);
  const half = rating % 2 >= 1 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

const GENRE_COLORS: Record<Genre, string> = {
  "소설": "bg-blue-100 text-blue-700",
  "에세이": "bg-green-100 text-green-700",
  "자기계발": "bg-orange-100 text-orange-700",
  "경제경영": "bg-yellow-100 text-yellow-700",
  "인문": "bg-purple-100 text-purple-700",
  "과학": "bg-cyan-100 text-cyan-700",
  "역사": "bg-amber-100 text-amber-700",
  "심리": "bg-pink-100 text-pink-700",
  "여행": "bg-teal-100 text-teal-700",
  "요리": "bg-red-100 text-red-700",
  "시": "bg-indigo-100 text-indigo-700",
  "만화": "bg-rose-100 text-rose-700",
};

const LEVEL_LABEL: Record<ReadingLevel, { text: string; color: string }> = {
  "가벼운 읽기": { text: "Easy", color: "text-green-600" },
  "보통": { text: "Medium", color: "text-yellow-600" },
  "깊은 읽기": { text: "Deep", color: "text-red-600" },
};

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */

export default function BookRecommendationPage() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [level, setLevel] = useState<ReadingLevel | null>(null);
  const [pageLength, setPageLength] = useState<PageLength | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [results, setResults] = useState<Book[] | null>(null);

  const toggleGenre = useCallback((genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }, []);

  const canRecommend = mood || selectedGenres.length > 0 || level || ageGroup;

  const handleRecommend = useCallback(() => {
    const scored = BOOKS.map((book) => ({
      book,
      score: scoreBook(book, mood, selectedGenres, level, pageLength, ageGroup),
    }));
    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 5).map((s) => s.book));
  }, [mood, selectedGenres, level, pageLength, ageGroup]);

  const handleReset = useCallback(() => {
    setResults(null);
    setMood(null);
    setSelectedGenres([]);
    setLevel(null);
    setPageLength(null);
    setAgeGroup(null);
  }, []);

  const totalBooks = useMemo(() => BOOKS.length, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <span>📚</span> {totalBooks}권의 도서 DB
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          책 추천 도우미
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          기분, 장르, 독서 수준에 맞는 책을 도구가 추천해드립니다
        </p>
      </div>

      {/* Input Form */}
      {!results && (
        <div className="space-y-6">
          {/* Mood */}
          <div className="calc-card p-5">
            <label className="block text-sm font-bold text-gray-800 mb-3">
              📌 지금 기분/상황은?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(mood === m.label ? null : m.label)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    mood === m.label
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre (multi-select) */}
          <div className="calc-card p-5">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              📖 선호 장르 <span className="font-normal text-gray-400">(복수 선택 가능)</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">관심 있는 장르를 골라주세요</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedGenres.includes(g)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Level */}
          <div className="calc-card p-5">
            <label className="block text-sm font-bold text-gray-800 mb-3">
              📏 독서 수준
            </label>
            <div className="flex flex-wrap gap-2">
              {READING_LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(level === l ? null : l)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    level === l
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Page Length */}
          <div className="calc-card p-5">
            <label className="block text-sm font-bold text-gray-800 mb-3">
              📐 원하는 분량
            </label>
            <div className="flex flex-wrap gap-2">
              {PAGE_LENGTHS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPageLength(pageLength === p ? null : p)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    pageLength === p
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="calc-card p-5">
            <label className="block text-sm font-bold text-gray-800 mb-3">
              👤 연령대
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAgeGroup(ageGroup === a ? null : a)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    ageGroup === a
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleRecommend}
            disabled={!canRecommend}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
              canRecommend
                ? "calc-btn-primary w-full"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            📚 맞춤 도서 추천받기
          </button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-fade-in">
          {/* Result Header */}
          <div className="calc-result-header rounded-2xl">
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm mb-1">조건별 맞춤 추천 결과</p>
              <p className="text-2xl font-bold">
                Top 5 도서 추천
              </p>
              <p className="text-indigo-200 text-xs mt-2">
                {mood && `${mood}`}
                {mood && selectedGenres.length > 0 && " / "}
                {selectedGenres.length > 0 && selectedGenres.join(", ")}
                {(mood || selectedGenres.length > 0) && level && " / "}
                {level && level}
              </p>
            </div>
          </div>

          {/* Book Cards */}
          {results.map((book, idx) => (
            <div
              key={book.title}
              className="calc-card p-5"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title & Author */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{book.author}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        GENRE_COLORS[book.genre]
                      }`}
                    >
                      {book.genre}
                    </span>
                    <span className="text-xs text-gray-400">
                      {book.pages}p
                    </span>
                    <span className="text-xs text-yellow-500 font-medium">
                      {getStars(book.rating)} {book.rating}/10
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        LEVEL_LABEL[book.level].color
                      }`}
                    >
                      {LEVEL_LABEL[book.level].text}
                    </span>
                  </div>

                  {/* Recommendation reason */}
                  <div className="bg-indigo-50 rounded-xl px-3.5 py-2.5 mb-2">
                    <p className="text-xs font-semibold text-indigo-700 mb-0.5">
                      🤖 추천 이유
                    </p>
                    <p className="text-sm text-indigo-900">{book.reason}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Retry */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="calc-btn-secondary flex-1"
            >
              처음부터 다시 하기
            </button>
            <button
              onClick={handleRecommend}
              className="calc-btn-primary flex-1"
            >
              🔄 다시 추천받기
            </button>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-12 calc-seo-card">
        <h2 className="calc-seo-title">책 추천 도우미이란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          책 추천 도우미은 사용자의 기분, 선호 장르, 독서 수준, 원하는 분량, 연령대를 종합적으로 분석하여
          가장 적합한 도서를 추천하는 서비스입니다. {totalBooks}권 이상의 한국 베스트셀러와 세계 명작을
          데이터베이스에 보유하고 있으며, 각 도서의 특성을 정밀하게 매칭하여 최적의 읽을거리를 찾아드립니다.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          소설, 에세이, 자기계발, 경제경영, 인문, 과학, 역사, 심리, 여행, 요리, 시, 만화 등
          12개 장르에 걸쳐 다양한 도서를 추천받을 수 있습니다. 위로가 필요할 때, 동기부여가 필요할 때,
          새로운 지식을 습득하고 싶을 때, 혹은 단순히 재미있는 책을 찾고 있을 때 등 다양한 상황에
          맞는 책을 찾아보세요.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          추천 결과가 마음에 들지 않으면 &quot;다시 추천받기&quot; 버튼을 눌러 새로운 추천을 받을 수 있습니다.
          동일한 조건이라도 매번 약간씩 다른 결과가 나오므로 여러 번 시도해보세요.
        </p>
      </div>

      <RelatedTools current="book-recommendation" />
    </div>
  );
}
