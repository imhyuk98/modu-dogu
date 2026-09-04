"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";

const inputClass = "calc-input calc-input-lg";
const primaryButton = "calc-btn-primary px-5 py-3";
const secondaryButton = "calc-btn-secondary px-5 py-3";

async function copyText(value: string, onDone: () => void) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  onDone();
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className={secondaryButton} disabled={!value} onClick={() => copyText(value, () => { setCopied(true); window.setTimeout(() => setCopied(false), 1400); })}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function PasswordGeneratorEn() {
  const [length, setLength] = useState(18);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    const sets = [options.lowercase && "abcdefghijkmnopqrstuvwxyz", options.uppercase && "ABCDEFGHJKLMNPQRSTUVWXYZ", options.numbers && "23456789", options.symbols && "!@#$%^&*()-_=+"].filter(Boolean) as string[];
    if (!sets.length) return setPassword("");
    const pool = sets.join("");
    const random = new Uint32Array(Math.max(length, sets.length));
    crypto.getRandomValues(random);
    const required = sets.map((set, index) => set[random[index] % set.length]);
    const rest = Array.from({ length: Math.max(0, length - required.length) }, (_, index) => pool[random[index + required.length] % pool.length]);
    const value = [...required, ...rest];
    for (let index = value.length - 1; index > 0; index--) {
      const target = random[index % random.length] % (index + 1);
      [value[index], value[target]] = [value[target], value[index]];
    }
    setPassword(value.join(""));
  }, [length, options]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[#271f1b] p-5 text-white">
        <p className="break-all font-mono text-xl font-bold leading-8">{password || "Click generate to create a password"}</p>
      </div>
      <label className="block text-sm font-bold text-gray-700">Length: {length}<input type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-2 w-full accent-[#a93d28]" /></label>
      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <legend className="sr-only">Character options</legend>
        {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
          <label key={key} className="flex items-center gap-2 rounded-xl bg-[#f5ede7] p-3 text-sm font-bold capitalize text-[#654d42]">
            <input type="checkbox" checked={options[key]} onChange={() => setOptions((current) => ({ ...current, [key]: !current[key] }))} className="h-4 w-4 accent-[#a93d28]" />{key}
          </label>
        ))}
      </fieldset>
      {!Object.values(options).some(Boolean) && <p className="text-sm text-red-600">Select at least one character type.</p>}
      <div className="flex flex-wrap gap-3"><button type="button" className={primaryButton} onClick={generate}>Generate password</button><CopyButton value={password} /></div>
      <p className="text-xs leading-5 text-gray-500">Generated locally with your browser&apos;s cryptographic random-number generator. Nothing is uploaded or stored.</p>
    </div>
  );
}

function secureInt(min: number, max: number) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % (max - min + 1));
}

