"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
interface Choice {
  text: string;
  /** category key for personality/love tests, or numeric score for stress */
  value: string | number;
}

interface Question {
  question: string;
  choices: Choice[];
}

interface PersonalityResult {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  jobs: string[];
}

interface StressLevel {
  min: number;
  max: number;
  name: string;
  emoji: string;
  description: string;
  advice: string;
}

interface TestDef {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string; // tailwind color key
  questions: Question[];
  type: "category" | "score";
  results?: Record<string, PersonalityResult>;
  levels?: StressLevel[];
}

/* ─── Test 1: 성격 유형 ─── */
const personalityTest: TestDef = {
  id: "personality",
  title: "나의 성격 유형은?",
  emoji: "\uD83E\uDDE0",
  description: "10개의 질문으로 알아보는 나의 진짜 성격 유형",
  color: "purple",
  type: "category",
  questions: [
    {
      question: "주말에 가장 하고 싶은 것은?",
      choices: [
        { text: "집에서 혼자 쉬기", value: "introvert" },
        { text: "친구들과 만나기", value: "extrovert" },
        { text: "새로운 곳 탐험하기", value: "adventurer" },
        { text: "계획 세우고 정리하기", value: "planner" },
      ],
    },
    {
      question: "갈등 상황에서 나는?",
      choices: [
        { text: "일단 피하고 본다", value: "introvert" },
        { text: "대화로 해결하려 한다", value: "extrovert" },
        { text: "감정을 솔직히 표현한다", value: "adventurer" },
        { text: "논리적으로 설명한다", value: "planner" },
      ],
    },
    {
      question: "친구들 사이에서 나의 역할은?",
      choices: [
        { text: "조용히 듣는 편", value: "introvert" },
        { text: "분위기 메이커", value: "extrovert" },
        { text: "새로운 아이디어 제안자", value: "adventurer" },
        { text: "일정 정리 담당", value: "planner" },
      ],
    },
    {
      question: "스트레스를 받으면?",
      choices: [
        { text: "혼자만의 시간이 필요하다", value: "introvert" },
        { text: "누군가와 이야기한다", value: "extrovert" },
        { text: "운동이나 여행으로 푼다", value: "adventurer" },
        { text: "리스트 만들고 하나씩 해결", value: "planner" },
      ],
    },
    {
      question: "새로운 사람을 만나면?",
      choices: [
        { text: "어색하고 긴장된다", value: "introvert" },
        { text: "먼저 말을 건다", value: "extrovert" },
        { text: "호기심이 생긴다", value: "adventurer" },
        { text: "관찰부터 한다", value: "planner" },
      ],
    },
    {
      question: "여행 스타일은?",
      choices: [
        { text: "조용한 곳에서 힐링", value: "introvert" },
        { text: "현지인과 어울리기", value: "extrovert" },
        { text: "모험 액티비티 도전", value: "adventurer" },
        { text: "완벽한 일정 짜기", value: "planner" },
      ],
    },
    {
      question: "결정을 내릴 때 나는?",
      choices: [
        { text: "충분히 고민한 후 결정", value: "introvert" },
        { text: "주변 의견을 물어본다", value: "extrovert" },
        { text: "직감을 따른다", value: "adventurer" },
        { text: "장단점을 분석한다", value: "planner" },
      ],
    },
    {
      question: "이상적인 직장 환경은?",
      choices: [
        { text: "독립적으로 일하는 곳", value: "introvert" },
        { text: "팀 활동이 많은 곳", value: "extrovert" },
        { text: "자유롭고 창의적인 곳", value: "adventurer" },
        { text: "체계적이고 안정적인 곳", value: "planner" },
      ],
    },
    {
      question: "선물을 고를 때?",
      choices: [
        { text: "상대방 취향을 오래 고민", value: "introvert" },
        { text: "같이 쇼핑하며 고른다", value: "extrovert" },
        { text: "특이하고 독특한 것", value: "adventurer" },
        { text: "실용적인 것 위주", value: "planner" },
      ],
    },
    {
      question: "나를 한 단어로 표현하면?",
      choices: [
        { text: "신중", value: "introvert" },
        { text: "활발", value: "extrovert" },
        { text: "자유", value: "adventurer" },
        { text: "체계", value: "planner" },
      ],
    },
  ],
  results: {
    introvert: {
      name: "사색하는 고양이형",
      emoji: "\uD83D\uDC31",
      description:
        "혼자만의 시간에서 에너지를 충전하는 당신! 깊이 있는 사고와 섬세한 감성의 소유자입니다. 소수의 깊은 관계를 소중히 여기며, 내면의 세계가 풍부합니다.",
      strengths: ["깊은 사고력", "섬세한 관찰력", "신중한 판단", "높은 집중력"],
      weaknesses: [
        "새로운 환경 적응이 느림",
        "자기 표현이 서투름",
        "과도한 걱정",
      ],
      jobs: ["작가", "연구원", "프로그래머", "디자이너", "분석가"],
    },
    extrovert: {
      name: "신나는 강아지형",
      emoji: "\uD83D\uDC36",
      description:
        "사람들과 함께할 때 빛나는 당신! 밝은 에너지로 주변을 즐겁게 만드는 분위기 메이커입니다. 넓은 인맥과 뛰어난 소통 능력이 강점이에요.",
      strengths: [
        "뛰어난 사교성",
        "긍정적 에너지",
        "리더십",
        "빠른 환경 적응",
      ],
      weaknesses: ["혼자 있는 시간을 힘들어함", "깊이 부족할 수 있음", "충동적"],
      jobs: ["영업직", "마케터", "교사", "방송인", "이벤트 기획자"],
    },
    adventurer: {
      name: "탐험하는 여우형",
      emoji: "\uD83E\uDD8A",
      description:
        "호기심이 넘치고 새로운 것을 좋아하는 당신! 틀에 박힌 것을 싫어하고 자유로운 영혼의 소유자입니다. 창의적 아이디어가 샘솟는 타입이에요.",
      strengths: [
        "뛰어난 창의력",
        "높은 적응력",
        "용기와 도전정신",
        "유연한 사고",
      ],
      weaknesses: ["인내심 부족", "계획성 부족", "한 가지에 집중 어려움"],
      jobs: ["아티스트", "여행 작가", "스타트업 창업자", "사진작가", "탐험가"],
    },
    planner: {
      name: "꼼꼼한 부엉이형",
      emoji: "\uD83E\uDD89",
      description:
        "체계적이고 논리적인 당신! 계획을 세우고 실행하는 데 탁월한 능력을 발휘합니다. 안정적이고 신뢰할 수 있는 사람으로, 맡은 일을 완벽히 해냅니다.",
      strengths: [
        "뛰어난 계획성",
        "논리적 사고",
        "책임감",
        "꼼꼼함과 정확성",
      ],
      weaknesses: [
        "지나친 완벽주의",
        "변화에 대한 불안",
        "융통성 부족할 수 있음",
      ],
      jobs: ["회계사", "프로젝트 매니저", "법률가", "엔지니어", "데이터 분석가"],
    },
  },
};

