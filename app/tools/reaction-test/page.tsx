"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type Phase = "idle" | "waiting" | "ready" | "result" | "tooEarly" | "done";

function getGrade(ms: number): { label: string; color: string } {
  if (ms <= 150) return { label: "번개", color: "text-yellow-500" };
  if (ms <= 200) return { label: "매우 빠름", color: "text-green-500" };
  if (ms <= 250) return { label: "빠름", color: "text-blue-500" };
  if (ms <= 300) return { label: "보통", color: "text-gray-600" };
  if (ms <= 400) return { label: "느림", color: "text-orange-500" };
  return { label: "거북이", color: "text-red-500" };
}

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [bestRecord, setBestRecord] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("reaction-test-best");
    if (saved) setBestRecord(parseFloat(saved));
  }, []);

  const saveBest = useCallback(
    (avg: number) => {
      if (bestRecord === null || avg < bestRecord) {
        setBestRecord(avg);
        localStorage.setItem("reaction-test-best", avg.toString());
      }
    },
    [bestRecord]
  );

  const startRound = useCallback(() => {
    setPhase("waiting");
    const delay = 1000 + Math.random() * 4000;
    timerRef.current = setTimeout(() => {
      setPhase("ready");
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "idle") {
      setTimes([]);
      startRound();
      return;
    }

    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooEarly");
      return;
    }

    if (phase === "ready") {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setCurrentTime(elapsed);
      const newTimes = [...times, elapsed];
      setTimes(newTimes);

      if (newTimes.length >= 5) {
        const avg = Math.round(
          newTimes.reduce((a, b) => a + b, 0) / newTimes.length
        );
        saveBest(avg);
        setPhase("done");
      } else {
        setPhase("result");
      }
      return;
    }

    if (phase === "tooEarly") {
      startRound();
      return;
    }

    if (phase === "result") {
      startRound();
      return;
    }

    if (phase === "done") {
      setTimes([]);
      setPhase("idle");
    }
  }, [phase, times, startRound, saveBest]);

  const average =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;

  const getBackground = () => {
    switch (phase) {
      case "waiting":
        return "bg-red-500";
      case "ready":
        return "bg-green-500";
      case "tooEarly":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getMessage = () => {
    switch (phase) {
      case "idle":
        return null;
      case "waiting":
        return "초록색으로 바뀌면 클릭하세요!";
      case "ready":
        return "지금 클릭하세요!";
      case "tooEarly":
        return "너무 빨라요! 클릭하여 다시 시도하세요";
      case "result":
        return `${currentTime}ms! 클릭하여 계속`;
      case "done":
        return null;
    }
  };

  if (phase === "done") {
    const grade = getGrade(average);
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          반응속도 테스트
        </h1>
        <p className="text-gray-500 mb-8">
          화면이 초록색으로 바뀌면 클릭! 5회 측정 결과입니다.
        </p>

        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-8 text-center">
            <p className="text-blue-100 text-sm mb-1">평균 반응속도</p>
            <p className="text-5xl font-bold mb-2">{average}ms</p>
            <p className={`text-2xl font-semibold ${grade.color}`}>
              {grade.label}
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">회차별 기록</h3>
            <div className="grid grid-cols-5 gap-3">
              {times.map((t, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-xs text-gray-400 mb-1">{i + 1}회</p>
                  <p className="text-lg font-bold text-gray-900">{t}ms</p>
                </div>
              ))}
            </div>

            {bestRecord !== null && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-yellow-700">
                  최고 기록: <span className="font-bold">{bestRecord}ms</span>
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">등급 기준</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {[
                  { range: "~150ms", label: "번개", color: "text-yellow-500" },
                  {
                    range: "~200ms",
                    label: "매우 빠름",
                    color: "text-green-500",
                  },
                  { range: "~250ms", label: "빠름", color: "text-blue-500" },
                  { range: "~300ms", label: "보통", color: "text-gray-600" },
                  { range: "~400ms", label: "느림", color: "text-orange-500" },
                  { range: "400ms+", label: "거북이", color: "text-red-500" },
                ].map((g) => (
                  <div
                    key={g.label}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className={`font-semibold ${g.color}`}>
                      {g.label}
                    </span>
                    <span className="text-gray-400">{g.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleClick}
            className="calc-btn-primary px-8 py-3 text-lg"
          >
            다시 하기
          </button>
        </div>

        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              반응속도란?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              반응속도(Reaction Time)는 자극을 인지한 후 반응하기까지 걸리는
              시간입니다. 일반적인 성인의 시각 반응속도는 200~300ms(밀리초)
              정도이며, 꾸준한 훈련을 통해 향상시킬 수 있습니다. 게이머, 운전자,
              운동선수 등에게 특히 중요한 능력입니다.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              반응속도를 높이는 방법
            </h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>충분한 수면과 휴식을 취하세요</li>
              <li>카페인은 일시적으로 반응속도를 향상시킬 수 있습니다</li>
              <li>규칙적인 운동이 전반적인 반응속도 향상에 도움됩니다</li>
              <li>반복적인 연습을 통해 점진적으로 개선할 수 있습니다</li>
            </ul>
          </div>
        </section>

        <RelatedTools current="reaction-test" />
      </div>
    );
  }

  if (phase === "idle") {
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          반응속도 테스트
        </h1>
        <p className="text-gray-500 mb-8">
          화면이 초록색으로 바뀌면 최대한 빨리 클릭하세요! 5회 측정 후 평균을
          계산합니다.
        </p>

        {bestRecord !== null && (
          <div className="mb-6 p-3 bg-yellow-50 rounded-lg text-center">
            <p className="text-sm text-yellow-700">
              최고 기록: <span className="font-bold">{bestRecord}ms</span>
            </p>
          </div>
        )}

        <div
          onClick={handleClick}
          className="bg-blue-500 rounded-xl cursor-pointer select-none flex flex-col items-center justify-center text-white"
          style={{ minHeight: "400px" }}
        >
          <p className="text-5xl font-bold mb-4">시작</p>
          <p className="text-xl text-blue-100">클릭하여 테스트를 시작하세요</p>
        </div>

        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              반응속도란?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              반응속도(Reaction Time)는 자극을 인지한 후 반응하기까지 걸리는
              시간입니다. 일반적인 성인의 시각 반응속도는 200~300ms(밀리초)
              정도이며, 꾸준한 훈련을 통해 향상시킬 수 있습니다. 게이머, 운전자,
              운동선수 등에게 특히 중요한 능력입니다.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              반응속도를 높이는 방법
            </h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>충분한 수면과 휴식을 취하세요</li>
              <li>카페인은 일시적으로 반응속도를 향상시킬 수 있습니다</li>
              <li>규칙적인 운동이 전반적인 반응속도 향상에 도움됩니다</li>
              <li>반복적인 연습을 통해 점진적으로 개선할 수 있습니다</li>
            </ul>
          </div>
        </section>

        <RelatedTools current="reaction-test" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">반응속도 테스트</h1>
        <p className="text-sm text-gray-500">
          {times.length + 1} / 5회
        </p>
      </div>

      <div
        onClick={handleClick}
        className={`${getBackground()} rounded-xl cursor-pointer select-none flex flex-col items-center justify-center text-white transition-colors duration-100`}
        style={{ minHeight: "400px" }}
      >
        <p className="text-3xl sm:text-4xl font-bold text-center px-4">
          {getMessage()}
        </p>
        {phase === "result" && (
          <p className="text-lg mt-2 text-blue-100">
            {times.length}/5 완료
          </p>
        )}
      </div>

      {times.length > 0 && (
        <div className="mt-4 flex gap-2 justify-center">
          {times.map((t, i) => (
            <div key={i} className="text-center p-2 bg-white rounded-lg border border-gray-200 min-w-[60px]">
              <p className="text-xs text-gray-400">{i + 1}회</p>
              <p className="text-sm font-bold text-gray-900">{t}ms</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
