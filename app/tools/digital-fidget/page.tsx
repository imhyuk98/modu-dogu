"use client";

import { useEffect, useRef, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import { trackEvent } from "@/lib/analytics";

const keys = ["ESC", "Q", "W", "E", "A", "S", "D", "F", "Z", "X", "C", "SPACE"];
const colors = ["#d9c7a2", "#d38b71", "#7c9a92", "#7290b5"];

function today() { return new Date().toLocaleDateString("sv-SE"); }

export default function DigitalFidgetPage() {
  const [clicks, setClicks] = useState(0);
  const [todayClicks, setTodayClicks] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);
  const clicksRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("digitalFidgetDaily");
    if (!saved) return;
    try {
      const data = JSON.parse(saved) as { date: string; count: number };
      // Hydrate the browser-only daily record after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (data.date === today()) setTodayClicks(data.count);
    } catch { /* ignore invalid local data */ }
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) {
        setRunning(false);
        trackEvent("fidget_sprint_complete", { tool: "digital-fidget", clicks: clicksRef.current });
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const tone = (index: number) => {
    if (!sound) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioRef.current ?? new AudioContextClass();
    audioRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 150 + (index % 4) * 32;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.06);
  };

  const press = (index: number) => {
    tone(index);
    clicksRef.current += 1;
    setClicks((value) => value + 1);
    setTodayClicks((value) => {
      const next = value + 1;
      localStorage.setItem("digitalFidgetDaily", JSON.stringify({ date: today(), count: next }));
      return next;
    });
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const start = () => {
    setClicks(0);
    clicksRef.current = 0;
    setSeconds(30);
    setRunning(true);
    trackEvent("fidget_sprint_start", { tool: "digital-fidget" });
  };

  return (
    <main className="min-h-screen bg-[#e8e2d6] py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8"><p className="text-sm font-bold text-[#9b3e2a]">TACTILE PLAYGROUND</p><h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#221f1b]">디지털 키캡 피젯</h1><p className="mt-4 leading-7 text-[#675f54]">말랑이와 키캡처럼 손끝 자극이 필요할 때, 화면을 가볍게 눌러보세요. 설치도 로그인도 없습니다.</p></header>
        <section className="overflow-hidden rounded-[28px] border border-[#bfb6a7] bg-[#cbc3b5] p-5 shadow-[0_18px_50px_rgba(65,54,39,0.16)] sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#25231f] px-5 py-4 text-white"><div><small className="font-mono text-[10px] text-white/50">SESSION CLICKS</small><strong className="mt-1 block text-3xl font-black tabular-nums">{clicks.toLocaleString()}</strong></div><div className="text-right"><small className="font-mono text-[10px] text-white/50">TODAY</small><strong className="mt-1 block text-xl tabular-nums">{todayClicks.toLocaleString()}</strong></div></div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {keys.map((key, index) => <button key={key} type="button" onPointerDown={() => press(index)} className={`relative min-h-20 select-none rounded-xl border-b-[7px] border-black/25 font-mono text-sm font-black text-[#29251f] shadow-[0_5px_0_rgba(60,49,36,0.18)] transition active:translate-y-1 active:border-b-[3px] active:shadow-none ${key === "SPACE" ? "col-span-2" : ""}`} style={{ backgroundColor: colors[index % colors.length] }} aria-label={`${key} 키 누르기`}><span className="absolute left-3 top-2 text-[9px] opacity-45">{String(index + 1).padStart(2, "0")}</span>{key}</button>)}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div className="rounded-xl border border-black/10 bg-white/35 px-4 py-3"><small className="text-xs font-bold text-[#675f54]">30초 스프린트</small><strong className="ml-3 font-mono text-2xl text-[#221f1b]">{seconds}s</strong></div><button type="button" onClick={start} className="min-h-12 rounded-xl bg-[#9b3e2a] px-5 font-bold text-white">{running ? "처음부터" : "30초 시작"}</button><button type="button" onClick={() => setSound((value) => !value)} aria-pressed={sound} className="min-h-12 rounded-xl border border-black/15 bg-white/45 px-5 font-bold text-[#3e382f]">소리 {sound ? "켜짐" : "꺼짐"}</button></div>
        </section>
        <section className="mt-6 rounded-2xl border border-[#cbc2b4] bg-[#f5f0e7] p-6"><h2 className="text-lg font-extrabold text-[#29251f]">조용히 머리를 식히는 미니 놀이</h2><p className="mt-3 text-sm leading-7 text-[#675f54]">키보드 소리는 브라우저가 즉석에서 만들며 음원 파일을 내려받지 않습니다. 오늘 누른 횟수만 기기의 로컬 저장소에 보관됩니다. 소리가 불편하면 끄고 사용할 수 있습니다.</p></section>
        <RelatedTools current="digital-fidget" />
      </div>
    </main>
  );
}
