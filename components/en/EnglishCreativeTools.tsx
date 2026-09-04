"use client";

import { useEffect, useRef, useState } from "react";

const inputClass = "calc-input calc-input-lg";
const primaryButton = "calc-btn-primary px-5 py-3";
const secondaryButton = "calc-btn-secondary px-5 py-3";

const names = {
  modern: {
    first: ["Aria", "Milo", "Nova", "Kai", "Luna", "Ezra", "Ivy", "Theo", "Maya", "Finn", "Zoe", "Leo"],
    last: ["Reed", "Blake", "Wells", "Stone", "Hayes", "Lane", "Brooks", "Quinn"],
  },
  classic: {
    first: ["Alice", "Arthur", "Clara", "Edmund", "Eleanor", "Henry", "Josephine", "Louis", "Rose", "Thomas"],
    last: ["Bennett", "Clark", "Foster", "Morgan", "Sullivan", "Whitmore", "Wright"],
  },
  fantasy: {
    first: ["Aelora", "Bram", "Caelum", "Elowen", "Fenric", "Isolde", "Lyra", "Orin", "Soren", "Vesper"],
    last: ["Dawnweaver", "Emberfall", "Frostmere", "Moonvale", "Ravenwood", "Starling", "Thornfield"],
  },
  neutral: {
    first: ["Alex", "Avery", "Blair", "Casey", "Charlie", "Jordan", "Morgan", "Riley", "River", "Rowan"],
    last: ["Adler", "Ellis", "Gray", "Harper", "Parker", "Reese", "Taylor"],
  },
};

type NameStyle = keyof typeof names;

export function NameGeneratorEn() {
  const [style, setStyle] = useState<NameStyle>("modern");
  const [count, setCount] = useState(6);
  const [results, setResults] = useState<string[]>([]);
  const generate = () => {
    const source = names[style]; const generated = new Set<string>(); let guard = 0;
    while (generated.size < count && guard < 200) {
      generated.add(`${source.first[Math.floor(Math.random() * source.first.length)]} ${source.last[Math.floor(Math.random() * source.last.length)]}`); guard++;
    }
    setResults([...generated]);
  };
  return (
    <div className="space-y-5">
      <fieldset><legend className="mb-2 text-sm font-bold text-gray-700">Choose a style</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(Object.keys(names) as NameStyle[]).map((item) => <button type="button" key={item} onClick={() => setStyle(item)} aria-pressed={style === item} className={`rounded-xl px-3 py-3 text-sm font-bold capitalize ${style === item ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42]"}`}>{item}</button>)}</div></fieldset>
      <label className="block max-w-[220px] text-sm font-bold text-gray-700">Number of names<select value={count} onChange={(e) => setCount(Number(e.target.value))} className={`mt-1 ${inputClass}`}>{[3, 6, 9, 12].map((value) => <option key={value}>{value}</option>)}</select></label>
      <button type="button" className={primaryButton} onClick={generate}>Generate names</button>
      {results.length > 0 && <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">{results.map((name) => <button type="button" key={name} title="Copy name" onClick={() => navigator.clipboard.writeText(name)} className="rounded-2xl border border-[#e8d9cf] bg-[#fffaf6] p-4 text-left text-lg font-black text-[#513b31] transition hover:-translate-y-0.5 hover:border-[#a93d28]">{name}<small className="ml-2 font-normal text-[#927b6f]">copy</small></button>)}</div>}
    </div>
  );
}

function compatibilityScore(first: string, second: string) {
  const normalized = [first.trim().toLocaleLowerCase("en"), second.trim().toLocaleLowerCase("en")].sort().join("|");
  let hash = 2166136261;
  for (const char of normalized) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 16777619); }
  return 35 + (Math.abs(hash) % 65);
}

export function NameCompatibilityEn() {
  const [first, setFirst] = useState(""); const [second, setSecond] = useState(""); const [result, setResult] = useState<number | null>(null); const [copied, setCopied] = useState(false);
  const message = result === null ? "" : result >= 90 ? "Cosmic connection — you two make a rare pair." : result >= 75 ? "Strong chemistry with plenty of spark." : result >= 60 ? "A promising match that grows with good conversation." : result >= 45 ? "Different energies can make an interesting duo." : "Opposites detected — communication is your superpower.";
  const calculate = () => { if (first.trim() && second.trim()) setResult(compatibilityScore(first, second)); };
  const share = async () => { if (result === null) return; await navigator.clipboard.writeText(`${first} + ${second}: ${result}% compatible on Modu Tools`); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end"><label className="text-sm font-bold text-gray-700">First name<input value={first} maxLength={40} onChange={(e) => { setFirst(e.target.value); setResult(null); }} className={`mt-1 ${inputClass}`} /></label><span className="hidden pb-3 text-2xl sm:block">＋</span><label className="text-sm font-bold text-gray-700">Second name<input value={second} maxLength={40} onChange={(e) => { setSecond(e.target.value); setResult(null); }} className={`mt-1 ${inputClass}`} /></label></div>
      <button type="button" disabled={!first.trim() || !second.trim()} className={primaryButton} onClick={calculate}>Check compatibility</button>
      {result !== null && <div className="rounded-3xl bg-[#ffdfeb] p-7 text-center" aria-live="polite"><p className="text-sm font-black uppercase tracking-[0.16em] text-[#a93d28]">{first} × {second}</p><p className="my-3 text-7xl font-black text-[#a93d28]">{result}%</p><p className="font-bold text-[#513b31]">{message}</p><button type="button" className={`mt-5 ${secondaryButton}`} onClick={share}>{copied ? "Copied!" : "Copy result"}</button></div>}
      <p className="text-xs text-gray-500">For entertainment only. The same two names always produce the same score, regardless of order.</p>
    </div>
  );
}