export function RandomNumberEn() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(true);
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState("");
  const generate = () => {
    const low = Math.ceil(Number(min));
    const high = Math.floor(Number(max));
    const amount = Math.floor(Number(count));
    if (![low, high, amount].every(Number.isFinite) || low > high || amount < 1 || amount > 100) return setError("Use a valid range and choose between 1 and 100 results.");
    if (unique && amount > high - low + 1) return setError("The range is too small for that many unique numbers.");
    const values: number[] = [];
    while (values.length < amount) {
      const value = secureInt(low, high);
      if (!unique || !values.includes(value)) values.push(value);
    }
    setError(""); setResult(values);
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-gray-700">Minimum<input type="number" value={min} onChange={(e) => setMin(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
        <label className="text-sm font-bold text-gray-700">Maximum<input type="number" value={max} onChange={(e) => setMax(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
        <label className="col-span-2 text-sm font-bold text-gray-700 sm:col-span-1">How many<input type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-4 w-4 accent-[#a93d28]" />No duplicate numbers</label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3"><button type="button" className={primaryButton} onClick={generate}>Generate</button><CopyButton value={result.join(", ")} /></div>
      {result.length > 0 && <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e8d9cf] bg-[#fffaf6] p-5" aria-live="polite">{result.map((number, index) => <span key={`${number}-${index}`} className="grid min-h-12 min-w-12 place-items-center rounded-full bg-[#a93d28] px-3 font-black text-white">{number}</span>)}</div>}
    </div>
  );
}

export function JsonFormatterEn() {
  const [input, setInput] = useState('{"hello":"world","items":[1,2,3]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const transform = (compact: boolean) => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, compact ? 0 : 2)); setError(""); }
    catch (caught) { setOutput(""); setError(caught instanceof Error ? caught.message : "Invalid JSON"); }
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">JSON input<textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} spellCheck={false} className={`mt-1 ${inputClass} resize-y font-mono text-sm`} /></label>
        <label className="text-sm font-bold text-gray-700">Output<textarea value={output} readOnly rows={14} placeholder="Formatted JSON appears here" className={`mt-1 ${inputClass} resize-y font-mono text-sm`} /></label>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 font-mono text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-3"><button type="button" className={primaryButton} onClick={() => transform(false)}>Format & validate</button><button type="button" className={secondaryButton} onClick={() => transform(true)}>Minify</button><CopyButton value={output} /></div>
    </div>
  );
}

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') { cell += '"'; index++; } else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index++;
      row.push(cell); if (row.some((value) => value.length > 0)) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  row.push(cell); if (row.some((value) => value.length > 0)) rows.push(row);
  if (quoted) throw new Error("An opening quote is missing its closing quote.");
  return rows;
}

function csvEscape(value: unknown) {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function CsvJsonEn() {
  const [mode, setMode] = useState<"csv" | "json">("csv");
  const [input, setInput] = useState("name,score\nAda,98\nGrace,95");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const switchMode = (next: "csv" | "json") => { setMode(next); setInput(next === "csv" ? "name,score\nAda,98\nGrace,95" : '[{"name":"Ada","score":98},{"name":"Grace","score":95}]'); setOutput(""); setError(""); };
  const convert = () => {
    try {
      if (mode === "csv") {
        const rows = parseCsv(input); if (rows.length < 1) throw new Error("Add a header row.");
        const [headers, ...data] = rows;
        setOutput(JSON.stringify(data.map((row) => Object.fromEntries(headers.map((header, index) => [header.trim(), row[index] ?? ""]))), null, 2));
      } else {
        const data = JSON.parse(input); if (!Array.isArray(data)) throw new Error("JSON must be an array of objects.");
        const headers = [...new Set(data.flatMap((item) => item && typeof item === "object" ? Object.keys(item) : []))];
        if (!headers.length) throw new Error("The array must contain at least one object.");
        setOutput([headers.map(csvEscape).join(","), ...data.map((item) => headers.map((header) => csvEscape(item?.[header])).join(","))].join("\n"));
      }
      setError("");
    } catch (caught) { setOutput(""); setError(caught instanceof Error ? caught.message : "Could not convert the data."); }
  };
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl bg-[#f5ede7] p-1"><button className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === "csv" ? "bg-white text-[#a93d28] shadow-sm" : "text-[#654d42]"}`} onClick={() => switchMode("csv")}>CSV → JSON</button><button className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === "json" ? "bg-white text-[#a93d28] shadow-sm" : "text-[#654d42]"}`} onClick={() => switchMode("json")}>JSON → CSV</button></div>
      <div className="grid gap-4 lg:grid-cols-2"><textarea aria-label={`${mode.toUpperCase()} input`} value={input} onChange={(e) => setInput(e.target.value)} rows={13} className={`${inputClass} resize-y font-mono text-sm`} /><textarea aria-label="Converted output" value={output} readOnly rows={13} className={`${inputClass} resize-y font-mono text-sm`} /></div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3"><button type="button" className={primaryButton} onClick={convert}>Convert</button><CopyButton value={output} /></div>
    </div>
  );
}

function utf8ToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
function base64ToUtf8(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function Base64En() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(""); const [output, setOutput] = useState(""); const [error, setError] = useState("");
  const convert = () => { try { setOutput(mode === "encode" ? utf8ToBase64(input) : base64ToUtf8(input)); setError(""); } catch { setOutput(""); setError("That is not valid Base64-encoded UTF-8 text."); } };
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl bg-[#f5ede7] p-1">{(["encode", "decode"] as const).map((item) => <button key={item} onClick={() => { setMode(item); setInput(output); setOutput(""); setError(""); }} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${mode === item ? "bg-white text-[#a93d28] shadow-sm" : "text-[#654d42]"}`}>{item}</button>)}</div>
      <textarea aria-label="Input text" value={input} onChange={(e) => setInput(e.target.value)} rows={7} placeholder={mode === "encode" ? "Text to encode" : "Base64 to decode"} className={`${inputClass} resize-y font-mono text-sm`} />
      <textarea aria-label="Output text" value={output} readOnly rows={7} placeholder="Output" className={`${inputClass} resize-y font-mono text-sm`} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3"><button type="button" className={primaryButton} onClick={convert}>{mode === "encode" ? "Encode" : "Decode"}</button><CopyButton value={output} /></div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
}
function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255, green = g / 255, blue = b / 255;
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const delta = max - min; s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min); h = max === red ? (green - blue) / delta + (green < blue ? 6 : 0) : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4; h /= 6; }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverterEn() {
  const [hex, setHex] = useState("#a93d28");
  const rgb = hexToRgb(hex); const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const values = rgb && hsl ? [`#${hex.replace("#", "").toUpperCase()}`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`] : [];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <input type="color" aria-label="Pick a color" value={rgb ? `#${hex.replace("#", "")}` : "#a93d28"} onChange={(e) => setHex(e.target.value)} className="h-28 w-full cursor-pointer rounded-2xl border border-[#e8d9cf] bg-white p-2" />
        <label className="text-sm font-bold text-gray-700">HEX color<input value={hex} onChange={(e) => setHex(e.target.value)} maxLength={7} className={`mt-1 uppercase ${inputClass}`} />{!rgb && <span className="mt-2 block font-normal text-red-600">Use a six-digit HEX color such as #A93D28.</span>}</label>
      </div>
      {values.map((value, index) => <div key={value} className="flex flex-col gap-2 rounded-xl bg-[#fffaf6] p-4 sm:flex-row sm:items-center sm:justify-between"><span><small className="mr-3 font-bold text-[#806b60]">{["HEX", "RGB", "HSL"][index]}</small><code className="font-bold text-gray-800">{value}</code></span><CopyButton value={value} /></div>)}
    </div>
  );
}

export function QrCodeEn() {
  const [text, setText] = useState("https://modu-dogu.pages.dev/en");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const generate = async () => { try { if (!text.trim()) throw new Error("Enter text or a URL first."); setDataUrl(await QRCode.toDataURL(text, { width: 768, margin: 2, errorCorrectionLevel: "M", color: { dark: "#271f1b", light: "#ffffff" } })); setError(""); } catch (caught) { setDataUrl(""); setError(caught instanceof Error ? caught.message : "Could not create the QR code."); } };
  return (
    <div className="space-y-5">
      <label className="block text-sm font-bold text-gray-700">Text or URL<textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={`mt-1 ${inputClass}`} /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="button" className={primaryButton} onClick={generate}>Create QR code</button>
      {dataUrl && <div className="grid justify-items-center gap-4 rounded-2xl border border-[#e8d9cf] bg-white p-5"><Image src={dataUrl} width={320} height={320} unoptimized alt="Generated QR code" className="h-auto w-full max-w-[320px]" /><a href={dataUrl} download="qr-code.png" className={secondaryButton}>Download PNG</a></div>}
    </div>
  );
}

function formatTime(totalMs: number) {
  const safe = Math.max(0, totalMs); const minutes = Math.floor(safe / 60_000); const seconds = Math.floor((safe % 60_000) / 1000); const tenths = Math.floor((safe % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

export function TimerEn() {
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [minutes, setMinutes] = useState("5");
  const [value, setValue] = useState(300_000);
  const [running, setRunning] = useState(false);
  const lastTick = useRef(0);
  useEffect(() => {
    if (!running) return;
    lastTick.current = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now(); const delta = now - lastTick.current; lastTick.current = now;
      setValue((current) => {
        const next = mode === "timer" ? Math.max(0, current - delta) : current + delta;
        if (mode === "timer" && next <= 0) {
          window.clearInterval(interval);
          window.setTimeout(() => setRunning(false), 0);
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [mode, running]);
  const reset = () => { setRunning(false); setValue(mode === "timer" ? Math.max(0, Number(minutes) || 0) * 60_000 : 0); };
  const changeMode = (next: "timer" | "stopwatch") => { setMode(next); setRunning(false); setValue(next === "timer" ? Math.max(0, Number(minutes) || 0) * 60_000 : 0); };
  return (
    <div className="space-y-5 text-center">
      <div className="inline-flex rounded-xl bg-[#f5ede7] p-1">{(["timer", "stopwatch"] as const).map((item) => <button key={item} onClick={() => changeMode(item)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${mode === item ? "bg-white text-[#a93d28] shadow-sm" : "text-[#654d42]"}`}>{item}</button>)}</div>
      {mode === "timer" && !running && <label className="mx-auto block max-w-[220px] text-left text-sm font-bold text-gray-700">Countdown minutes<input type="number" min="0" max="1440" value={minutes} onChange={(e) => { setMinutes(e.target.value); setValue(Math.max(0, Number(e.target.value) || 0) * 60_000); }} className={`mt-1 ${inputClass}`} /></label>}
      <div role="timer" aria-live={value <= 0 ? "assertive" : "off"} className={`rounded-3xl p-8 font-mono text-5xl font-black tabular-nums sm:text-7xl ${mode === "timer" && value <= 0 ? "bg-[#a93d28] text-white" : "bg-[#271f1b] text-white"}`}>{formatTime(value)}</div>
      <div className="flex justify-center gap-3"><button type="button" className={primaryButton} onClick={() => { if (mode === "timer" && value <= 0) reset(); setRunning((current) => !current); }}>{running ? "Pause" : "Start"}</button><button type="button" className={secondaryButton} onClick={reset}>Reset</button></div>
    </div>
  );
}