/* ─── Test 2: 연애 스타일 ─── */
const loveTest: TestDef = {
  id: "love",
  title: "나의 연애 스타일은?",
  emoji: "\uD83D\uDC98",
  description: "8개의 질문으로 알아보는 나의 연애 패턴",
  color: "pink",
  type: "category",
  questions: [
    {
      question: "좋아하는 사람이 생기면?",
      choices: [
        { text: "먼저 적극적으로 다가간다", value: "passionate" },
        { text: "자연스럽게 친해지길 기다린다", value: "steady" },
        { text: "친구들에게 먼저 물어본다", value: "friendly" },
        { text: "혼자 상상하며 즐긴다", value: "dreamer" },
      ],
    },
    {
      question: "연인과의 데이트 코스는?",
      choices: [
        { text: "로맨틱한 분위기의 레스토랑", value: "passionate" },
        { text: "집에서 영화 보며 쉬기", value: "steady" },
        { text: "친구들과 함께하는 모임", value: "friendly" },
        { text: "전시회나 특별한 장소", value: "dreamer" },
      ],
    },
    {
      question: "연인에게 서운할 때?",
      choices: [
        { text: "바로 이야기한다", value: "passionate" },
        { text: "시간을 두고 차분히 말한다", value: "steady" },
        { text: "유머로 넘기려 한다", value: "friendly" },
        { text: "일기나 메모에 적는다", value: "dreamer" },
      ],
    },
    {
      question: "사랑 표현 방식은?",
      choices: [
        { text: "\"사랑해\" 자주 말하기", value: "passionate" },
        { text: "행동으로 보여주기", value: "steady" },
        { text: "같이 재밌는 일 하기", value: "friendly" },
        { text: "편지나 글로 표현하기", value: "dreamer" },
      ],
    },
    {
      question: "이상형의 조건 1순위는?",
      choices: [
        { text: "외모와 매력", value: "passionate" },
        { text: "성실함과 안정감", value: "steady" },
        { text: "유머 감각", value: "friendly" },
        { text: "지적 대화가 통하는 사람", value: "dreamer" },
      ],
    },
    {
      question: "연인의 SNS에 다른 이성이 자주 등장하면?",
      choices: [
        { text: "직접 물어본다", value: "passionate" },
        { text: "믿고 넘어간다", value: "steady" },
        { text: "장난스럽게 질투한다", value: "friendly" },
        { text: "속으로 생각이 많아진다", value: "dreamer" },
      ],
    },
    {
      question: "기념일에 대한 생각은?",
      choices: [
        { text: "서프라이즈 이벤트 준비!", value: "passionate" },
        { text: "소소하지만 의미 있게", value: "steady" },
        { text: "함께 웃을 수 있으면 OK", value: "friendly" },
        { text: "특별한 편지를 쓴다", value: "dreamer" },
      ],
    },
    {
      question: "이별 후 나는?",
      choices: [
        { text: "금방 새 연애를 시작한다", value: "passionate" },
        { text: "오래 마음 정리를 한다", value: "steady" },
        { text: "친구들과 놀며 잊는다", value: "friendly" },
        { text: "혼자 음악 듣며 감성에 젖는다", value: "dreamer" },
      ],
    },
  ],
  results: {
    passionate: {
      name: "불꽃 연애파",
      emoji: "\uD83D\uDD25",
      description:
        "사랑에 올인하는 뜨거운 연애 스타일! 감정 표현이 풍부하고 적극적인 당신은 연애의 설렘과 열정을 가장 중요하게 생각합니다.",
      strengths: [
        "적극적 애정 표현",
        "로맨틱한 감성",
        "결단력 있는 행동",
        "열정적인 사랑",
      ],
      weaknesses: ["질투심", "감정 기복", "빠른 싫증"],
      jobs: [],
    },
    steady: {
      name: "안정 추구파",
      emoji: "\uD83C\uDF3F",
      description:
        "천천히 깊어지는 사랑을 추구하는 당신! 신뢰와 안정감을 기반으로 오래 가는 관계를 만들어갑니다. 말보다 행동으로 사랑을 보여주는 타입이에요.",
      strengths: [
        "높은 신뢰감",
        "일관된 애정",
        "성숙한 태도",
        "장기 연애에 강함",
      ],
      weaknesses: ["표현 부족", "변화를 꺼림", "쉽게 마음을 열지 않음"],
      jobs: [],
    },
    friendly: {
      name: "친구같은 연인파",
      emoji: "\uD83E\uDD1D",
      description:
        "연인이자 가장 친한 친구! 함께 웃고 즐기는 것이 사랑의 핵심이라 생각하는 당신. 유쾌하고 편안한 분위기를 만드는 데 천부적 재능이 있어요.",
      strengths: [
        "유머 감각",
        "편안한 분위기",
        "사회성",
        "갈등 해소 능력",
      ],
      weaknesses: ["진지한 대화 회피", "깊은 감정 표현 서투름", "경계가 모호함"],
      jobs: [],
    },
    dreamer: {
      name: "감성 몽상가파",
      emoji: "\uD83C\uDF19",
      description:
        "풍부한 감성과 상상력의 소유자! 아름다운 사랑 이야기를 꿈꾸는 로맨티스트입니다. 글이나 음악으로 마음을 표현하는 섬세한 연애를 합니다.",
      strengths: [
        "섬세한 감성",
        "깊은 이해력",
        "창의적 표현",
        "진심 어린 사랑",
      ],
      weaknesses: ["현실과 이상의 괴리", "과도한 기대", "의사소통 어려움"],
      jobs: [],
    },
  },
};

