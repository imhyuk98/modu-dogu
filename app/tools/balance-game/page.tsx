"use client";

import { useState, useCallback, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ═══ Types ═══ */
type CategoryKey = "dating" | "daily" | "work" | "food" | "extreme";

interface Question {
  category: CategoryKey;
  optionA: string;
  optionB: string;
}

interface Answer {
  question: Question;
  choice: "A" | "B";
  percentA: number;
}

/* ═══ Categories ═══ */
const CATEGORIES: { key: CategoryKey | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "전체", emoji: "🎲" },
  { key: "dating", label: "연애", emoji: "💕" },
  { key: "daily", label: "일상", emoji: "🏠" },
  { key: "work", label: "직장", emoji: "💼" },
  { key: "food", label: "음식", emoji: "🍽️" },
  { key: "extreme", label: "극한 선택", emoji: "🔥" },
];

/* ═══ Questions ═══ */
const QUESTIONS: Question[] = [
  // 연애 (Dating)
  { category: "dating", optionA: "외모가 이상형인 사람", optionB: "성격이 이상형인 사람" },
  { category: "dating", optionA: "연락을 자주 하는 연인", optionB: "만날 때 확실히 챙기는 연인" },
  { category: "dating", optionA: "매일 작은 선물 주는 연인", optionB: "기념일에 큰 선물 주는 연인" },
  { category: "dating", optionA: "잘생긴데 패션 감각 없는 사람", optionB: "평범한데 옷 잘 입는 사람" },
  { category: "dating", optionA: "하루 20번 토라지지만 2분 만에 풀리는 연인", optionB: "2개월에 한 번 토라지지만 5일간 지속되는 연인" },
  { category: "dating", optionA: "전 애인과 밤새 술 마시는 연인", optionB: "이성 친구와 낮에 여행 가는 연인" },
  { category: "dating", optionA: "유머 코드가 맞는 연인", optionB: "가치관이 맞는 연인" },
  { category: "dating", optionA: "바로 갈등을 해결하는 연인", optionB: "혼자 정리한 후 대화하는 연인" },
  { category: "dating", optionA: "사진을 잘 찍어주는 연인", optionB: "맛집을 잘 찾는 연인" },
  { category: "dating", optionA: "친구가 없어서 항상 데이트하자는 연인", optionB: "친구가 많아서 약속 잡기 힘든 연인" },

  // 일상 (Daily Life)
  { category: "daily", optionA: "무한으로 먹어도 안 찌는 능력", optionB: "무한으로 자도 피곤하지 않는 능력" },
  { category: "daily", optionA: "평생 무료 항공권", optionB: "평생 무료 숙소" },
  { category: "daily", optionA: "100% 확률로 10억", optionB: "50% 확률로 50억" },
  { category: "daily", optionA: "김치찌개만 평생 먹기", optionB: "된장찌개만 평생 먹기" },
  { category: "daily", optionA: "여름만 있는 나라에서 살기", optionB: "겨울만 있는 나라에서 살기" },
  { category: "daily", optionA: "시간을 멈추는 능력", optionB: "과거로 돌아가는 능력" },
  { category: "daily", optionA: "투명인간 되는 능력", optionB: "하늘을 나는 능력" },
  { category: "daily", optionA: "맥주만 평생 마시기", optionB: "소주만 평생 마시기" },
  { category: "daily", optionA: "김이 빠진 콜라", optionB: "눅눅한 감자튀김" },
  { category: "daily", optionA: "귀신이 보이는 능력", optionB: "바퀴벌레가 나를 따라다니는 저주" },

  // 직장 (Work)
  { category: "work", optionA: "월 200만원 백수", optionB: "월 600만원 퇴사 불가" },
  { category: "work", optionA: "연봉 2000만원 오후 4시 퇴근", optionB: "연봉 6000만원 주 7일 근무" },
  { category: "work", optionA: "칭찬을 해주는 상사", optionB: "일을 확실히 가르쳐주는 상사" },
  { category: "work", optionA: "복지 좋고 야근 많은 회사", optionB: "복지 없고 칼퇴 보장 회사" },
  { category: "work", optionA: "만원 버스 30분 통근", optionB: "한적한 버스 90분 통근" },
  { category: "work", optionA: "싸고 맛없는 구내식당", optionB: "비싸고 맛있는 외부 식당" },
  { category: "work", optionA: "업무량 폭발", optionB: "할 일 없어서 시간 안 가는 회사" },
  { category: "work", optionA: "2시간 디테일 피드백", optionB: "5분 간단 승인" },
  { category: "work", optionA: "점심에 파스타 회식", optionB: "저녁에 고기 회식" },
  { category: "work", optionA: "퇴사할 때 조용히 나가기", optionB: "성대한 환송회 받기" },

  // 음식 (Food)
  { category: "food", optionA: "떡볶이만 평생 먹기", optionB: "치킨만 평생 먹기" },
  { category: "food", optionA: "짜장면", optionB: "짬뽕" },
  { category: "food", optionA: "민초(민트초코) 좋아", optionB: "민초 싫어" },
  { category: "food", optionA: "파인애플 피자 찬성", optionB: "파인애플 피자 반대" },
  { category: "food", optionA: "매운 음식만 먹기", optionB: "달콤한 음식만 먹기" },
  { category: "food", optionA: "평생 한식만 먹기", optionB: "평생 양식만 먹기" },
  { category: "food", optionA: "밥 위에 반찬 올려 먹기", optionB: "반찬 따로 먹기" },
  { category: "food", optionA: "붕어빵 머리부터", optionB: "꼬리부터" },
  { category: "food", optionA: "소금 간장 치킨", optionB: "양념 치킨" },
  { category: "food", optionA: "편의점 도시락", optionB: "직접 만든 도시락" },

  // 극한 선택 (Extreme)
  { category: "extreme", optionA: "10년 전으로 돌아가기 (기억 유지)", optionB: "10억 받기" },
  { category: "extreme", optionA: "세계 여행 1년", optionB: "원하는 집 1채" },
  { category: "extreme", optionA: "모든 언어 구사 능력", optionB: "모든 악기 연주 능력" },
  { category: "extreme", optionA: "다시 태어나면 남자", optionB: "다시 태어나면 여자" },
  { category: "extreme", optionA: "1년 동안 SNS 금지", optionB: "1년 동안 배달 음식 금지" },
  { category: "extreme", optionA: "영원히 25살 외모 유지", optionB: "영원히 건강한 신체" },
  { category: "extreme", optionA: "복권 1등 당첨", optionB: "수명 30년 연장" },
  { category: "extreme", optionA: "무인도에 한 명 데려가기: 요리사", optionB: "의사" },
  { category: "extreme", optionA: "타임머신으로 과거", optionB: "타임머신으로 미래" },
  { category: "extreme", optionA: "모든 사람의 생각을 읽는 능력", optionB: "아무도 나의 거짓말을 모르는 능력" },
];

