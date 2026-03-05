"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

const ALL_EMOJIS = [
  "\uD83C\uDF4E", "\uD83C\uDF4A", "\uD83C\uDF4B", "\uD83C\uDF47",
  "\uD83C\uDF53", "\uD83C\uDF51", "\uD83C\uDF52", "\uD83E\uDD5D",
  "\uD83C\uDF4C", "\uD83C\uDF4D", "\uD83E\uDD6D", "\uD83E\uDED0",
];

type Difficulty = "easy" | "normal" | "hard";

interface DifficultyConfig {
  label: string;
  cols: number;
  rows: number;
  pairs: number;
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "\uC26C\uC6C0", cols: 4, rows: 3, pairs: 6 },
  normal: { label: "\uBCF4\uD1B5", cols: 4, rows: 4, pairs: 8 },
  hard: { label: "\uC5B4\uB824\uC6C0", cols: 6, rows: 4, pairs: 12 },
};

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(
  attempts: number,
  pairs: number
): { label: string; color: string } {
  const ratio = attempts / pairs;
  if (ratio <= 1.2) return { label: "\uCC9C\uC7AC", color: "text-yellow-500" };
  if (ratio <= 1.5) return { label: "\uB300\uB2E8\uD568", color: "text-green-500" };
  if (ratio <= 2.0) return { label: "\uBCF4\uD1B5", color: "text-blue-500" };
  return { label: "\uBD84\uBC1C \uD544\uC694", color: "text-orange-500" };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

export default function MemoryGame() {
  const [phase, setPhase] = useState<"select" | "preview" | "playing" | "done">(
    "select"
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestRecords, setBestRecords] = useState<
    Record<Difficulty, { attempts: number; time: number } | null>
  >({ easy: null, normal: null, hard: null });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("memory-game-best");
      if (saved) setBestRecords(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveBest = useCallback(
    (diff: Difficulty, att: number, time: number) => {
      setBestRecords((prev) => {
        const current = prev[diff];
        if (!current || att < current.attempts || (att === current.attempts && time < current.time)) {
          const updated = { ...prev, [diff]: { attempts: att, time } };
          localStorage.setItem("memory-game-best", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    },
    []
  );

  const startGame = useCallback(
    (diff: Difficulty) => {
      setDifficulty(diff);
      const config = DIFFICULTIES[diff];
      const emojis = shuffle(ALL_EMOJIS).slice(0, config.pairs);
      const pairs = shuffle([...emojis, ...emojis]);
      const newCards: Card[] = pairs.map((emoji, i) => ({
        id: i,
        emoji,
        isFlipped: true,
        isMatched: false,
      }));

      setCards(newCards);
      setFlippedIds([]);
      setAttempts(0);
      setMatchedPairs(0);
      setElapsed(0);
      setPhase("preview");
      lockRef.current = true;

      // Show all cards for 2 seconds, then flip them
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => ({ ...c, isFlipped: false }))
        );
        setPhase("playing");
        lockRef.current = false;

        // Start timer
        const start = Date.now();
        timerRef.current = setInterval(() => {
          setElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);
      }, 2000);
    },
    []
  );

  const handleCardClick = useCallback(
    (id: number) => {
      if (lockRef.current) return;
      if (phase !== "playing") return;

      const card = cards[id];
      if (!card || card.isFlipped || card.isMatched) return;
      if (flippedIds.includes(id)) return;

      const newFlipped = [...flippedIds, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );

      if (newFlipped.length === 2) {
        lockRef.current = true;
        setAttempts((a) => a + 1);
        const [first, second] = newFlipped;
        const totalAttempts = attempts + 1;

        if (cards[first].emoji === cards[second].emoji) {
          // Match found
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          setFlippedIds([]);
          lockRef.current = false;

          // Check win
          if (newMatchedPairs >= DIFFICULTIES[difficulty].pairs) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("done");
            // elapsed might not be updated yet, calculate directly
            const finalTime = elapsed;
            saveBest(difficulty, totalAttempts, finalTime);
          }
        } else {
          // No match - flip back after 1s
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            lockRef.current = false;
          }, 800);
        }
      } else {
        setFlippedIds(newFlipped);
      }
    },
    [cards, flippedIds, phase, attempts, matchedPairs, difficulty, elapsed, saveBest]
  );

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (phase === "select") {
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          기억력 테스트 (카드 뒤집기)
        </h1>
        <p className="text-gray-500 mb-8">
          카드를 뒤집어 같은 그림의 짝을 맞추세요! 난이도를 선택하여 시작합니다.
        </p>

        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">난이도 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.entries(DIFFICULTIES) as [Difficulty, DifficultyConfig][]).map(
              ([key, config]) => {
                const best = bestRecords[key];
                return (
                  <button
                    key={key}
                    onClick={() => startGame(key)}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                  >
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {config.label}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {config.cols}x{config.rows} ({config.pairs}쌍)
                    </p>
                    {best && (
                      <p className="text-xs text-blue-600">
                        최고: {best.attempts}회 / {formatTime(best.time)}
                      </p>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">게임 방법</h2>
          <ol className="text-gray-600 space-y-2 text-sm list-decimal pl-5">
            <li>게임 시작 시 2초간 모든 카드가 공개됩니다</li>
            <li>카드 위치를 최대한 기억하세요</li>
            <li>카드를 2장씩 뒤집어 같은 그림을 찾으세요</li>
            <li>같은 그림이면 카드가 유지되고, 다르면 다시 뒤집힙니다</li>
            <li>모든 짝을 맞추면 완료!</li>
          </ol>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              기억력을 향상시키는 방법
            </h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>규칙적인 수면은 기억력 강화에 필수적입니다</li>
              <li>카드 위치를 그룹으로 묶어서 기억하면 효과적입니다</li>
              <li>반복적인 연습이 단기 기억력을 향상시킵니다</li>
              <li>명상과 집중력 훈련도 기억력에 도움이 됩니다</li>
            </ul>
          </div>
        </section>

        <RelatedTools current="memory-game" />
      </div>
    );
  }

  if (phase === "done") {
    const config = DIFFICULTIES[difficulty];
    const grade = getGrade(attempts, config.pairs);
    const best = bestRecords[difficulty];

    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          기억력 테스트 결과
        </h1>
        <p className="text-gray-500 mb-8">
          축하합니다! 모든 카드 짝을 맞추었습니다!
        </p>

        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-green-500 text-white p-8 text-center">
            <p className="text-6xl mb-3">{"\uD83C\uDF89"}</p>
            <p className="text-green-100 text-sm mb-1">등급</p>
            <p className={`text-4xl font-bold mb-2 ${grade.color}`}>
              {grade.label}
            </p>
            <p className="text-green-100">
              {config.label} 난이도 ({config.pairs}쌍)
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">시도 횟수</p>
                <p className="text-3xl font-bold text-gray-900">
                  {attempts}
                  <span className="text-sm font-normal text-gray-400">회</span>
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">소요 시간</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatTime(elapsed)}
                </p>
              </div>
            </div>

            {best && (
              <div className="p-3 bg-yellow-50 rounded-lg text-center mb-4">
                <p className="text-sm text-yellow-700">
                  최고 기록: {best.attempts}회 / {formatTime(best.time)}
                </p>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">등급 기준 (시도 횟수 / 쌍 수)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { ratio: "~1.2배", label: "\uCC9C\uC7AC", color: "text-yellow-500" },
                  { ratio: "~1.5배", label: "\uB300\uB2E8\uD568", color: "text-green-500" },
                  { ratio: "~2.0배", label: "\uBCF4\uD1B5", color: "text-blue-500" },
                  { ratio: "2.0배+", label: "\uBD84\uBC1C \uD544\uC694", color: "text-orange-500" },
                ].map((g) => (
                  <div
                    key={g.label}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className={`font-semibold ${g.color}`}>
                      {g.label}
                    </span>
                    <span className="text-gray-400">{g.ratio}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => startGame(difficulty)}
            className="calc-btn-primary px-8 py-3 text-lg"
          >
            같은 난이도로 다시 하기
          </button>
          <button
            onClick={() => setPhase("select")}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-lg"
          >
            난이도 변경
          </button>
        </div>

        <RelatedTools current="memory-game" />
      </div>
    );
  }

  // Playing / Preview phase
  const config = DIFFICULTIES[difficulty];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">기억력 테스트</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            {matchedPairs}/{config.pairs}쌍
          </span>
          <span>시도: {attempts}회</span>
          <span>{formatTime(elapsed)}</span>
        </div>
      </div>

      {phase === "preview" && (
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-blue-600 animate-pulse">
            카드 위치를 기억하세요!
          </p>
        </div>
      )}

      <div
        className="grid gap-2 sm:gap-3 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          maxWidth: config.cols <= 4 ? "400px" : "600px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="relative cursor-pointer"
            style={{
              perspective: "600px",
              aspectRatio: "1",
            }}
          >
            <div
              className="w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Card back */}
              <div
                className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 ${
                  card.isMatched
                    ? "bg-green-100 border-green-400"
                    : "bg-gradient-to-br from-blue-400 to-purple-500 border-blue-300 hover:from-blue-500 hover:to-purple-600"
                } transition-colors`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-white text-opacity-80">?</span>
              </div>
              {/* Card front */}
              <div
                className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl sm:text-4xl border-2 ${
                  card.isMatched
                    ? "bg-green-50 border-green-400"
                    : "bg-white border-gray-200"
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {card.emoji}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("select");
          }}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          게임 중단
        </button>
      </div>
    </div>
  );
}
