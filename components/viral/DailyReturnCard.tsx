"use client";
/* eslint-disable react-hooks/set-state-in-effect -- localStorage hydration initializes local-only streak state */

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

function dateKey(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateStreak(days: string[]) {
  const completed = new Set(days);
  let offset = completed.has(dateKey()) ? 0 : -1;
  let streak = 0;
  while (completed.has(dateKey(offset))) {
    streak += 1;
    offset -= 1;
  }
  return streak;
}

export default function DailyReturnCard({ id, completed }: { id: string; completed: boolean }) {
  const [days, setDays] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);
  const storageKey = `daily-return:${id}`;

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as unknown;
      // Local-only history; ignore malformed or excessively large records.
      setDays(Array.isArray(parsed) ? parsed.filter((day): day is string => typeof day === "string").slice(-60) : []);
    } catch {
      setDays([]);
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready || !completed || days.includes(dateKey())) return;
    const next = [...days, dateKey()].slice(-60);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setDays(next);
    trackEvent("daily_return_complete", { tool: id, streak: calculateStreak(next) });
  }, [completed, days, id, ready, storageKey]);

  const streak = useMemo(() => calculateStreak(days), [days]);
  const week = Array.from({ length: 7 }, (_, index) => {
    const offset = index - 6;
    const key = dateKey(offset);
    return { key, done: days.includes(key), label: new Date(`${key}T12:00:00`).toLocaleDateString("ko-KR", { weekday: "short" }) };
  });

  const shareStreak = async () => {
    const text = `오늘의 운세 ${streak}일 연속 확인 중! 당신의 오늘 운세도 확인해보세요.`;
    try {
      if (navigator.share) await navigator.share({ title: "오늘의 운세 연속 기록", text, url: window.location.href });
      else await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShared(true);
      trackEvent("daily_return_share", { tool: id, streak });
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // Sharing can be cancelled without changing the record.
    }
  };

  return (
    <aside className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5" aria-label="오늘의 운세 연속 기록">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[11px] font-black tracking-[0.12em] text-amber-700">DAILY FORTUNE</p><strong className="mt-1 block text-gray-900">{completed ? "오늘의 운세 기록 완료" : "오늘 운세를 확인하고 기록을 이어가세요"}</strong></div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-orange-700 shadow-sm">🔥 {streak}일 연속</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {week.map((day) => <div key={day.key} className="text-center"><span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${day.done ? "bg-orange-600 text-white" : "border border-amber-200 bg-white text-amber-300"}`}>{day.done ? "✓" : "·"}</span><small className="mt-1 block text-[10px] text-amber-800">{day.label}</small></div>)}
      </div>
      {completed && streak > 0 && <button type="button" onClick={shareStreak} className="mt-4 w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-800">{shared ? "기록을 공유했어요!" : `${streak}일 연속 기록 공유하기`}</button>}
    </aside>
  );
}