/* ─── Test 3: 스트레스 지수 ─── */
const stressTest: TestDef = {
  id: "stress",
  title: "나의 스트레스 지수는?",
  emoji: "\uD83D\uDCA5",
  description: "8개의 질문으로 측정하는 현재 스트레스 수준",
  color: "orange",
  type: "score",
  questions: [
    {
      question: "최근 잠들기까지 걸리는 시간은?",
      choices: [
        { text: "바로 잠든다", value: 1 },
        { text: "10~20분 정도", value: 2 },
        { text: "30분 이상 걸린다", value: 3 },
        { text: "1시간 넘게 뒤척인다", value: 4 },
      ],
    },
    {
      question: "일주일에 짜증이 나는 횟수는?",
      choices: [
        { text: "거의 없다", value: 1 },
        { text: "1~2번 정도", value: 2 },
        { text: "3~4번 정도", value: 3 },
        { text: "거의 매일", value: 4 },
      ],
    },
    {
      question: "식욕 변화가 있나요?",
      choices: [
        { text: "평소와 같다", value: 1 },
        { text: "약간 변했다", value: 2 },
        { text: "많이 먹거나 안 먹게 됐다", value: 3 },
        { text: "식사를 자주 거른다", value: 4 },
      ],
    },
    {
      question: "집중력은 어떤가요?",
      choices: [
        { text: "잘 집중할 수 있다", value: 1 },
        { text: "가끔 산만해진다", value: 2 },
        { text: "집중하기 어렵다", value: 3 },
        { text: "거의 집중을 못한다", value: 4 },
      ],
    },
    {
      question: "주변 사람들과의 관계는?",
      choices: [
        { text: "원만하다", value: 1 },
        { text: "가끔 갈등이 있다", value: 2 },
        { text: "자주 부딪힌다", value: 3 },
        { text: "만나기 싫을 때가 많다", value: 4 },
      ],
    },
    {
      question: "자신에 대한 만족도는?",
      choices: [
        { text: "대체로 만족한다", value: 1 },
        { text: "보통이다", value: 2 },
        { text: "불만족스럽다", value: 3 },
        { text: "자존감이 매우 낮다", value: 4 },
      ],
    },
    {
      question: "몸의 피로감은?",
      choices: [
        { text: "활력이 넘친다", value: 1 },
        { text: "약간 피곤하다", value: 2 },
        { text: "자주 피곤하다", value: 3 },
        { text: "항상 지쳐있다", value: 4 },
      ],
    },
    {
      question: "미래에 대한 생각은?",
      choices: [
        { text: "기대되고 설렌다", value: 1 },
        { text: "보통이다", value: 2 },
        { text: "불안하다", value: 3 },
        { text: "막막하고 두렵다", value: 4 },
      ],
    },
  ],
  levels: [
    {
      min: 8,
      max: 12,
      name: "평온한 상태",
      emoji: "\uD83D\uDE0A",
      description:
        "현재 스트레스가 거의 없는 안정적인 상태입니다! 현재의 생활 패턴을 유지하면서 가끔 자신에게 소소한 보상을 주세요.",
      advice:
        "지금처럼 건강한 생활을 유지하세요. 규칙적인 운동과 취미 활동이 도움이 됩니다.",
    },
    {
      min: 13,
      max: 19,
      name: "가벼운 스트레스",
      emoji: "\uD83D\uDE10",
      description:
        "약간의 스트레스가 있지만 일상에 큰 영향은 없는 수준입니다. 적절한 휴식과 취미 활동으로 관리할 수 있어요.",
      advice:
        "충분한 수면과 가벼운 운동을 추천합니다. 좋아하는 음악을 듣거나 산책을 해보세요.",
    },
    {
      min: 20,
      max: 26,
      name: "주의 필요 스트레스",
      emoji: "\uD83D\uDE1F",
      description:
        "상당한 스트레스를 받고 있는 상태입니다. 일상에 영향을 줄 수 있으니 적극적인 관리가 필요해요.",
      advice:
        "신뢰할 수 있는 사람과 이야기를 나누세요. 명상, 요가 등 이완 기법을 시도해보는 것도 좋습니다.",
    },
    {
      min: 27,
      max: 32,
      name: "높은 스트레스",
      emoji: "\uD83D\uDE30",
      description:
        "매우 높은 스트레스 상태입니다. 심신의 건강에 영향을 줄 수 있으니 전문적인 도움을 받는 것을 고려해보세요.",
      advice:
        "전문 상담사나 심리 상담 서비스를 이용해보세요. 무리하지 말고 충분한 휴식을 취하는 것이 중요합니다.",
    },
  ],
};

