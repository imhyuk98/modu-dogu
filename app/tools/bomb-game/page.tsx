"use client";

import { useState, useEffect, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

const BOMB_PENALTIES = [
  "소주 한 잔!", "맥주 원샷!", "셀카 찍어서 올리기!", "애교 부리기!",
  "노래 한 소절!", "춤 한 곡!", "옆 사람에게 고백하기!", "10초간 무표정!",
  "사투리로 1분 대화!", "개인기 보여주기!", "건배사 하기!", "방귀 소리 내기!",
  "아기 흉내 내기!", "윙크 10번!", "스쿼트 5개!", "옆 사람 칭찬 3개!",
  "랩으로 자기소개!", "원숭이 흉내!", "잠금화면 공개!", "성대모사 하기!",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function BombGamePage() {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [penalty, setPenalty] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [shaking, setShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef(0);

  const addName = () => {
    const n = input.trim();
    if (n && !names.includes(n)) {
      setNames([...names, n]);
      setInput("");
    }
  };

  const removeName = (idx: number) => {
    setNames(names.filter((_, i) => i !== idx));
  };

  const startGame = () => {
    if (names.length < 2) return;
    const duration = Math.floor(Math.random() * 26) + 5;
    endTimeRef.current = Date.now() + duration * 1000;
    setTimeLeft(duration);
    setCurrentIdx(0);
    setExploded(false);
    setStarted(true);
    setShaking(false);
  };

  useEffect(() => {
    if (started && !exploded) {
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 5 && remaining > 0) {
          setShaking(true);
        }
        if (remaining <= 0) {
          setExploded(true);
          setPenalty(pickRandom(BOMB_PENALTIES));
          setShaking(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, exploded]);

  const passNext = () => {
    if (!exploded) {
      setCurrentIdx((i) => (i + 1) % names.length);
    }
  };

  const reset = () => {
    setStarted(false);
    setExploded(false);
    setShaking(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">💣 폭탄 돌리기</h1>
      <p className="text-gray-500 mb-6">
        랜덤 타이머로 긴장감 넘치는 폭탄 돌리기! 폭탄을 피해라!
      </p>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 text-white min-h-[400px]">
        {!started ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">참가자 추가</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addName()}
                  placeholder="이름 입력"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
                <button onClick={addName} className="px-4 py-3 bg-pink-500 hover:bg-pink-400 rounded-lg font-bold transition-colors">추가</button>
              </div>
            </div>
            {names.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {names.map((name, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-full text-sm">
                    {name}
                    <button onClick={() => removeName(i)} className="text-gray-400 hover:text-red-400 ml-1">x</button>
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={startGame}
              disabled={names.length < 2}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {names.length < 2 ? "최소 2명 필요" : "게임 시작!"}
            </button>
          </div>
        ) : exploded ? (
          <div className="text-center space-y-6">
            <div className="text-7xl animate-bounce">💥</div>
            <h3 className="text-2xl font-bold text-red-400">펑!</h3>
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6">
              <p className="text-lg text-purple-200 mb-1">
                <span className="text-yellow-300 font-bold text-2xl">{names[currentIdx]}</span>님 벌칙!
              </p>
              <p className="text-xl font-bold text-red-300 mt-3">{penalty}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={startGame} className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 rounded-xl font-bold transition-colors">다시 하기</button>
              <button onClick={reset} className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold transition-colors">설정으로</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className={`text-7xl ${shaking ? "animate-[shake_0.1s_infinite]" : "animate-pulse"}`}>💣</div>
            <div className="bg-gray-800 rounded-2xl p-6">
              <p className="text-sm text-purple-300 mb-1">현재 차례</p>
              <p className="text-3xl font-bold text-yellow-300">{names[currentIdx]}</p>
            </div>
            <button
              onClick={passNext}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-bold hover:from-orange-400 hover:to-red-400 transition-all animate-pulse"
            >
              다음 사람에게 넘기기!
            </button>
            <button onClick={reset} className="w-full py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors">처음으로</button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 text-sm">🍺 음주는 적당히! 건강한 음주 문화를 만들어 갑시다.</p>
        <p className="text-amber-500 text-xs mt-1">19세 미만 음주는 법으로 금지되어 있습니다.</p>
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">폭탄 돌리기란?</h2>
          <p className="text-gray-600 leading-relaxed">
            폭탄 돌리기는 랜덤 타이머가 설정된 가상의 폭탄을 참가자들끼리 돌리는 게임입니다.
            폭탄이 터지는 순간을 알 수 없어 긴장감이 넘치며, 폭탄을 가지고 있을 때 터지면 벌칙을 받습니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">게임 규칙</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>참가자 이름을 2명 이상 입력합니다.</li>
            <li>게임이 시작되면 첫 번째 사람부터 폭탄을 받습니다.</li>
            <li>&apos;다음 사람에게 넘기기&apos; 버튼을 눌러 폭탄을 넘깁니다.</li>
            <li>5~30초 사이 랜덤 시간에 폭탄이 터집니다.</li>
            <li>폭탄이 터졌을 때 가지고 있던 사람이 랜덤 벌칙을 수행합니다.</li>
          </ol>
        </div>
      </section>

      <RelatedTools current="bomb-game" />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          50% { transform: translateX(5px) rotate(5deg); }
          75% { transform: translateX(-3px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
