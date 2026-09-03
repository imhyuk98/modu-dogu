"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface Challenge { label: string; target: number; }
interface Props { id: string; challenges: Challenge[]; currentValue: number; unit: string; }

function dateKey(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("sv-SE");
}

function hash(text: string) {
  return [...text].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
}

export default function DailyChallenge({ id, challenges, currentValue, unit }: Props) {
  const key = dateKey();
  const challenge = useMemo(() => challenges[hash(`${id}-${key}`) % challenges.length], [challenges, id, key]);
  const [record, setRecord] = useState({ last: "", streak: 0 });

  useEffect(() => {
    const raw = localStorage.getItem(`dailyChallenge:${id}`);
    if (!raw) return;
    try {
      // Hydrate the browser-only streak after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecord(JSON.parse(raw) as { last: string; streak: number });
    } catch { /* ignore invalid local data */ }
  }, [id]);

  useEffect(() => {
    if (currentValue < challenge.target || record.last === key) return;
    const next = { last: key, streak: record.last === dateKey(-1) ? record.streak + 1 : 1 };
    localStorage.setItem(`dailyChallenge:${id}`, JSON.stringify(next));
    trackEvent("daily_challenge_complete", { tool: id, target: challenge.target, streak: next.streak });
    // Completion is caused by the external game score reaching today's target.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecord(next);
  }, [challenge.target, currentValue, id, key, record]);

  const complete = record.last === key;
  const progress = Math.min(100, (currentValue / challenge.target) * 100);

  return (
    <aside className="mb-5 rounded-2xl border border-[#e6c7ba] bg-[#fff7f3] p-4 sm:p-5" aria-label="오늘의 도전">
      <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] font-black tracking-[0.15em] text-[#a93d28]">TODAY&apos;S CHALLENGE</p><strong className="mt-1.5 block text-sm text-gray-900">{challenge.label}</strong></div><span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#a93d28]">🔥 {record.streak}일</span></div>
      <div className="mt-4 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eadfd8]"><div className="h-full rounded-full bg-[#a93d28] transition-all" style={{ width: `${progress}%` }} /></div><span className="w-20 text-right font-mono text-xs font-bold text-gray-600">{complete ? "완료!" : `${Math.min(currentValue, challenge.target)}/${challenge.target}${unit}`}</span></div>
    </aside>
  );
}