/* ═══ Helpers ═══ */

// Seeded pseudo-random: same question index always produces same percentage
function seededPercent(index: number): number {
  const x = Math.sin(index * 9301 + 4927) * 10000;
  const raw = x - Math.floor(x); // 0..1
  return Math.round(30 + raw * 40); // 30..70
}

// Fisher-Yates shuffle with Math.random
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══ Component ═══ */
export default function BalanceGamePage() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [animating, setAnimating] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;

  // Get the global index of a question for consistent seeded percentages
  const getGlobalIndex = useCallback((q: Question) => {
    return QUESTIONS.findIndex(
      (orig) => orig.optionA === q.optionA && orig.optionB === q.optionB
    );
  }, []);

  const startGame = useCallback(() => {
    const pool =
      selectedCategory === "all"
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.category === selectedCategory);
    const shuffled = shuffle(pool).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers([]);
    setChoice(null);
    setAnimating(false);
    setScreen("game");
  }, [selectedCategory]);

  const handleChoice = useCallback(
    (picked: "A" | "B") => {
      if (choice !== null || !currentQuestion) return;
      setChoice(picked);
      setAnimating(true);

      const globalIdx = getGlobalIndex(currentQuestion);
      const percentA = seededPercent(globalIdx);

      const answer: Answer = {
        question: currentQuestion,
        choice: picked,
        percentA,
      };

      setAnswers((prev) => [...prev, answer]);
    },
    [choice, currentQuestion, getGlobalIndex]
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setChoice(null);
      setAnimating(false);
    }
  }, [currentIndex, questions.length]);

  const restart = useCallback(() => {
    setScreen("start");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setChoice(null);
    setAnimating(false);
  }, []);

  const shareText = useMemo(() => {
    if (answers.length === 0) return "";
    const lines = answers.map((a, i) => {
      const picked = a.choice === "A" ? a.question.optionA : a.question.optionB;
      return `${i + 1}. ${picked}`;
    });
    return `[밸런스 게임 결과]\n${lines.join("\n")}\n\nhttps://vibe-revenue.pages.dev/tools/balance-game`;
  }, [answers]);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("결과가 클립보드에 복사되었습니다!");
      } catch {
        prompt("아래 텍스트를 복사하세요:", shareText);
      }
    }
  }, [shareText]);

  const getCategoryEmoji = (key: CategoryKey) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat?.emoji ?? "";
  };

  const getCategoryLabel = (key: CategoryKey) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat?.label ?? "";
  };

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        ⚖️ 밸런스 게임
      </h1>
      <p className="text-gray-500 mb-6">
        두 가지 선택지 중 하나를 골라보세요! 당신의 선택은?
      </p>

      {/* ═══ Start Screen ═══ */}
      {screen === "start" && (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 sm:p-8 text-white min-h-[420px] flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold mb-2">밸런스 게임</h2>
          <p className="text-purple-200 mb-8 text-center">
            카테고리를 선택하고 게임을 시작하세요!
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.key
                    ? "bg-white text-gray-900 shadow-lg shadow-white/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-lg font-bold hover:from-blue-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-100"
          >
            게임 시작
          </button>
        </div>
      )}

      {/* ═══ Game Screen ═══ */}
      {screen === "game" && currentQuestion && (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-5 sm:p-8 text-white min-h-[420px]">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-purple-300">
              {getCategoryEmoji(currentQuestion.category)}{" "}
              {getCategoryLabel(currentQuestion.category)}
            </span>
            <span className="text-sm font-bold text-purple-200">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
              style={{
                width: `${((currentIndex + (choice ? 1 : 0)) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question text */}
          <p className="text-center text-purple-200 text-sm mb-6 font-medium">
            Q{currentIndex + 1}. 둘 중 하나를 선택하세요!
          </p>

          {/* Choice cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Option A */}
            <button
              onClick={() => handleChoice("A")}
              disabled={choice !== null}
              className={`relative rounded-2xl p-6 text-left transition-all duration-300 min-h-[120px] flex flex-col justify-center border-2 ${
                choice === null
                  ? "bg-gradient-to-br from-blue-500/30 to-blue-700/30 border-blue-500/40 hover:from-blue-500/50 hover:to-blue-700/50 hover:border-blue-400 hover:scale-[1.02] cursor-pointer"
                  : choice === "A"
                  ? "bg-gradient-to-br from-blue-500/50 to-blue-700/50 border-blue-400 ring-2 ring-blue-400/50"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <span className="text-xs font-bold text-blue-300 mb-2 block">A</span>
              <span className="text-base sm:text-lg font-bold leading-snug">
                {currentQuestion.optionA}
              </span>

              {/* Percentage bar after selection */}
              {choice !== null && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-300">
                      {choice === "A" && "👈 내 선택"}
                    </span>
                    <span className="font-bold text-blue-200">
                      {seededPercent(getGlobalIndex(currentQuestion))}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animating
                          ? `${seededPercent(getGlobalIndex(currentQuestion))}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </button>

            {/* VS divider (mobile only) */}
            <div className="sm:hidden flex items-center justify-center -my-2">
              <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center">
                <span className="text-yellow-300 text-xs font-black">VS</span>
              </div>
            </div>

            {/* Option B */}
            <button
              onClick={() => handleChoice("B")}
              disabled={choice !== null}
              className={`relative rounded-2xl p-6 text-left transition-all duration-300 min-h-[120px] flex flex-col justify-center border-2 ${
                choice === null
                  ? "bg-gradient-to-br from-rose-500/30 to-rose-700/30 border-rose-500/40 hover:from-rose-500/50 hover:to-rose-700/50 hover:border-rose-400 hover:scale-[1.02] cursor-pointer"
                  : choice === "B"
                  ? "bg-gradient-to-br from-rose-500/50 to-rose-700/50 border-rose-400 ring-2 ring-rose-400/50"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <span className="text-xs font-bold text-rose-300 mb-2 block">B</span>
              <span className="text-base sm:text-lg font-bold leading-snug">
                {currentQuestion.optionB}
              </span>

              {choice !== null && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-rose-300">
                      {choice === "B" && "👈 내 선택"}
                    </span>
                    <span className="font-bold text-rose-200">
                      {100 - seededPercent(getGlobalIndex(currentQuestion))}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animating
                          ? `${100 - seededPercent(getGlobalIndex(currentQuestion))}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Next button */}
          {choice !== null && (
            <div className="text-center animate-fade-in">
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-100"
              >
                {currentIndex + 1 >= questions.length
                  ? "결과 보기 ✨"
                  : "다음 질문 →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ Result Screen ═══ */}
      {screen === "result" && (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-5 sm:p-8 text-white">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold mb-1">게임 완료!</h2>
            <p className="text-purple-200 text-sm">
              당신의 선택을 확인해보세요
            </p>
          </div>

          {/* Answer summary */}
          <div className="space-y-3 mb-8">
            {answers.map((a, i) => {
              const percentA = a.percentA;
              const percentB = 100 - percentA;
              const myPercent = a.choice === "A" ? percentA : percentB;
              const isPopular = myPercent >= 50;
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                      Q{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-purple-300">
                          {getCategoryEmoji(a.question.category)}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            isPopular
                              ? "bg-green-500/20 text-green-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}
                        >
                          {isPopular ? "다수파" : "소수파"} {myPercent}%
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        <span
                          className={
                            a.choice === "A"
                              ? "text-blue-300"
                              : "text-white/50 line-through"
                          }
                        >
                          {a.question.optionA}
                        </span>
                        <span className="text-white/30 mx-2">vs</span>
                        <span
                          className={
                            a.choice === "B"
                              ? "text-rose-300"
                              : "text-white/50 line-through"
                          }
                        >
                          {a.question.optionB}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="bg-blue-400 transition-all"
                      style={{ width: `${percentA}%` }}
                    />
                    <div
                      className="bg-rose-400 transition-all"
                      style={{ width: `${percentB}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-white/40">
                    <span>A: {percentA}%</span>
                    <span>B: {percentB}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-300">
                {answers.filter((a) => {
                  const p = a.choice === "A" ? a.percentA : 100 - a.percentA;
                  return p >= 50;
                }).length}
              </div>
              <div className="text-xs text-green-300/70">다수파 선택</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-300">
                {answers.filter((a) => {
                  const p = a.choice === "A" ? a.percentA : 100 - a.percentA;
                  return p < 50;
                }).length}
              </div>
              <div className="text-xs text-orange-300/70">소수파 선택</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:from-blue-400 hover:to-purple-500 transition-all"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
            >
              결과 공유
            </button>
          </div>
        </div>
      )}

      {/* ═══ SEO Content ═══ */}
      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            밸런스 게임이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            밸런스 게임은 두 가지 선택지 중 하나를 고르는 게임입니다. 정답이 없는
            질문들로 구성되어 있어 친구, 연인, 동료와 함께 즐기기 좋습니다. 서로의
            가치관과 성향을 재미있게 알아볼 수 있는 인기 파티 게임입니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            카테고리 소개
          </h2>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
            <li>
              <strong>💕 연애</strong> - 연인과의 상황, 이상형에 대한 질문들
            </li>
            <li>
              <strong>🏠 일상</strong> - 초능력, 생활 속 재미있는 선택지들
            </li>
            <li>
              <strong>💼 직장</strong> - 회사생활, 연봉, 상사에 대한 질문들
            </li>
            <li>
              <strong>🍽️ 음식</strong> - 음식 취향을 알 수 있는 질문들
            </li>
            <li>
              <strong>🔥 극한 선택</strong> - 인생을 바꿀 수 있는 강렬한 선택지들
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            게임 방법
          </h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>원하는 카테고리를 선택하세요. (전체 선택 시 랜덤 출제)</li>
            <li>게임 시작을 누르면 10개의 질문이 출제됩니다.</li>
            <li>두 가지 선택지 중 하나를 골라주세요.</li>
            <li>선택 후 다른 사람들의 선택 비율을 확인할 수 있습니다.</li>
            <li>10문제를 모두 풀면 종합 결과를 확인하고 공유할 수 있습니다.</li>
          </ol>
        </div>
      </section>

      <RelatedTools current="balance-game" />
    </div>
  );
}
