"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

type GameMode = "ai" | "two-player" | null;
type Player = 1 | 2;

interface GameState {
  currentNumber: number; // next number to be said
  currentPlayer: Player;
  selectedNumbers: { number: number; player: Player }[];
  gameOver: boolean;
  loser: Player | null;
  mode: GameMode;
}

const LOSING_NUMBER = 31;

function getInitialState(mode: GameMode): GameState {
  return {
    currentNumber: 1,
    currentPlayer: 1,
    selectedNumbers: [],
    gameOver: false,
    loser: null,
    mode,
  };
}

export default function BaskinRobbins31() {
  const [gameState, setGameState] = useState<GameState>(getInitialState(null));
  const [showResult, setShowResult] = useState(false);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { currentNumber, currentPlayer, selectedNumbers, gameOver, loser, mode } = gameState;

  // cleanup AI timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  const startGame = (selectedMode: GameMode) => {
    setGameState(getInitialState(selectedMode));
    setShowResult(false);
  };

  const sayNumbers = useCallback(
    (count: 1 | 2 | 3) => {
      if (gameOver || mode === null) return;
      if (mode === "ai" && currentPlayer === 2) return; // AI's turn

      const maxCount = Math.min(count, LOSING_NUMBER - currentNumber + 1);
      if (maxCount <= 0) return;

      const newSelected: { number: number; player: Player }[] = [];
      for (let i = 0; i < maxCount; i++) {
        newSelected.push({ number: currentNumber + i, player: currentPlayer });
      }

      const nextNumber = currentNumber + maxCount;
      const isGameOver = nextNumber > LOSING_NUMBER;

      setGameState((prev) => ({
        ...prev,
        selectedNumbers: [...prev.selectedNumbers, ...newSelected],
        currentNumber: nextNumber,
        currentPlayer: isGameOver ? prev.currentPlayer : ((prev.currentPlayer === 1 ? 2 : 1) as Player),
        gameOver: isGameOver,
        loser: isGameOver ? prev.currentPlayer : null,
      }));

      if (isGameOver) {
        setTimeout(() => setShowResult(true), 300);
      }
    },
    [gameOver, mode, currentNumber, currentPlayer]
  );

  // AI turn logic
  useEffect(() => {
    if (mode !== "ai" || currentPlayer !== 2 || gameOver) return;

    aiTimeoutRef.current = setTimeout(() => {
      // Smart strategy: try to land on multiples of 4 (4, 8, 12, 16, 20, 24, 28)
      // From position currentNumber, we want to end at the next multiple of 4
      // The ideal position to end at = next multiple of 4 from currentNumber
      const remainder = currentNumber % 4;
      let idealCount: number;

      if (remainder === 0) {
        // We're at a multiple of 4, which means opponent played well
        // No perfect move; pick randomly
        idealCount = Math.floor(Math.random() * 3) + 1;
      } else {
        // We want to say numbers until we reach the next multiple of 4
        // e.g., currentNumber=5, remainder=1, we want to say 3 numbers (5,6,7->8 next)
        // Actually: we want the LAST number we say to be a multiple of 4
        // target = currentNumber + (4 - remainder) - but need to figure out count
        idealCount = 4 - remainder;
      }

      // Occasionally make mistakes to be beatable (~25% chance)
      if (Math.random() < 0.25) {
        const options = [1, 2, 3].filter((n) => n !== idealCount);
        idealCount = options[Math.floor(Math.random() * options.length)];
      }

      // Don't go over 31
      idealCount = Math.min(idealCount, LOSING_NUMBER - currentNumber + 1);
      idealCount = Math.max(1, idealCount) as 1 | 2 | 3;

      const newSelected: { number: number; player: Player }[] = [];
      for (let i = 0; i < idealCount; i++) {
        newSelected.push({ number: currentNumber + i, player: 2 });
      }

      const nextNumber = currentNumber + idealCount;
      const isGameOver = nextNumber > LOSING_NUMBER;

      setGameState((prev) => ({
        ...prev,
        selectedNumbers: [...prev.selectedNumbers, ...newSelected],
        currentNumber: nextNumber,
        currentPlayer: isGameOver ? 2 : 1,
        gameOver: isGameOver,
        loser: isGameOver ? 2 : null,
      }));

      if (isGameOver) {
        setTimeout(() => setShowResult(true), 300);
      }
    }, 800 + Math.random() * 700);

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [mode, currentPlayer, gameOver, currentNumber]);

  const getNumberColor = (num: number) => {
    const entry = selectedNumbers.find((s) => s.number === num);
    if (!entry) return "";
    if (num === LOSING_NUMBER) return "bg-yellow-400 text-gray-900 font-bold ring-2 ring-yellow-500";
    return entry.player === 1
      ? "bg-blue-500 text-white"
      : "bg-red-500 text-white";
  };

  const maxSelectable = Math.min(3, LOSING_NUMBER - currentNumber + 1);
  const isMyTurn = mode === "two-player" || (mode === "ai" && currentPlayer === 1);

  // Mode selection screen
  if (mode === null) {
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          베스킨라빈스 31
        </h1>
        <p className="text-gray-500 mb-8">
          숫자를 1~3개씩 부르며, 31을 말하는 사람이 지는 게임입니다.
        </p>

        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={() => startGame("ai")}
            className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="text-3xl mb-2">&#x1F916;</div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
              AI 대전
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              AI와 1:1로 대결합니다
            </p>
          </button>

          <button
            onClick={() => startGame("two-player")}
            className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
          >
            <div className="text-3xl mb-2">&#x1F465;</div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600">
              2인 대전
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              한 기기에서 2명이 번갈아 플레이합니다
            </p>
          </button>
        </div>

        {/* SEO Section */}
        <SeoSection />
        <RelatedTools current="baskin-robbins-31" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">베스킨라빈스 31</h1>
        <button
          onClick={() => startGame(null)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          모드 선택
        </button>
      </div>
      <p className="text-gray-500 mb-6">
        {mode === "ai" ? "AI 대전" : "2인 대전"} &mdash; 31을 말하면 패배!
      </p>

      {/* Current player indicator */}
      {!gameOver && (
        <div className="mb-6 text-center">
          <div
            className={`inline-block px-6 py-3 rounded-xl text-lg font-bold ${
              currentPlayer === 1
                ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                : "bg-red-100 text-red-700 border-2 border-red-300"
            }`}
          >
            {currentPlayer === 1
              ? mode === "ai"
                ? "내 차례"
                : "플레이어 1 차례"
              : mode === "ai"
              ? "AI 차례..."
              : "플레이어 2 차례"}
          </div>
        </div>
      )}

      {/* Number grid */}
      <div className="calc-card p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-7 sm:grid-cols-8 gap-2">
          {Array.from({ length: LOSING_NUMBER }, (_, i) => i + 1).map((num) => {
            const colorClass = getNumberColor(num);
            const isSaid = selectedNumbers.some((s) => s.number === num);
            return (
              <div
                key={num}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                  colorClass
                    ? colorClass
                    : "bg-gray-100 text-gray-400"
                } ${isSaid ? "scale-100" : ""}`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span>{mode === "ai" ? "나" : "플레이어 1"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>{mode === "ai" ? "AI" : "플레이어 2"}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {!gameOver && (
        <div className="flex justify-center gap-3 mb-6">
          {([1, 2, 3] as const).map((count) => (
            <button
              key={count}
              onClick={() => sayNumbers(count)}
              disabled={!isMyTurn || count > maxSelectable}
              className={`px-6 py-3 rounded-xl text-lg font-bold transition-all ${
                !isMyTurn || count > maxSelectable
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
            >
              {count}개
            </button>
          ))}
        </div>
      )}

      {/* Preview: what numbers will be said */}
      {!gameOver && isMyTurn && (
        <div className="text-center text-sm text-gray-500 mb-6">
          다음 숫자: {currentNumber}
          {maxSelectable >= 2 && ` ~ ${Math.min(currentNumber + 2, LOSING_NUMBER)}`}
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && showResult && (
        <div className="text-center mb-6">
          <div className="calc-card border-2 border-gray-200 p-8 max-w-sm mx-auto">
            <div className="text-5xl mb-4">
              {mode === "ai"
                ? loser === 2
                  ? String.fromCodePoint(0x1F389)
                  : String.fromCodePoint(0x1F62D)
                : loser === 1
                ? String.fromCodePoint(0x1F534)
                : String.fromCodePoint(0x1F535)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "ai"
                ? loser === 2
                  ? "승리!"
                  : "패배..."
                : loser === 1
                ? "플레이어 2 승리!"
                : "플레이어 1 승리!"}
            </h2>
            <p className="text-gray-500 mb-6">
              {mode === "ai"
                ? loser === 2
                  ? "AI가 31을 말했습니다!"
                  : "31을 말해버렸습니다..."
                : `플레이어 ${loser}이(가) 31을 말했습니다!`}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startGame(mode)}
                className="calc-btn-primary"
              >
                다시 하기
              </button>
              <button
                onClick={() => startGame(null)}
                className="calc-btn-secondary"
              >
                모드 선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <SeoSection />
      <RelatedTools current="baskin-robbins-31" />
    </div>
  );
}

function SeoSection() {
  return (
    <section className="mt-12 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          베스킨라빈스 31 게임이란?
        </h2>
        <p className="text-gray-600 leading-relaxed">
          베스킨라빈스 31(Baskin Robbins 31)은 대표적인 술자리 게임 중 하나로, 두
          명 이상의 플레이어가 1부터 순서대로 숫자를 부르되, 한 번에 1개에서
          3개까지의 연속된 숫자를 부를 수 있습니다. 마지막에 31을 말하게 되는
          사람이 지는 게임입니다. 아이스크림 브랜드 배스킨라빈스의 31가지 맛에서
          이름이 유래되었습니다.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          게임 규칙
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>두 명의 플레이어가 번갈아가며 숫자를 부릅니다.</li>
          <li>1부터 시작하여 한 번에 1개, 2개, 또는 3개의 연속된 숫자를 부를 수 있습니다.</li>
          <li>예를 들어, 첫 번째 플레이어가 &quot;1, 2&quot;를 부르면 다음 플레이어는 &quot;3&quot;부터 시작합니다.</li>
          <li>숫자는 반드시 순서대로 불러야 하며, 건너뛸 수 없습니다.</li>
          <li>31을 말하게 되는 사람이 패배합니다.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          필승 전략 & 공략 팁
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          베스킨라빈스 31에는 수학적으로 유리한 전략이 존재합니다. 핵심은
          4의 배수를 선점하는 것입니다.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>4의 배수 전략:</strong> 4, 8, 12, 16, 20, 24, 28을
            말하는 마지막 숫자로 만들면 유리합니다. 상대가 몇 개를 부르든
            내가 4의 배수에 도달할 수 있기 때문입니다.
          </li>
          <li>
            <strong>원리:</strong> 상대가 1개를 부르면 나는 3개, 상대가 2개를
            부르면 나는 2개, 상대가 3개를 부르면 나는 1개를 불러서 항상 합이
            4가 되도록 조절할 수 있습니다.
          </li>
          <li>
            <strong>선공 유불리:</strong> 이론상 선공이 유리합니다. 첫 턴에
            4의 배수(4)에 도달하도록 &quot;1, 2, 3, 4&quot;를 부르면 이후 계속
            4의 배수를 유지할 수 있습니다.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          온라인으로 베스킨라빈스 31 하는 법
        </h2>
        <p className="text-gray-600 leading-relaxed">
          이 온라인 버전에서는 AI 대전과 2인 대전 두 가지 모드를 지원합니다.
          AI 대전 모드에서는 컴퓨터와 1:1로 대결하며, AI는 전략적으로
          플레이하지만 가끔 실수를 하기 때문에 충분히 이길 수 있습니다. 2인
          대전 모드에서는 한 기기에서 친구와 번갈아가며 플레이할 수 있어 술자리
          게임으로 활용하기에 좋습니다.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">
              베스킨라빈스 31에서 항상 이기는 방법이 있나요?
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              수학적으로 선공이 4의 배수를 선점하면 필승할 수 있습니다. 하지만
              실제 게임에서는 상대도 이 전략을 알 수 있으므로, 먼저 시작하는
              것이 중요합니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              몇 명까지 플레이할 수 있나요?
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              원래 게임은 여러 명이 돌아가며 플레이할 수 있지만, 이 온라인
              버전에서는 2인 대전(AI 포함)을 지원합니다. 오프라인에서는 3명
              이상도 가능하며, 이 경우 필승 전략이 달라질 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              술자리에서 벌칙은 보통 뭘 하나요?
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              31을 말한 사람에게 주로 음료 한 잔 마시기, 간단한 벌칙 수행 등을
              부여합니다. 벌칙의 강도는 참여자들이 사전에 정하면 더 재미있게
              즐길 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