const allTests = [personalityTest, loveTest, stressTest];

/* ─── Component ─── */
type Phase = "select" | "testing" | "result";

export default function PsychologyTestPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [currentTest, setCurrentTest] = useState<TestDef | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);

  const startTest = (test: TestDef) => {
    setCurrentTest(test);
    setCurrentQ(0);
    setAnswers([]);
    setPhase("testing");
  };

  const selectAnswer = (value: string | number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentTest && currentQ + 1 < currentTest.questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("result");
    }
  };

  const resetToSelect = () => {
    setPhase("select");
    setCurrentTest(null);
    setCurrentQ(0);
    setAnswers([]);
  };

  const retryTest = () => {
    if (currentTest) startTest(currentTest);
  };

  /* ─── Compute result ─── */
  const getCategoryResult = (): PersonalityResult | null => {
    if (!currentTest || !currentTest.results) return null;
    const counts: Record<string, number> = {};
    for (const a of answers) {
      const key = a as string;
      counts[key] = (counts[key] || 0) + 1;
    }
    let maxKey = "";
    let maxVal = 0;
    for (const [k, v] of Object.entries(counts)) {
      if (v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    }
    return currentTest.results[maxKey] || null;
  };

  const getScoreResult = (): StressLevel | null => {
    if (!currentTest || !currentTest.levels) return null;
    const total = answers.reduce((s: number, a) => s + Number(a), 0);
    return (
      currentTest.levels.find((l) => total >= l.min && total <= l.max) ||
      currentTest.levels[currentTest.levels.length - 1]
    );
  };

  const getScoreTotal = (): number =>
    answers.reduce((s: number, a) => s + Number(a), 0);

  /* ─── color helpers ─── */
  const colorMap: Record<string, { bg: string; border: string; text: string; light: string; button: string; hover: string }> = {
    purple: {
      bg: "bg-purple-500",
      border: "border-purple-300",
      text: "text-purple-600",
      light: "bg-purple-50",
      button: "bg-purple-500",
      hover: "hover:bg-purple-600",
    },
    pink: {
      bg: "bg-pink-500",
      border: "border-pink-300",
      text: "text-pink-600",
      light: "bg-pink-50",
      button: "bg-pink-500",
      hover: "hover:bg-pink-600",
    },
    orange: {
      bg: "bg-orange-500",
      border: "border-orange-300",
      text: "text-orange-600",
      light: "bg-orange-50",
      button: "bg-orange-500",
      hover: "hover:bg-orange-600",
    },
  };

  const c = currentTest ? colorMap[currentTest.color] : colorMap.purple;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        <span>&#x1F52E;</span> 심리테스트
      </h1>
      <p className="text-gray-500 mb-8">
        재미있는 심리테스트로 나의 성격, 연애 스타일, 스트레스 수준을 알아보세요.
      </p>

      {/* ─── Phase: 테스트 선택 ─── */}
      {phase === "select" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {allTests.map((test) => {
            const tc = colorMap[test.color];
            return (
              <button
                key={test.id}
                onClick={() => startTest(test)}
                className={`text-left bg-white rounded-xl border-2 ${tc.border} p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-4xl mb-3">{test.emoji}</div>
                <h2 className={`text-lg font-bold ${tc.text} mb-2`}>
                  {test.title}
                </h2>
                <p className="text-sm text-gray-500">{test.description}</p>
                <p className="text-xs text-gray-400 mt-3">
                  {test.questions.length}문항
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* ─── Phase: 테스트 진행 ─── */}
      {phase === "testing" && currentTest && (
        <div className="max-w-xl mx-auto">
          {/* 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{currentTest.title}</span>
              <span>
                {currentQ + 1} / {currentTest.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${c.bg} h-3 rounded-full transition-all duration-500`}
                style={{
                  width: `${
                    ((currentQ + 1) / currentTest.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* 질문 카드 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-4">
            <p className={`text-xs ${c.text} font-medium mb-2`}>
              Q{currentQ + 1}.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentTest.questions[currentQ].question}
            </h2>

            <div className="space-y-3">
              {currentTest.questions[currentQ].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAnswer(choice.value)}
                  className={`w-full text-left px-5 py-4 rounded-lg border-2 border-gray-200 hover:${c.border} hover:${c.light} transition-all text-gray-700 hover:font-medium`}
                >
                  <span className="text-gray-400 mr-3 font-mono text-sm">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 */}
          <button
            onClick={resetToSelect}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            &#x2190; 테스트 목록으로
          </button>
        </div>
      )}

      {/* ─── Phase: 결과 ─── */}
      {phase === "result" && currentTest && (
        <div className="max-w-xl mx-auto">
          {/* Category result (personality / love) */}
          {currentTest.type === "category" && (() => {
            const result = getCategoryResult();
            if (!result) return null;
            return (
              <>
                <div
                  className={`${c.bg} rounded-xl p-8 text-center text-white shadow-lg mb-6`}
                >
                  <p className="text-white/70 text-sm mb-2">당신의 유형은...</p>
                  <div className="text-6xl mb-3">{result.emoji}</div>
                  <h2 className="text-3xl font-extrabold mb-2">
                    {result.name}
                  </h2>
                  <p className="text-white/90 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                {/* 장단점 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`${c.light} rounded-xl p-5`}>
                    <h3 className={`font-semibold ${c.text} mb-3`}>
                      &#x2728; 강점
                    </h3>
                    <ul className="space-y-1.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          &#x2022; {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-600 mb-3">
                      &#x1F4AD; 약점
                    </h3>
                    <ul className="space-y-1.5">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          &#x2022; {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 어울리는 직업 (personality only) */}
                {result.jobs.length > 0 && (
                  <div className="calc-card p-5 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      &#x1F4BC; 어울리는 직업
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.jobs.map((j, i) => (
                        <span
                          key={i}
                          className={`${c.light} ${c.text} text-sm px-3 py-1 rounded-full`}
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Score result (stress) */}
          {currentTest.type === "score" && (() => {
            const level = getScoreResult();
            const total = getScoreTotal();
            if (!level) return null;
            const maxScore = currentTest.questions.length * 4;
            const pct = Math.round((total / maxScore) * 100);
            return (
              <>
                <div
                  className={`${c.bg} rounded-xl p-8 text-center text-white shadow-lg mb-6`}
                >
                  <p className="text-white/70 text-sm mb-2">
                    스트레스 지수 결과
                  </p>
                  <div className="text-6xl mb-3">{level.emoji}</div>
                  <h2 className="text-3xl font-extrabold mb-2">{level.name}</h2>
                  <p className="text-white/90 text-lg mb-4">
                    {total}점 / {maxScore}점 ({pct}%)
                  </p>
                  {/* 게이지 바 */}
                  <div className="w-full bg-white/30 rounded-full h-4 mb-4">
                    <div
                      className="bg-white h-4 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-white/90 leading-relaxed text-sm">
                    {level.description}
                  </p>
                </div>

                <div className={`${c.light} rounded-xl p-5 mb-6`}>
                  <h3 className={`font-semibold ${c.text} mb-2`}>
                    &#x1F4A1; 추천 조언
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {level.advice}
                  </p>
                </div>
              </>
            );
          })()}

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={retryTest}
              className={`flex-1 py-3 ${c.button} text-white font-medium rounded-lg ${c.hover} transition-colors`}
            >
              &#x1F504; 다시 하기
            </button>
            <button
              onClick={resetToSelect}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              &#x1F4CB; 다른 테스트
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            심리테스트란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            심리테스트는 간단한 질문을 통해 자신의 성격 유형, 행동 패턴, 심리
            상태 등을 파악하는 자기 분석 도구입니다. 본 테스트는 재미를 위한
            것으로, 전문적인 심리 진단을 대체하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            제공하는 테스트
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                1. 나의 성격 유형은? (10문항)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                내향형, 외향형, 모험형, 계획형 등 4가지 성격 유형 중 나와 가장
                가까운 유형을 분석합니다. 각 유형별 강점, 약점, 어울리는 직업을
                안내합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                2. 나의 연애 스타일은? (8문항)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                불꽃 연애파, 안정 추구파, 친구같은 연인파, 감성 몽상가파 중 나의
                연애 패턴을 알아봅니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                3. 나의 스트레스 지수는? (8문항)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                수면, 식욕, 집중력, 대인관계 등 8개 영역의 질문으로 현재 스트레스
                수준을 4단계로 측정합니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                결과가 정확한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 테스트는 재미와 자기 이해를 위한 것으로, 전문적인 심리 검사와는
                다릅니다. 결과를 참고 정도로 활용하시길 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                데이터가 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                모든 답변과 결과는 브라우저에서만 처리되며, 서버에 전송되거나
                저장되지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                스트레스 지수가 높게 나왔어요.
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                높은 스트레스 상태가 지속된다면 전문 상담사와 상담을 받아보시는 것을
                권장합니다. 한국에서는 정신건강복지센터(1577-0199)에서 무료 상담을
                받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="psychology-test" />
    </div>
  );
}
