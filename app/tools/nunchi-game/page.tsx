"use client";
/* eslint-disable react-hooks/set-state-in-effect -- restores browser-only game records */

import { useState, useEffect, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";
import DailyChallenge from "@/components/viral/DailyChallenge";
import ShareActions from "@/components/ShareActions";
import { trackEvent } from "@/lib/analytics";

const NUNCHI_CHALLENGES = [
  { label: "눈치 게임 3라운드 이어가기", target: 3 },
  { label: "오늘은 5라운드까지 생존하기", target: 5 },
  { label: "친구들과 7라운드 완주하기", target: 7 },
];

type GamePhase = "setup" | "countdown" | "tap" | "result" | "gameover";
type GameMode = "timing" | "random";
type GameSetting = "모임" | "교실" | "MT";

const SETTING_RULES: Record<GameSetting, string> = {
  모임: "휴대폰을 가운데 두고 각자 이름 버튼을 누릅니다. 겹치거나 마지막이면 가벼운 벌칙!",
  교실: "소리 대신 이름 버튼만 누르고, 벌칙은 자리 정리·칭찬 한마디처럼 조용한 것으로 정하세요.",
  MT: "팀 이름으로 등록해 팀 대항으로 진행할 수 있습니다. 음주는 규칙이 아니며 강요하지 마세요.",
};

interface Player {
  name: string;
  penalties: number;
}

interface TapRecord {
  playerIndex: number;
  time: number;
}

export default function NunchiGamePage() {
  const [mode, setMode] = useState<GameMode>("timing");
  const [setting, setSetting] = useState<GameSetting>("모임");
  const [players, setPlayers] = useState<Player[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [round, setRound] = useState(1);
  const [targetNumber, setTargetNumber] = useState(1);
  const [countdownValue, setCountdownValue] = useState(3);
  const [taps, setTaps] = useState<TapRecord[]>([]);
  const [collisions, setCollisions] = useState<number[]>([]);
  const [lastPlayer, setLastPlayer] = useState<number | null>(null);
  const [safeOrder, setSafeOrder] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [shakeIndices, setShakeIndices] = useState<number[]>([]);
  const [randomTarget, setRandomTarget] = useState<number | null>(null);
  const [randomCountdown, setRandomCountdown] = useState(5);
  const [randomFailed, setRandomFailed] = useState(false);
  const [randomSuccess, setRandomSuccess] = useState(false);
  const [savedGames, setSavedGames] = useState(0);
  const [bestRounds, setBestRounds] = useState(0);
  const tapsRef = useRef<TapRecord[]>([]);

  const COLLISION_THRESHOLD = 300; // ms

  useEffect(() => {
    setSavedGames(Number(localStorage.getItem("nunchi:games") ?? 0));
    setBestRounds(Number(localStorage.getItem("nunchi:best-rounds") ?? 0));
  }, []);

  const addPlayer = () => {
    const n = input.trim();
    if (n && !players.some((p) => p.name === n) && players.length < 8) {
      setPlayers([...players, { name: n, penalties: 0 }]);
      setInput("");
    }
  };

  const removePlayer = (idx: number) => {
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const startGame = () => {
    if (players.length < 2) return;
    trackEvent("tool_start", { tool: "nunchi-game", mode, setting, players: players.length });
    setRound(1);
    setTargetNumber(1);
    setPlayers(players.map((p) => ({ ...p, penalties: 0 })));
    startCountdown();
  };

  const startCountdown = () => {
    setPhase("countdown");
    setCountdownValue(3);
    setTaps([]);
    tapsRef.current = [];
    setCollisions([]);
    setLastPlayer(null);
    setSafeOrder([]);
    setMessage("");
    setShakeIndices([]);
    setRandomTarget(null);
    setRandomFailed(false);
    setRandomSuccess(false);
  };

  useEffect(() => {
    if (phase === "countdown") {
      if (countdownValue > 0) {
        const t = setTimeout(() => setCountdownValue((v) => v - 1), 1000);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          if (mode === "random") {
            const idx = Math.floor(Math.random() * players.length);
            setRandomTarget(idx);
            setRandomCountdown(5);
            setRandomFailed(false);
            setRandomSuccess(false);
          }
          setPhase("tap");
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [phase, countdownValue, mode, players.length]);

  // Random mode countdown timer
  useEffect(() => {
    if (phase === "tap" && mode === "random" && randomTarget !== null && !randomFailed && !randomSuccess) {
      if (randomCountdown > 0) {
        const t = setTimeout(() => setRandomCountdown((v) => v - 1), 1000);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setRandomFailed(true);
          setPlayers((prev) =>
            prev.map((p, i) => (i === randomTarget ? { ...p, penalties: p.penalties + 1 } : p))
          );
          setShakeIndices([randomTarget]);
          setMessage(`${players[randomTarget].name}님이 시간 초과! 벌칙!`);
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [phase, mode, randomTarget, randomCountdown, randomFailed, randomSuccess, players]);

  const handleTap = (playerIndex: number, timestamp: number) => {
    if (phase !== "tap") return;

    if (mode === "random") {
      if (randomTarget === null || randomFailed || randomSuccess) return;
      if (playerIndex === randomTarget) {
        setRandomSuccess(true);
        setMessage(`${players[playerIndex].name}님 성공!`);
        setSafeOrder([playerIndex]);
      } else {
        // Wrong person tapped
        setRandomFailed(true);
        setPlayers((prev) =>
          prev.map((p, i) => (i === playerIndex ? { ...p, penalties: p.penalties + 1 } : p))
        );
        setShakeIndices([playerIndex]);
        setMessage(`${players[playerIndex].name}님이 잘못 외쳤습니다! 벌칙!`);
      }
      return;
    }

    // Timing mode
    if (tapsRef.current.some((t) => t.playerIndex === playerIndex)) return;

    const record: TapRecord = { playerIndex, time: timestamp };
    tapsRef.current = [...tapsRef.current, record];
    setTaps([...tapsRef.current]);

    if (tapsRef.current.length === players.length) {
      evaluateRound();
    }
  };

  const evaluateRound = () => {
    const sorted = [...tapsRef.current].sort((a, b) => a.time - b.time);
    const collisionSet = new Set<number>();
    const safe: number[] = [];

    for (let i = 0; i < sorted.length; i++) {
      let isCollision = false;
      for (let j = 0; j < sorted.length; j++) {
        if (i !== j && Math.abs(sorted[i].time - sorted[j].time) <= COLLISION_THRESHOLD) {
          isCollision = true;
          collisionSet.add(sorted[j].playerIndex);
        }
      }
      if (isCollision) {
        collisionSet.add(sorted[i].playerIndex);
      } else {
        safe.push(sorted[i].playerIndex);
      }
    }

    // Last person to tap (if not already in collision) gets penalty
    const lastIdx = sorted[sorted.length - 1]?.playerIndex;
    const lastPenalty = !collisionSet.has(lastIdx) ? lastIdx : null;

    const penaltyPlayers = new Set(collisionSet);
    if (lastPenalty !== null) penaltyPlayers.add(lastPenalty);

    setCollisions(Array.from(collisionSet));
    setLastPlayer(lastPenalty !== null ? lastPenalty : null);
    setSafeOrder(safe.filter((idx) => !penaltyPlayers.has(idx)));
    setShakeIndices(Array.from(penaltyPlayers));

    setPlayers((prev) =>
      prev.map((p, i) => (penaltyPlayers.has(i) ? { ...p, penalties: p.penalties + 1 } : p))
    );

    const msgs: string[] = [];
    if (collisionSet.size > 0) {
      const names = Array.from(collisionSet)
        .map((i) => players[i].name)
        .join(", ");
      msgs.push(`겹침! ${names}`);
    }
    if (lastPenalty !== null && !collisionSet.has(lastPenalty)) {
      msgs.push(`꼴찌! ${players[lastPenalty].name}`);
    }
    if (msgs.length === 0) {
      msgs.push("모두 안전!");
    }
    setMessage(msgs.join(" / "));
    setPhase("result");
  };

  const nextRound = () => {
    const newRound = round + 1;
    setRound(newRound);
    setTargetNumber(newRound);
    startCountdown();
  };

  const endGame = () => {
    const gameCount = savedGames + 1;
    const newBest = Math.max(bestRounds, round);
    setSavedGames(gameCount);
    setBestRounds(newBest);
    localStorage.setItem("nunchi:games", String(gameCount));
    localStorage.setItem("nunchi:best-rounds", String(newBest));
    trackEvent("tool_complete", { tool: "nunchi-game", mode, setting, rounds: round, players: players.length });
    setPhase("gameover");
  };

  const resetGame = () => {
    setPhase("setup");
    setRound(1);
    setTargetNumber(1);
    setTaps([]);
    tapsRef.current = [];
    setCollisions([]);
    setLastPlayer(null);
    setSafeOrder([]);
    setMessage("");
    setShakeIndices([]);
  };

  const sortedLeaderboard = [...players].sort((a, b) => a.penalties - b.penalties);

  const hasTapped = (idx: number) => taps.some((t) => t.playerIndex === idx);

  const getPlayerStatus = (idx: number) => {
    if (phase === "result" || (phase === "tap" && mode === "random" && (randomFailed || randomSuccess))) {
      if (collisions.includes(idx)) return "collision";
      if (lastPlayer === idx) return "last";
      if (safeOrder.includes(idx)) return "safe";
      if (shakeIndices.includes(idx)) return "collision";
    }
    return "neutral";
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "collision":
        return "bg-red-100 border-red-400 text-red-800";
      case "last":
        return "bg-orange-100 border-orange-400 text-orange-800";
      case "safe":
        return "bg-green-100 border-green-400 text-green-800";
      default:
        return "bg-white border-gray-200 text-gray-800";
    }
  };

  const shakeStyle = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px) rotate(-5deg); }
      50% { transform: translateX(5px) rotate(5deg); }
      75% { transform: translateX(-3px) rotate(-3deg); }
    }
  `;

  // Setup phase
  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2 tracking-tight">눈치 게임</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          타이밍 싸움! 눈치껏 숫자를 외치세요
        </p>

        <DailyChallenge id="nunchi-game" challenges={NUNCHI_CHALLENGES} currentValue={round} unit="R" />

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700">어디서 하나요?</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(Object.keys(SETTING_RULES) as GameSetting[]).map((value) => (
              <button key={value} type="button" onClick={() => setSetting(value)} className={`min-h-11 rounded-xl border text-sm font-bold ${setting === value ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 text-gray-600"}`}>{value}</button>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-700"><strong>{setting} 규칙:</strong> {SETTING_RULES[setting]}</p>
        </div>

        {/* Mode selection */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">게임 모드</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("timing")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                mode === "timing"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-base mb-1">타이밍 모드</div>
              <div className="text-xs text-gray-600">
                모두 동시에 터치! 겹치면 벌칙
              </div>
            </button>
            <button
              onClick={() => setMode("random")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                mode === "random"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-base mb-1">랜덤 지목</div>
              <div className="text-xs text-gray-600">
                랜덤으로 한 명 지목! 빠르게 외쳐라
              </div>
            </button>
          </div>
        </div>

        {/* Player input */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            참가자 등록 ({players.length}/8)
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="이름 입력"
              maxLength={10}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addPlayer}
              disabled={players.length >= 8}
              className="px-5 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-40 transition-colors"
            >
              추가
            </button>
          </div>

          {players.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {players.map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  {p.name}
                  <button
                    onClick={() => removePlayer(i)}
                    className="ml-1 text-gray-400 hover:text-red-500 font-bold"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={startGame}
          disabled={players.length < 2}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-40 transition-all"
        >
          게임 시작! ({players.length}명)
        </button>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <span>이 브라우저 기록 · {savedGames}게임 · 최고 {bestRounds}라운드</span>
          <button type="button" onClick={() => { localStorage.removeItem("nunchi:games"); localStorage.removeItem("nunchi:best-rounds"); setSavedGames(0); setBestRounds(0); }} className="font-bold underline">기록 초기화</button>
        </div>
        <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900">참가자 이름과 게임 기록은 이 브라우저에만 저장됩니다. 실명 대신 별명을 써도 됩니다.</p>

        {/* SEO Section */}
        <section className="mt-12 space-y-6 text-sm text-gray-600">
          <h2 className="text-lg font-bold text-gray-800">눈치 게임이란?</h2>
          <p>
            눈치 게임은 한국의 대표적인 술자리 게임 중 하나입니다. 참가자들이 1부터
            순서대로 숫자를 하나씩 외치는데, 두 명 이상이 동시에 같은 숫자를 외치면
            벌칙을 받습니다. 마지막까지 남은 사람도 벌칙 대상이 됩니다.
          </p>

          <h2 className="text-lg font-bold text-gray-800">게임 규칙</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>타이밍 모드:</strong> 모든 참가자가 동시에 &quot;외치기!&quot; 버튼을
              터치합니다. 0.3초 이내에 겹치면 벌칙, 마지막 터치자도 벌칙을 받습니다.
            </li>
            <li>
              <strong>랜덤 지목 모드:</strong> 게임이 랜덤으로 한 명을 지목합니다. 지목된
              사람만 빠르게 버튼을 눌러야 합니다. 5초 안에 누르지 못하면 벌칙!
            </li>
            <li>벌칙 횟수가 가장 적은 사람이 우승합니다.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-800">눈치 게임 팁</h2>
          <p>
            타이밍 모드에서는 너무 빠르거나 너무 느리면 안 됩니다. 다른 참가자들의
            움직임을 잘 관찰하면서 적절한 타이밍에 버튼을 눌러야 합니다. 랜덤 지목
            모드에서는 항상 긴장을 유지하고, 자신의 이름이 표시되면 즉시 반응해야 합니다.
          </p>

          <h2 className="text-lg font-bold text-gray-800">술자리 게임 추천</h2>
          <p>
            눈치 게임은 2명부터 8명까지 즐길 수 있어 소규모 모임부터 대규모 파티까지
            적합합니다. 스마트폰 하나로 간편하게 플레이할 수 있으며, 별도의 준비물 없이
            바로 시작할 수 있습니다.
          </p>
        </section>

        <RelatedTools current="nunchi-game" />
      </div>
    );
  }

  // Countdown phase
  if (phase === "countdown") {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-2 text-sm">라운드 {round}</p>
        <div className="text-9xl font-black text-blue-500 animate-pulse">
          {countdownValue || "GO!"}
        </div>
        <p className="mt-6 text-lg text-gray-600">
          {mode === "timing" ? "전원 준비!" : "누가 지목될까...?"}
        </p>
      </div>
    );
  }

  // Tap phase
  if (phase === "tap") {
    if (mode === "random") {
      return (
        <div className="max-w-xl mx-auto">
          <style>{shakeStyle}</style>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">라운드 {round}</p>
            <div className="text-5xl font-black text-purple-600 mt-2 mb-1">
              {targetNumber}
            </div>
            <p className="text-sm text-gray-400">이 숫자를 외칠 사람은?</p>
          </div>

          {!randomFailed && !randomSuccess && (
            <div className="text-center mb-4">
              <div
                className={`inline-block text-2xl font-bold px-4 py-2 rounded-xl ${
                  randomCountdown <= 2
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {randomCountdown}초
              </div>
            </div>
          )}

          {/* Show target player or result */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 text-center">
            {!randomFailed && !randomSuccess && randomTarget !== null && (
              <>
                <p className="text-sm text-purple-500 mb-2">지목된 사람</p>
                <p className="text-4xl font-black text-purple-700 animate-bounce">
                  {players[randomTarget].name}
                </p>
              </>
            )}
            {(randomFailed || randomSuccess) && (
              <p
                className={`text-2xl font-bold ${
                  randomSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* Player buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {players.map((p, i) => {
              const status = getPlayerStatus(i);
              const isTarget = i === randomTarget;
              return (
                <button
                  key={i}
                  onClick={(event) => handleTap(i, event.timeStamp)}
                  disabled={randomFailed || randomSuccess}
                  className={`p-5 rounded-2xl border-2 font-bold text-lg transition-all active:scale-95 ${
                    randomFailed || randomSuccess
                      ? `${statusColor(status)} ${
                          shakeIndices.includes(i) ? "animate-[shake_0.5s_ease-in-out]" : ""
                        }`
                      : isTarget
                      ? "bg-purple-500 text-white border-purple-600 hover:bg-purple-600"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div>{p.name}</div>
                  <div className="text-xs mt-1 opacity-60">벌칙 {p.penalties}회</div>
                </button>
              );
            })}
          </div>

          {(randomFailed || randomSuccess) && (
            <div className="flex gap-3">
              <button
                onClick={nextRound}
                className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-bold text-lg hover:bg-purple-600 transition-colors"
              >
                다음 라운드
              </button>
              <button
                onClick={endGame}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
              >
                종료
              </button>
            </div>
          )}
        </div>
      );
    }

    // Timing mode - tap phase
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">라운드 {round}</p>
          <div className="text-6xl font-black text-blue-600 mt-2 mb-1">
            {targetNumber}
          </div>
          <p className="text-sm text-gray-400">이 숫자를 외쳐라!</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {players.map((p, i) => {
            const tapped = hasTapped(i);
            const tapOrder = taps.findIndex((t) => t.playerIndex === i);
            return (
              <button
                key={i}
                onClick={(event) => handleTap(i, event.timeStamp)}
                disabled={tapped}
                className={`relative p-6 rounded-2xl border-2 font-bold text-lg transition-all active:scale-95 ${
                  tapped
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                <div className="text-xl">{p.name}</div>
                <div className="text-xs mt-1 opacity-50">벌칙 {p.penalties}회</div>
                {tapped && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {tapOrder + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-400">
          {taps.length}/{players.length}명 터치 완료
        </div>
      </div>
    );
  }

  // Result phase (timing mode only)
  if (phase === "result") {
    return (
      <div className="max-w-xl mx-auto">
        <style>{shakeStyle}</style>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">라운드 {round} 결과</p>
          <p className="text-2xl font-bold mt-2">{message}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {players.map((p, i) => {
            const status = getPlayerStatus(i);
            const tapOrder = taps.findIndex((t) => t.playerIndex === i);
            return (
              <div
                key={i}
                className={`relative p-5 rounded-2xl border-2 transition-all ${statusColor(
                  status
                )} ${shakeIndices.includes(i) ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
              >
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-xs mt-1 opacity-60">벌칙 {p.penalties}회</div>
                {tapOrder >= 0 && (
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                      status === "safe"
                        ? "bg-green-500 text-white"
                        : status === "collision" || status === "last"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {tapOrder + 1}
                  </div>
                )}
                {collisions.includes(i) && (
                  <div className="text-xs font-bold text-red-600 mt-1">겹침!</div>
                )}
                {lastPlayer === i && !collisions.includes(i) && (
                  <div className="text-xs font-bold text-orange-600 mt-1">꼴찌!</div>
                )}
                {status === "safe" && (
                  <div className="text-xs font-bold text-green-600 mt-1">안전!</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={nextRound}
            className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            다음 라운드
          </button>
          <button
            onClick={endGame}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
          >
            종료
          </button>
        </div>
      </div>
    );
  }

  // Game over - leaderboard
  if (phase === "gameover") {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">&#127942;</div>
          <h2 className="text-2xl font-black text-gray-800">최종 결과</h2>
          <p className="text-gray-500 text-sm mt-1">총 {round}라운드 진행</p>
        </div>

        <DailyChallenge id="nunchi-game" challenges={NUNCHI_CHALLENGES} currentValue={round} unit="R" />

        <div className="space-y-3 mb-8">
          {sortedLeaderboard.map((p, rank) => {
            const medal =
              rank === 0 ? "bg-yellow-100 border-yellow-400" :
              rank === 1 ? "bg-gray-100 border-gray-300" :
              rank === 2 ? "bg-orange-50 border-orange-300" :
              "bg-white border-gray-200";
            const rankLabel =
              rank === 0 ? "1st" : rank === 1 ? "2nd" : rank === 2 ? "3rd" : `${rank + 1}th`;
            return (
              <div
                key={p.name}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${medal}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                    rank === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : rank === 1
                      ? "bg-gray-400 text-white"
                      : rank === 2
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {rankLabel}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{p.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-red-500">{p.penalties}</div>
                  <div className="text-xs text-gray-400">벌칙</div>
                </div>
              </div>
            );
          })}
        </div>

        <ShareActions tool="nunchi-game" title="눈치 게임 결과" text={`${setting} 눈치 게임 ${round}라운드! 우승은 ${sortedLeaderboard[0]?.name ?? "누구"}, 벌칙 ${sortedLeaderboard[0]?.penalties ?? 0}회`} />

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              trackEvent("tool_start", { tool: "nunchi-game", mode, setting, flow: "retry" });
              setRound(1);
              setTargetNumber(1);
              setPlayers(players.map((p) => ({ ...p, penalties: 0 })));
              startCountdown();
            }}
            className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            다시 하기
          </button>
          <button
            onClick={resetGame}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
          >
            처음으로
          </button>
        </div>

        {/* SEO Section */}
        <section className="mt-12 space-y-6 text-sm text-gray-600">
          <h2 className="text-lg font-bold text-gray-800">눈치 게임이란?</h2>
          <p>
            눈치 게임은 한국의 대표적인 술자리 게임 중 하나입니다. 참가자들이 1부터
            순서대로 숫자를 하나씩 외치는데, 두 명 이상이 동시에 같은 숫자를 외치면
            벌칙을 받습니다. 마지막까지 남은 사람도 벌칙 대상이 됩니다.
          </p>

          <h2 className="text-lg font-bold text-gray-800">게임 규칙</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>타이밍 모드:</strong> 모든 참가자가 동시에 &quot;외치기!&quot; 버튼을
              터치합니다. 0.3초 이내에 겹치면 벌칙, 마지막 터치자도 벌칙을 받습니다.
            </li>
            <li>
              <strong>랜덤 지목 모드:</strong> 게임이 랜덤으로 한 명을 지목합니다. 지목된
              사람만 빠르게 버튼을 눌러야 합니다. 5초 안에 누르지 못하면 벌칙!
            </li>
            <li>벌칙 횟수가 가장 적은 사람이 우승합니다.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-800">눈치 게임 팁</h2>
          <p>
            타이밍 모드에서는 너무 빠르거나 너무 느리면 안 됩니다. 다른 참가자들의
            움직임을 잘 관찰하면서 적절한 타이밍에 버튼을 눌러야 합니다. 랜덤 지목
            모드에서는 항상 긴장을 유지하고, 자신의 이름이 표시되면 즉시 반응해야 합니다.
          </p>

          <h2 className="text-lg font-bold text-gray-800">술자리 게임 추천</h2>
          <p>
            눈치 게임은 2명부터 8명까지 즐길 수 있어 소규모 모임부터 대규모 파티까지
            적합합니다. 스마트폰 하나로 간편하게 플레이할 수 있으며, 별도의 준비물 없이
            바로 시작할 수 있습니다.
          </p>
        </section>

        <RelatedTools current="nunchi-game" />
      </div>
    );
  }

  return null;
}
