"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

// ─── Types ──────────────────────────────────────────────────

type Difficulty = "easy" | "normal" | "hard";

interface TypingResult {
  speed: number; // 타/분
  accuracy: number; // %
  elapsedTime: number; // ms
  grade: string;
  gradeColor: string;
}

// ─── Sentences ──────────────────────────────────────────────

const sentences: Record<Difficulty, string[]> = {
  easy: [
    "오늘 날씨가 참 좋습니다.",
    "서울에서 부산까지 KTX로 2시간 30분.",
    "봄이 오면 벚꽃이 핍니다.",
    "맛있는 커피 한 잔의 여유.",
    "하늘이 맑고 바람이 시원하다.",
    "오늘도 좋은 하루 보내세요.",
    "노력은 배신하지 않는다.",
    "아침에 일찍 일어나는 새가 벌레를 잡는다.",
    "시간은 금이다.",
    "웃으면 복이 온다.",
    "가는 말이 고와야 오는 말이 곱다.",
    "서울의 봄은 정말 아름답습니다.",
    "비 온 뒤에 땅이 굳어진다.",
    "고생 끝에 낙이 온다.",
    "한국의 사계절은 뚜렷하다.",
    "독서는 마음의 양식이다.",
    "꿈을 크게 꾸면 이루어진다.",
    "건강이 최고의 재산입니다.",
    "친구는 제2의 가족이다.",
    "매일 조금씩 성장하자.",
  ],
  normal: [
    "대한민국은 민주공화국이다. 대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다.",
    "인생은 짧고 예술은 길다. 기회는 순간이고, 경험은 오해를 낳으며, 판단은 어렵다.",
    "천 리 길도 한 걸음부터 시작된다. 꾸준한 노력이 큰 결과를 만든다.",
    "우리나라의 전통 음식인 김치는 세계적으로 유명한 발효 식품이다.",
    "프로그래밍은 문제를 해결하는 과정이다. 코드를 작성하기 전에 먼저 생각하라.",
    "서울특별시는 대한민국의 수도이며, 약 천만 명의 인구가 살고 있다.",
    "좋은 습관은 하루아침에 만들어지지 않는다. 매일 꾸준히 실천하는 것이 중요하다.",
    "독서는 정신에 있어서 운동이 신체에 대해 하는 것과 같은 역할을 한다.",
    "한국어는 세종대왕이 창제한 한글이라는 고유 문자를 사용하는 언어입니다.",
    "지구 온난화로 인해 전 세계적으로 이상 기후 현상이 빈번하게 발생하고 있다.",
    "인공지능 기술의 발전으로 우리의 일상생활이 빠르게 변화하고 있습니다.",
    "매일 아침 30분의 운동은 건강한 생활을 유지하는 데 큰 도움이 됩니다.",
    "한국의 교육열은 세계적으로 유명하며, 학생들의 학업 성취도가 매우 높다.",
    "여행은 새로운 문화를 경험하고 시야를 넓힐 수 있는 좋은 기회입니다.",
    "효과적인 의사소통을 위해서는 상대방의 말을 경청하는 자세가 필요합니다.",
    "스마트폰의 보급으로 언제 어디서나 인터넷에 접속할 수 있는 시대가 되었다.",
    "환경 보호를 위해 일회용품 사용을 줄이고 재활용을 실천해야 합니다.",
    "한국 드라마와 K-POP은 전 세계적으로 큰 인기를 얻고 있는 한류 콘텐츠입니다.",
    "역사를 잊은 민족에게 미래는 없다. 과거를 통해 현재를 이해하고 미래를 준비하자.",
    "디지털 시대에도 손글씨의 가치는 여전히 중요하며, 창의력 발달에 도움이 된다.",
  ],
  hard: [
    "모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을 추구할 권리를 가진다. 국가는 개인이 가지는 불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다.",
    "대한민국 헌법 제10조에 따르면, 모든 국민은 인간으로서의 존엄과 가치를 가지며 행복을 추구할 권리를 가진다. 국가는 이를 보장할 의무가 있다.",
    "과학기술의 급격한 발전은 인류 문명에 혁명적인 변화를 가져왔지만, 동시에 환경 파괴, 개인정보 침해, 일자리 감소 등 새로운 사회적 문제를 야기하고 있다.",
    "한국어의 문법 구조는 주어-목적어-서술어 순서를 따르며, 조사를 활용하여 문장 성분 간의 관계를 표현한다. 이러한 교착어적 특성은 한국어를 독특하고 풍부한 표현이 가능한 언어로 만든다.",
    "지속 가능한 발전이란 미래 세대가 그들의 필요를 충족시킬 수 있는 능력을 저해하지 않으면서 현재 세대의 필요를 충족시키는 발전을 의미하며, 경제 성장과 환경 보전의 균형을 추구한다.",
    "블록체인 기술은 분산 원장 시스템을 기반으로 하여 데이터의 무결성과 투명성을 보장하며, 금융, 의료, 물류 등 다양한 산업 분야에서 혁신적인 변화를 이끌어내고 있다.",
    "한글은 1443년 세종대왕이 훈민정음이라는 이름으로 창제하여 1446년에 반포한 문자 체계로, 과학적이고 체계적인 원리에 기반하여 만들어져 세계 언어학자들로부터 높은 평가를 받고 있다.",
    "현대 사회에서 정보 리터러시는 필수적인 역량으로, 방대한 양의 정보 중에서 신뢰할 수 있는 정보를 선별하고 비판적으로 분석하여 올바른 판단을 내리는 능력이 점점 더 중요해지고 있다.",
    "양자 컴퓨팅은 양자역학의 원리를 활용하여 기존 컴퓨터로는 풀기 어려운 복잡한 문제를 해결할 수 있는 차세대 컴퓨팅 기술로, 암호학, 신약 개발, 기후 모델링 등의 분야에서 혁신을 가져올 것으로 기대된다.",
    "대한민국의 경제 발전은 한강의 기적이라 불리며, 6·25 전쟁 이후 세계 최빈국에서 세계 10위권의 경제 대국으로 성장한 놀라운 성과로 전 세계의 주목을 받았다. 이러한 성장의 배경에는 교육에 대한 높은 열정과 근면한 국민성이 있다.",
  ],
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

// ─── Helpers ────────────────────────────────────────────────

function getGrade(speed: number): { grade: string; color: string } {
  if (speed <= 100) return { grade: "초보", color: "text-gray-500" };
  if (speed <= 200) return { grade: "보통", color: "text-blue-500" };
  if (speed <= 300) return { grade: "빠름", color: "text-green-500" };
  if (speed <= 400) return { grade: "매우 빠름", color: "text-orange-500" };
  return { grade: "신의 손", color: "text-red-500" };
}

function getGradeBg(speed: number): string {
  if (speed <= 100) return "bg-gray-100";
  if (speed <= 200) return "bg-blue-50";
  if (speed <= 300) return "bg-green-50";
  if (speed <= 400) return "bg-orange-50";
  return "bg-red-50";
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const cs = Math.floor((ms % 1000) / 10);
  if (m > 0) {
    return `${m}분 ${s.toString().padStart(2, "0")}초`;
  }
  return `${s}.${cs.toString().padStart(2, "0")}초`;
}

// ─── Best Record ────────────────────────────────────────────

const STORAGE_KEY = "typing-test-best";

interface BestRecord {
  speed: number;
  accuracy: number;
  difficulty: Difficulty;
  date: string;
}

function loadBestRecord(): BestRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BestRecord;
  } catch {
    return null;
  }
}

