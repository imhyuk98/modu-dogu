"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type Tab = "timer" | "stopwatch";

interface LapRecord {
  number: number;
  lapTime: number;
  totalTime: number;
}

// ─── Helpers ───────────────────────────────────────────────

function formatTime(ms: number, showCentiseconds = false): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (showCentiseconds) {
    const cs = Math.floor((ms % 1000) / 10);
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);

    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);
    osc2.start(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 1.1);
  } catch {
    // Web Audio API not available
  }
}

// ─── Timer Tab ─────────────────────────────────────────────

function TimerTab() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0); // ms remaining
  const [totalDuration, setTotalDuration] = useState(0); // ms total
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const endTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRemainingRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    const totalMs =
      pausedRemainingRef.current > 0
        ? pausedRemainingRef.current
        : (hours * 3600 + minutes * 60 + seconds) * 1000;

    if (totalMs <= 0) return;

    if (pausedRemainingRef.current === 0) {
      setTotalDuration(totalMs);
    }

    endTimeRef.current = Date.now() + totalMs;
    setIsRunning(true);
    setIsFinished(false);
    pausedRemainingRef.current = 0;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const left = endTimeRef.current - now;
      if (left <= 0) {
        setRemaining(0);
        setIsRunning(false);
        setIsFinished(true);
        clearTimer();
        playBeep();
      } else {
        setRemaining(left);
      }
    }, 100);
  }, [hours, minutes, seconds, clearTimer]);

  const handlePause = useCallback(() => {
    pausedRemainingRef.current = remaining;
    setIsRunning(false);
    clearTimer();
  }, [remaining, clearTimer]);

  const handleReset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(0);
    setTotalDuration(0);
    pausedRemainingRef.current = 0;
  }, [clearTimer]);

  const applyPreset = useCallback(
    (mins: number) => {
      handleReset();
      setHours(0);
      setMinutes(mins >= 60 ? 0 : mins);
      setSeconds(0);
      if (mins >= 60) setHours(Math.floor(mins / 60));
    },
    [handleReset]
  );

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const presets = [
    { label: "1분", mins: 1 },
    { label: "3분", mins: 3 },
    { label: "5분", mins: 5 },
    { label: "10분", mins: 10 },
    { label: "15분", mins: 15 },
    { label: "30분", mins: 30 },
    { label: "1시간", mins: 60 },
  ];

  const progressPercent =
    totalDuration > 0 ? ((totalDuration - remaining) / totalDuration) * 100 : 0;

  const displayTime =
    isRunning || remaining > 0 || isFinished
      ? formatTime(remaining)
      : formatTime((hours * 3600 + minutes * 60 + seconds) * 1000);

  return (
    <div>
      {/* Time input */}
      {!isRunning && remaining === 0 && !isFinished && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-center">
              <label className="block text-xs text-gray-500 mb-1">시간</label>
              <input
                type="number"
                min={0}
                max={99}
                value={hours}
                onChange={(e) =>
                  setHours(Math.max(0, Math.min(99, Number(e.target.value))))
                }
                className="w-20 text-center text-2xl font-mono border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-2xl font-bold text-gray-400 mt-5">:</span>
            <div className="text-center">
              <label className="block text-xs text-gray-500 mb-1">분</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) =>
                  setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))
                }
                className="w-20 text-center text-2xl font-mono border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-2xl font-bold text-gray-400 mt-5">:</span>
            <div className="text-center">
              <label className="block text-xs text-gray-500 mb-1">초</label>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) =>
                  setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))
                }
                className="w-20 text-center text-2xl font-mono border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.mins)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display */}
      <div
        className={`text-center py-10 rounded-xl mb-6 transition-colors ${
          isFinished
            ? "bg-red-50 border-2 border-red-300 animate-pulse"
            : "bg-gray-50"
        }`}
      >
        <p
          className={`text-7xl font-mono font-bold tabular-nums tracking-wider ${
            isFinished ? "text-red-500" : "text-gray-900"
          }`}
        >
          {displayTime}
        </p>
        {isFinished && (
          <p className="text-red-500 font-medium mt-3 text-lg">
            타이머 종료!
          </p>
        )}
      </div>

      {/* Progress bar */}
      {totalDuration > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className={`h-2 rounded-full transition-all duration-200 ${
              isFinished ? "bg-red-500" : "bg-blue-600"
            }`}
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={
              !isFinished &&
              remaining === 0 &&
              hours === 0 &&
              minutes === 0 &&
              seconds === 0
            }
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            시작
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-8 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            일시정지
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          리셋
        </button>
      </div>
    </div>
  );
}

// ─── Stopwatch Tab ─────────────────────────────────────────

