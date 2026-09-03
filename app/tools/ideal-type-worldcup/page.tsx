"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import ShareResultCard from "@/components/ShareResultCard";
import { trackEvent } from "@/lib/analytics";

const defaults = ["평생 한식", "평생 양식", "바다 여행", "도시 여행", "아침형 인간", "밤형 인간", "계획형", "즉흥형"];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function IdealTypeWorldcupPage() {
  const [items, setItems] = useState(defaults);
  const [round, setRound] = useState<string[]>([]);
  const [match, setMatch] = useState(0);
  const [winners, setWinners] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  const active = round.length > 0 && !champion;
  const valid = items.every((item) => item.trim()) && new Set(items.map((item) => item.trim())).size === items.length;

  const roundLabel = round.length === 8 ? "8강" : round.length === 4 ? "준결승" : "결승";
  const totalChoices = history.length;
  const pair = useMemo(() => active ? [round[match], round[match + 1]] : [], [active, match, round]);

  const start = () => {
    if (!valid) return;
    setRound(shuffle(items.map((item) => item.trim())));
    setMatch(0);
    setWinners([]);
    setHistory([]);
    setChampion(null);
    trackEvent("worldcup_start", { tool: "ideal-type-worldcup", entry_count: items.length });
  };

  const choose = (item: string) => {
    const nextWinners = [...winners, item];
    setHistory((current) => [...current, item]);
    if (match + 2 < round.length) {
      setWinners(nextWinners);
      setMatch((value) => value + 2);
    } else if (nextWinners.length === 1) {
      setChampion(item);
      trackEvent("worldcup_complete", { tool: "ideal-type-worldcup", winner: item });
    } else {
      setRound(nextWinners);
      setWinners([]);
      setMatch(0);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8"><p className="text-sm font-bold text-[#a93d28]">MAKE YOUR TOURNAMENT</p><h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">취향 월드컵 만들기</h1><p className="mt-4 leading-7 text-gray-600">음식, 여행지, 최애 후보, 팀 회식 메뉴까지 직접 8개를 적고 둘 중 하나만 고르며 진짜 1위를 찾아보세요.</p></header>

        {!active && !champion && <section className="calc-card p-6 sm:p-8"><div className="flex items-end justify-between"><div><p className="font-mono text-xs font-bold text-[#a93d28]">8 ENTRIES</p><h2 className="mt-2 text-xl font-extrabold text-gray-900">후보를 입력하세요</h2></div><button type="button" onClick={() => setItems(defaults)} className="text-xs font-bold text-gray-500 hover:text-[#a93d28]">예시 복원</button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{items.map((item, index) => <label key={index} className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4"><span className="font-mono text-xs font-bold text-[#a93d28]">{String(index + 1).padStart(2, "0")}</span><input value={item} maxLength={30} onChange={(event) => setItems((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} aria-label={`후보 ${index + 1}`} className="min-w-0 flex-1 bg-transparent py-3 font-semibold text-gray-900 outline-none" /></label>)}</div>{!valid && <p className="mt-3 text-sm text-red-600">모든 후보를 서로 다른 이름으로 입력해 주세요.</p>}<button type="button" disabled={!valid} onClick={start} className="mt-6 min-h-12 w-full rounded-lg bg-[#a93d28] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">대진 섞고 시작하기</button></section>}

        {active && <section className="calc-card overflow-hidden"><div className="bg-[#1d1c19] px-6 py-5 text-white"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-[#e67d62]">{roundLabel} · MATCH {match / 2 + 1}</span><span className="text-xs text-white/50">{totalChoices} / 7 선택</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#e67d62] transition-all" style={{ width: `${(totalChoices / 7) * 100}%` }} /></div></div><div className="grid sm:grid-cols-2">{pair.map((item, index) => <button key={item} type="button" onClick={() => choose(item)} className={`group flex min-h-64 flex-col items-center justify-center p-8 text-center transition hover:bg-[#fff4ef] ${index === 0 ? "border-b sm:border-b-0 sm:border-r" : ""} border-gray-200`}><span className="font-mono text-xs font-bold text-[#a93d28]">CHOICE {index + 1}</span><strong className="mt-6 break-keep text-3xl font-black text-gray-950 group-hover:scale-105 transition">{item}</strong><span className="mt-7 text-sm font-semibold text-gray-400 group-hover:text-[#a93d28]">이쪽 선택</span></button>)}</div></section>}

        {champion && <div className="space-y-5"><section className="calc-card overflow-hidden"><div className="bg-[#a93d28] p-8 text-center text-white sm:p-12"><p className="font-mono text-xs font-bold tracking-[0.18em] text-white/70">MY FINAL PICK</p><div className="mt-6 text-6xl">🏆</div><h2 className="mt-6 break-keep text-4xl font-black">{champion}</h2><p className="mt-3 text-white/75">7번의 선택 끝에 남은 나의 최종 취향</p></div><div className="p-6 sm:p-8"><button type="button" onClick={start} className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-bold text-gray-700">같은 후보로 다시 하기</button><button type="button" onClick={() => { setRound([]); setChampion(null); }} className="ml-2 min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-bold text-gray-700">후보 바꾸기</button></div></section><ShareResultCard kicker="TASTE WORLDCUP" title={`나의 최종 선택 · ${champion}`} subtitle="8개의 후보 중 끝까지 살아남은 취향" highlights={history.slice(-4).map((item, index) => ({ label: index === 3 ? "WINNER" : `PICK 0${index + 1}`, value: item }))} shareText={`내 취향 월드컵 우승은 '${champion}'! 당신도 직접 만들어보세요.`} fileName="taste-worldcup-winner" accent="#a93d28" /></div>}

        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">저작권 걱정 없는 월드컵</h2><p className="text-sm leading-7 text-gray-600">외부 사진이나 캐릭터 이미지를 가져오지 않고 사용자가 직접 적은 텍스트만 사용합니다. 후보와 선택 기록은 브라우저 안에서만 처리되며 새로고침하면 사라집니다.</p></section>
        <RelatedTools current="ideal-type-worldcup" />
      </div>
    </main>
  );
}