function saveBestRecord(record: BestRecord) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage not available
  }
}

// ─── Main Component ─────────────────────────────────────────

export default function TypingTestPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [currentSentence, setCurrentSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(null);
  const [elapsedDisplay, setElapsedDisplay] = useState(0);

  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load best record on mount
  useEffect(() => {
    setBestRecord(loadBestRecord());
  }, []);

  // Pick a random sentence when difficulty changes or on reset
  const pickSentence = useCallback(
    (diff: Difficulty) => {
      const pool = sentences[diff];
      const idx = Math.floor(Math.random() * pool.length);
      setCurrentSentence(pool[idx]);
    },
    []
  );

  // Initialize sentence
  useEffect(() => {
    pickSentence(difficulty);
  }, [difficulty, pickSentence]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      // Start timer on first keystroke
      if (!isStarted && value.length > 0) {
        setIsStarted(true);
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setElapsedDisplay(Date.now() - startTimeRef.current);
        }, 50);
      }

      // Prevent typing beyond sentence length
      if (value.length > currentSentence.length) return;

      setUserInput(value);

      // Check if complete
      if (value.length === currentSentence.length) {
        const endTime = Date.now();
        const elapsed = endTime - startTimeRef.current;

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setElapsedDisplay(elapsed);
        setIsFinished(true);

        // Calculate results
        let correctChars = 0;
        for (let i = 0; i < currentSentence.length; i++) {
          if (value[i] === currentSentence[i]) correctChars++;
        }

        const accuracy = Math.round(
          (correctChars / currentSentence.length) * 100
        );

        // 타/분 = (총 타수) / (소요시간 분)
        const totalChars = currentSentence.length;
        const elapsedMinutes = elapsed / 60000;
        const speed = Math.round(totalChars / elapsedMinutes);

        const { grade, color } = getGrade(speed);

        const typingResult: TypingResult = {
          speed,
          accuracy,
          elapsedTime: elapsed,
          grade,
          gradeColor: color,
        };
        setResult(typingResult);

        // Check best record
        const currentBest = loadBestRecord();
        if (!currentBest || speed > currentBest.speed) {
          const newBest: BestRecord = {
            speed,
            accuracy,
            difficulty,
            date: new Date().toLocaleDateString("ko-KR"),
          };
          saveBestRecord(newBest);
          setBestRecord(newBest);
        }
      }
    },
    [isStarted, currentSentence, difficulty]
  );

  const handleReset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setUserInput("");
    setIsStarted(false);
    setIsFinished(false);
    setResult(null);
    setElapsedDisplay(0);
    pickSentence(difficulty);
    // Focus input after reset
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty, pickSentence]);

  const handleDifficultyChange = useCallback(
    (diff: Difficulty) => {
      if (isStarted && !isFinished) return; // prevent changing mid-test
      setDifficulty(diff);
      setUserInput("");
      setIsStarted(false);
      setIsFinished(false);
      setResult(null);
      setElapsedDisplay(0);
    },
    [isStarted, isFinished]
  );

  // Build character-by-character comparison for display
  const renderedSentence = useMemo(() => {
    return currentSentence.split("").map((char, i) => {
      let className = "text-gray-400"; // untyped

      if (i < userInput.length) {
        if (userInput[i] === char) {
          className = "text-green-600"; // correct
        } else {
          className = "bg-red-200 text-red-700"; // wrong
        }
      } else if (i === userInput.length) {
        className = "text-gray-900 border-b-2 border-blue-500"; // cursor position
      }

      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  }, [currentSentence, userInput]);

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        타자 속도 측정기
      </h1>
      <p className="text-gray-500 mb-8">
        한글 문장을 보고 타이핑하여 분당 타수와 정확도를 측정하세요.
      </p>

      {/* Tool area */}
      <div className="calc-card p-6 mb-6">
        {/* Difficulty selector + best record */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {(["easy", "normal", "hard"] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                disabled={isStarted && !isFinished}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === diff
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${
                  isStarted && !isFinished
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {difficultyLabels[diff]}
              </button>
            ))}
          </div>

          {bestRecord && (
            <div className="text-sm text-gray-500">
              최고 기록:{" "}
              <span className="font-semibold text-blue-600">
                {bestRecord.speed}타/분
              </span>{" "}
              ({bestRecord.date})
            </div>
          )}
        </div>

        {/* Timer display */}
        {isStarted && !isFinished && (
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm font-mono text-gray-700">
              {formatTime(elapsedDisplay)}
            </span>
          </div>
        )}

        {/* Sentence display */}
        <div className="bg-gray-50 rounded-lg p-5 mb-4 min-h-[80px]">
          <p className="text-lg leading-relaxed font-medium break-all tracking-wide">
            {renderedSentence}
          </p>
        </div>

        {/* Input area */}
        {!isFinished ? (
          <div className="mb-4">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="위 문장을 여기에 입력하세요. 타이핑을 시작하면 측정이 시작됩니다."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              disabled={isFinished}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>
                {userInput.length} / {currentSentence.length} 글자
              </span>
              {isStarted && (
                <button
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  다시 시작
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result */
          result && (
            <div className="mt-2">
              {/* Grade banner */}
              <div
                className={`text-center py-6 rounded-xl mb-6 ${getGradeBg(result.speed)}`}
              >
                <p className="text-sm text-gray-500 mb-1">당신의 등급</p>
                <p className={`text-4xl font-bold ${result.gradeColor}`}>
                  {result.grade}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">타자 속도</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.speed}
                  </p>
                  <p className="text-xs text-gray-400">타/분</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">정확도</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.accuracy}%
                  </p>
                  <p className="text-xs text-gray-400">정확도</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">소요 시간</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(result.elapsedTime)}
                  </p>
                  <p className="text-xs text-gray-400">시간</p>
                </div>
              </div>

              {/* Speed bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>0</span>
                  <span>100</span>
                  <span>200</span>
                  <span>300</span>
                  <span>400</span>
                  <span>500+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.speed <= 100
                        ? "bg-gray-400"
                        : result.speed <= 200
                          ? "bg-blue-500"
                          : result.speed <= 300
                            ? "bg-green-500"
                            : result.speed <= 400
                              ? "bg-orange-500"
                              : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (result.speed / 500) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>초보</span>
                  <span>보통</span>
                  <span>빠름</span>
                  <span>매우 빠름</span>
                  <span>신의 손</span>
                </div>
              </div>

              {/* New best record banner */}
              {bestRecord &&
                result.speed >= bestRecord.speed && (
                  <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="text-yellow-700 font-semibold">
                      새로운 최고 기록!
                    </p>
                  </div>
                )}

              {/* Retry button */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="calc-btn-primary"
                >
                  다시 도전
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            타자 속도 측정이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            타자 속도 측정은 키보드로 문장을 입력하는 속도를 분당 타수(타/분)로
            나타낸 것입니다. 한글 타자의 경우 한 글자를 입력할 때 초성, 중성,
            종성을 각각 하나의 타로 계산하는 방식과, 완성된 글자 수를 기준으로
            하는 방식이 있습니다. 본 측정기는 완성된 글자 수 기준으로 분당 타수를
            계산합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            등급 기준표
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    등급
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    분당 타수
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">초보</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    100타/분 이하
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    키보드에 익숙해지는 단계
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">보통</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    101~200타/분
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    일반적인 사무 업무 수준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">빠름</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    201~300타/분
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    숙련된 타이피스트 수준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    매우 빠름
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    301~400타/분
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    전문가 수준의 타자 속도
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">신의 손</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    500타/분 이상
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    최상위 타자 속도
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            타자 속도를 높이는 방법
          </h2>
          <p className="text-gray-600 leading-relaxed">
            타자 속도를 향상시키려면 올바른 자세와 손가락 배치가 중요합니다.
            키보드의 홈 포지션(왼손: ㅁㄴㅇㄹ, 오른손: ㅎㅗㅓㅏ)을 유지하고,
            각 손가락이 담당하는 키를 정확히 익히는 것이 기본입니다. 매일 꾸준히
            연습하면 자연스럽게 속도가 빨라지며, 정확도를 먼저 높인 후 속도를
            올리는 것이 효과적입니다. 타자 연습 시 화면만 보고 키보드를 보지 않는
            터치 타이핑을 연습하면 큰 도움이 됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                분당 타수(타/분)는 어떻게 계산되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                문장의 총 글자 수를 소요 시간(분)으로 나누어 계산합니다. 예를 들어
                60글자 문장을 30초 만에 완성하면 120타/분이 됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                정확도는 어떻게 계산되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                입력한 글자 중 원본 문장과 일치하는 글자의 비율을 백분율로
                나타냅니다. 모든 글자가 정확하면 100%입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                최고 기록은 어디에 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                최고 기록은 브라우저의 로컬 스토리지에 저장됩니다. 같은
                브라우저에서 다시 접속하면 기록이 유지되지만, 브라우저 데이터를
                삭제하면 기록도 초기화됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                한글과 영문 타자 속도 비교는 어떻게 하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                한글과 영문은 타자 계산 방식이 다릅니다. 영문은 보통
                WPM(Words Per Minute)을 사용하고, 한글은 타/분을 사용합니다. 단순
                비교는 어렵지만, 일반적으로 한글 200타/분은 영문 약 40WPM에
                해당합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="typing-test" />
    </div>
  );
}