type ReactionState = "idle" | "waiting" | "ready" | "result" | "early";

export function ReactionTestEn() {
  const [state, setState] = useState<ReactionState>("idle"); const [last, setLast] = useState<number | null>(null); const [scores, setScores] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null); const readyAt = useRef(0);
  useEffect(() => () => { if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current); }, []);
  const begin = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setState("waiting"); setLast(null);
    timeoutRef.current = window.setTimeout(() => { readyAt.current = performance.now(); setState("ready"); timeoutRef.current = null; }, 1200 + Math.random() * 2800);
  };
  const tap = () => {
    if (state === "idle" || state === "result" || state === "early") return begin();
    if (state === "waiting") { if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current); timeoutRef.current = null; setState("early"); return; }
    const elapsed = Math.round(performance.now() - readyAt.current); setLast(elapsed); setScores((current) => [...current, elapsed].slice(-5)); setState("result");
  };
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
  const copy = state === "idle" ? "Start test" : state === "waiting" ? "Wait for green…" : state === "ready" ? "TAP NOW!" : state === "early" ? "Too soon — tap to retry" : `${last} ms — tap for another`;
  return (
    <div className="space-y-5">
      <button type="button" onClick={tap} className={`grid min-h-[300px] w-full place-items-center rounded-3xl p-8 text-center text-2xl font-black transition active:scale-[0.99] ${state === "ready" ? "bg-[#23a55a] text-white" : state === "waiting" ? "bg-[#a93d28] text-white" : state === "early" ? "bg-[#f3bf35] text-[#3d2c23]" : "bg-[#271f1b] text-white"}`}><span><span className="mb-3 block text-6xl">{state === "ready" ? "⚡" : state === "early" ? "✋" : "●"}</span>{copy}</span></button>
      {average !== null && <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#fffaf6] p-4 text-center"><small className="font-bold text-gray-500">5-round average</small><p className="text-2xl font-black text-[#a93d28]">{average} ms</p></div><div className="rounded-2xl bg-[#fffaf6] p-4 text-center"><small className="font-bold text-gray-500">Best</small><p className="text-2xl font-black text-[#a93d28]">{Math.min(...scores)} ms</p></div></div>}
    </div>
  );
}

const symbols = ["🍒", "🚀", "🌈", "🐳", "🍀", "🎸"];
const initialDeck = [0, 1, 2, 3, 4, 5, 2, 5, 0, 4, 1, 3];

export function MemoryGameEn() {
  const [deck, setDeck] = useState(initialDeck); const [open, setOpen] = useState<number[]>([]); const [matched, setMatched] = useState<number[]>([]); const [moves, setMoves] = useState(0);
  const locked = open.length === 2;
  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    const timer = window.setTimeout(() => {
      if (deck[first] === deck[second]) setMatched((current) => [...current, deck[first]]);
      setOpen([]);
    }, deck[first] === deck[second] ? 450 : 800);
    return () => window.clearTimeout(timer);
  }, [deck, open]);
  const flip = (index: number) => { if (locked || open.includes(index) || matched.includes(deck[index])) return; setOpen((current) => [...current, index]); if (open.length === 1) setMoves((value) => value + 1); };
  const newGame = () => { const shuffled = [...initialDeck]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; } setDeck(shuffled); setOpen([]); setMatched([]); setMoves(0); };
  const won = matched.length === symbols.length;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><p className="font-bold text-[#654d42]">Moves: {moves}</p><button type="button" onClick={newGame} className={secondaryButton}>New game</button></div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="Memory cards">{deck.map((symbolIndex, index) => { const visible = open.includes(index) || matched.includes(symbolIndex); return <button type="button" key={index} aria-label={visible ? symbols[symbolIndex] : `Hidden card ${index + 1}`} onClick={() => flip(index)} className={`aspect-square rounded-2xl text-3xl font-black transition sm:text-4xl ${visible ? "rotate-0 border border-[#e8d9cf] bg-white" : "bg-[#a93d28] text-white hover:-translate-y-0.5"}`}>{visible ? symbols[symbolIndex] : "?"}</button>; })}</div>
      {won && <div className="rounded-2xl bg-[#dff5df] p-5 text-center" role="status"><p className="text-2xl font-black text-[#246b36]">All matched in {moves} moves!</p><button type="button" onClick={newGame} className={`mt-3 ${primaryButton}`}>Play again</button></div>}
    </div>
  );
}