function StopwatchTab() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearStopwatch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
  }, []);

  const handlePause = useCallback(() => {
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setIsRunning(false);
    clearStopwatch();
  }, [clearStopwatch]);

  const handleLap = useCallback(() => {
    const currentTotal = elapsed;
    const prevTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const lapTime = currentTotal - prevTotal;

    setLaps((prev) => [
      { number: prev.length + 1, lapTime, totalTime: currentTotal },
      ...prev,
    ]);
  }, [elapsed, laps]);

  const handleReset = useCallback(() => {
    clearStopwatch();
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
    accumulatedRef.current = 0;
  }, [clearStopwatch]);

  useEffect(() => {
    return clearStopwatch;
  }, [clearStopwatch]);

  // Find fastest / slowest laps (only if 2+ laps)
  let fastestIdx = -1;
  let slowestIdx = -1;
  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -1;
    laps.forEach((lap, i) => {
      if (lap.lapTime < minTime) {
        minTime = lap.lapTime;
        fastestIdx = i;
      }
      if (lap.lapTime > maxTime) {
        maxTime = lap.lapTime;
        slowestIdx = i;
      }
    });
  }

  return (
    <div>
      {/* Display */}
      <div className="text-center py-10 bg-gray-50 rounded-xl mb-6">
        <p className="text-7xl font-mono font-bold tabular-nums tracking-wider text-gray-900">
          {formatTime(elapsed, true)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-8">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            시작
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
            >
              일시정지
            </button>
            <button
              onClick={handleLap}
              className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              랩
            </button>
          </>
        )}
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          리셋
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="py-2 px-4 text-left font-medium">랩</th>
                <th className="py-2 px-4 text-right font-medium">
                  랩 타임
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  총 시간
                </th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, i) => {
                let rowClass = "";
                if (i === fastestIdx) rowClass = "text-green-600 bg-green-50";
                if (i === slowestIdx) rowClass = "text-red-600 bg-red-50";

                return (
                  <tr
                    key={lap.number}
                    className={`border-t border-gray-100 ${rowClass}`}
                  >
                    <td className="py-2 px-4">#{lap.number}</td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums">
                      {formatTime(lap.lapTime, true)}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums">
                      {formatTime(lap.totalTime, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────

export default function TimerStopwatchPage() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        타이머 & 스톱워치
      </h1>
      <p className="text-gray-500 mb-8">
        온라인 카운트다운 타이머와 스톱워치를 무료로 사용하세요. 랩 타임 기록도
        가능합니다.
      </p>

      {/* Tool area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "timer"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            타이머
          </button>
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "stopwatch"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            스톱워치
          </button>
        </div>

        {activeTab === "timer" ? <TimerTab /> : <StopwatchTab />}
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            온라인 타이머 활용법
          </h2>
          <p className="text-gray-600 leading-relaxed">
            온라인 타이머는 다양한 상황에서 유용하게 활용할 수 있습니다. 요리할
            때 조리 시간을 정확히 맞추거나, 운동 시 세트 간 휴식 시간을 관리하는
            데 적합합니다. 공부할 때는 포모도로 기법(25분 집중 + 5분 휴식)을
            적용하여 집중력을 높일 수 있고, 게임이나 퀴즈의 제한 시간 설정,
            프레젠테이션 연습 시 시간 관리 등에도 활용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            포모도로 기법이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            포모도로 기법(Pomodoro Technique)은 프란체스코 시릴로가 개발한 시간
            관리 방법입니다. 25분 동안 한 가지 작업에 집중하고, 5분간 휴식하는
            사이클을 반복합니다. 4번의 포모도로(약 2시간)를 완료한 후에는
            15~30분의 긴 휴식을 취합니다. 이 방법은 집중력 향상, 작업 분량 파악,
            번아웃 방지에 효과적이며, 위 타이머의 빠른 선택 버튼을 이용하면
            간편하게 포모도로 타이머를 설정할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            스톱워치 활용법
          </h2>
          <p className="text-gray-600 leading-relaxed">
            스톱워치는 경과 시간을 정확히 측정해야 할 때 사용합니다. 운동 기록
            측정(달리기, 수영, 자전거 등), 과학 실험의 반응 시간 측정, 업무 시간
            추적, 요리 레시피의 정확한 조리 시간 확인 등에 활용할 수 있습니다. 랩
            기능을 이용하면 중간 구간 기록을 남길 수 있어 운동 구간별 페이스를
            비교하거나, 작업 단계별 소요 시간을 분석하는 데 유용합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                브라우저를 닫으면 타이머가 유지되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                아니요, 이 타이머는 브라우저에서 실행되므로 탭이나 브라우저를
                닫으면 타이머가 초기화됩니다. 중요한 타이머는 탭을 닫지 않도록
                주의하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                타이머 종료 시 소리가 안 나요.
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                브라우저의 사운드 설정이 음소거되어 있지 않은지 확인하세요.
                일부 브라우저에서는 사용자가 페이지와 먼저 상호작용(클릭 등)을
                해야 소리 재생이 허용됩니다. 타이머 시작 버튼을 클릭하면 자동으로
                이 조건이 충족됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                백그라운드 탭에서도 정확하게 작동하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 이 타이머는 실제 시간(Date.now())을 기준으로 계산하므로
                백그라운드 탭에서도 정확한 시간을 표시합니다. 다만 화면 업데이트가
                느려질 수 있으나, 탭으로 돌아오면 즉시 정확한 시간이 표시됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                랩 타임이란 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                랩 타임(Lap Time)은 특정 구간의 경과 시간을 의미합니다. 예를 들어
                달리기에서 1바퀴를 도는 데 걸린 시간이 랩 타임입니다. 스톱워치를
                멈추지 않고 &quot;랩&quot; 버튼을 누르면 해당 시점까지의 구간
                시간이 기록되며, 가장 빠른 랩은 초록색, 가장 느린 랩은 빨간색으로
                표시됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="timer" />
</div>
  );
}
