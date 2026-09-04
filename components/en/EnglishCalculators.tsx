"use client";

import { useMemo, useState } from "react";

const inputClass = "calc-input calc-input-lg";
const primaryButton = "calc-btn-primary px-5 py-3";

function ResultBox({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-[#e8d9cf] bg-[#fffaf6] p-5 text-center">
      <p className="text-sm font-bold text-[#806b60]">{label}</p>
      <p className="mt-1 break-words text-3xl font-black text-[#a93d28]">{value}</p>
      {note && <p className="mt-2 text-xs leading-5 text-[#806b60]">{note}</p>}
    </div>
  );
}

export function AgeCalculatorEn() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T12:00:00`);
    const today = new Date();
    if (Number.isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const startOfBirth = Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate());
    const startOfToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const totalDays = Math.floor((startOfToday - startOfBirth) / 86_400_000);
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate(), 12);
    if (nextBirthday < new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate(), 12);
    }
    const birthdayDays = Math.round(
      (Date.UTC(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate()) - startOfToday) /
        86_400_000,
    );
    return { years, months, days, totalDays, birthdayDays, nextBirthday };
  }, [birthDate]);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-bold text-gray-700" htmlFor="birth-date-en">Date of birth</label>
        <input id="birth-date-en" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className={inputClass} />
        {birthDate && !result && <p className="mt-2 text-sm text-red-600">Enter a valid date that is not in the future.</p>}
      </div>
      {result && (
        <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
          <ResultBox label="Exact age" value={`${result.years}y ${result.months}m ${result.days}d`} />
          <ResultBox label="Days lived" value={result.totalDays.toLocaleString("en-US")} />
          <ResultBox
            label="Next birthday"
            value={result.birthdayDays === 0 ? "Today!" : `${result.birthdayDays} days`}
            note={result.nextBirthday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          />
        </div>
      )}
    </div>
  );
}

type PercentMode = "of" | "ratio" | "change" | "discount";

export function PercentageCalculatorEn() {
  const [mode, setMode] = useState<PercentMode>("of");
  const [a, setA] = useState("100");
  const [b, setB] = useState("20");
  const first = Number(a);
  const second = Number(b);
  const result = useMemo(() => {
    if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
    if (mode === "of") return (first * second) / 100;
    if (mode === "ratio") return second === 0 ? null : (first / second) * 100;
    if (mode === "change") return first === 0 ? null : ((second - first) / Math.abs(first)) * 100;
    return first * (1 - second / 100);
  }, [first, mode, second]);
  const labels: Record<PercentMode, [string, string, string]> = {
    of: ["Value", "Percent", "Result"],
    ratio: ["Part", "Whole", "Percentage"],
    change: ["Starting value", "Final value", "Percentage change"],
    discount: ["Original price", "Discount", "Sale price"],
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Percentage calculation type">
        {(["of", "ratio", "change", "discount"] as PercentMode[]).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => setMode(item)}
            className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === item ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42] hover:bg-[#eaded5]"}`}>
            {{ of: "% of value", ratio: "Part of whole", change: "% change", discount: "Discount" }[item]}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">{labels[mode][0]}<input type="number" value={a} onChange={(event) => setA(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
        <label className="text-sm font-bold text-gray-700">{labels[mode][1]}{(mode === "of" || mode === "discount") && " (%)"}<input type="number" value={b} onChange={(event) => setB(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
      </div>
      <ResultBox
        label={labels[mode][2]}
        value={result === null ? "—" : `${result.toLocaleString("en-US", { maximumFractionDigits: 4 })}${mode === "ratio" || mode === "change" ? "%" : ""}`}
        note={result === null ? "The divisor or starting value cannot be zero." : undefined}
      />
    </div>
  );
}

export function BmiCalculatorEn() {
  const [system, setSystem] = useState<"metric" | "us">("metric");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [pounds, setPounds] = useState("150");

  const bmi = useMemo(() => {
    if (system === "metric") {
      const meters = Number(height) / 100;
      return meters > 0 && Number(weight) > 0 ? Number(weight) / meters ** 2 : null;
    }
    const totalInches = Number(feet) * 12 + Number(inches);
    return totalInches > 0 && Number(pounds) > 0 ? (703 * Number(pounds)) / totalInches ** 2 : null;
  }, [feet, height, inches, pounds, system, weight]);
  const status = bmi === null ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity range";

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-xl bg-[#f5ede7] p-1">
        {(["metric", "us"] as const).map((item) => <button key={item} onClick={() => setSystem(item)} className={`rounded-lg px-4 py-2 text-sm font-bold ${system === item ? "bg-white text-[#a93d28] shadow-sm" : "text-[#654d42]"}`}>{item === "metric" ? "Metric" : "US units"}</button>)}
      </div>
      {system === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-gray-700">Height (cm)<input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
          <label className="text-sm font-bold text-gray-700">Weight (kg)<input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <label className="text-sm font-bold text-gray-700">Height (ft)<input type="number" min="1" value={feet} onChange={(e) => setFeet(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
          <label className="text-sm font-bold text-gray-700">Height (in)<input type="number" min="0" value={inches} onChange={(e) => setInches(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
          <label className="col-span-2 text-sm font-bold text-gray-700 sm:col-span-1">Weight (lb)<input type="number" min="1" value={pounds} onChange={(e) => setPounds(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
        </div>
      )}
      <ResultBox label="Body mass index" value={bmi ? bmi.toFixed(1) : "—"} note={status || "Enter a height and weight above zero."} />
      <p className="text-xs leading-5 text-gray-500">BMI is a general screening measure, not a medical diagnosis. Athletes, pregnant people, children, and older adults may need a different assessment.</p>
    </div>
  );
}

type UnitCategory = "length" | "weight" | "temperature";
const factors = {
  length: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  weight: { kilogram: 1, gram: 0.001, pound: 0.45359237, ounce: 0.028349523125, stone: 6.35029318 },
};

export function UnitConverterEn() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const defaults = { length: ["meter", "foot"], weight: ["kilogram", "pound"], temperature: ["celsius", "fahrenheit"] } as const;
  const [from, setFrom] = useState("meter");
  const [to, setTo] = useState("foot");
  const units = category === "temperature" ? ["celsius", "fahrenheit", "kelvin"] : Object.keys(factors[category]);
  const switchCategory = (next: UnitCategory) => { setCategory(next); setFrom(defaults[next][0]); setTo(defaults[next][1]); };
  const converted = useMemo(() => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return null;
    if (category !== "temperature") {
      const table = factors[category] as Record<string, number>;
      return (amount * table[from]) / table[to];
    }
    const celsius = from === "celsius" ? amount : from === "fahrenheit" ? (amount - 32) * 5 / 9 : amount - 273.15;
    return to === "celsius" ? celsius : to === "fahrenheit" ? celsius * 9 / 5 + 32 : celsius + 273.15;
  }, [category, from, to, value]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">{(["length", "weight", "temperature"] as UnitCategory[]).map((item) => <button key={item} onClick={() => switchCategory(item)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${category === item ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42]"}`}>{item}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="text-sm font-bold text-gray-700">From<select value={from} onChange={(e) => setFrom(e.target.value)} className={`mt-1 capitalize ${inputClass}`}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <button type="button" aria-label="Swap units" className="mx-auto rounded-full bg-[#f5ede7] p-3 font-black text-[#a93d28]" onClick={() => { setFrom(to); setTo(from); }}>⇄</button>
        <label className="text-sm font-bold text-gray-700">To<select value={to} onChange={(e) => setTo(e.target.value)} className={`mt-1 capitalize ${inputClass}`}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
      </div>
      <label className="block text-sm font-bold text-gray-700">Value<input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
      <ResultBox label={`${from} → ${to}`} value={converted === null ? "—" : converted.toLocaleString("en-US", { maximumFractionDigits: 8 })} />
    </div>
  );
}

export function DateDifferenceEn() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const result = useMemo(() => {
    if (!start || !end) return null;
    const first = Date.parse(`${start}T12:00:00Z`);
    const second = Date.parse(`${end}T12:00:00Z`);
    if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
    const signed = Math.round((second - first) / 86_400_000);
    return { signed, weeks: Math.floor(Math.abs(signed) / 7), extraDays: Math.abs(signed) % 7 };
  }, [end, start]);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">Start date<input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
        <label className="text-sm font-bold text-gray-700">End date<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
      </div>
      {result && <div className="grid gap-3 sm:grid-cols-2"><ResultBox label="Calendar days" value={`${Math.abs(result.signed).toLocaleString("en-US")} days`} note={result.signed < 0 ? "The end date is before the start date." : result.signed === 0 ? "Both dates are the same." : "The calculation excludes the start date."} /><ResultBox label="In weeks" value={`${result.weeks} weeks, ${result.extraDays} days`} /></div>}
    </div>
  );
}

export function CharacterCounterEn() {
  const [value, setValue] = useState("");
  const stats = useMemo(() => {
    const trimmed = value.trim();
    return {
      characters: [...value].length,
      noSpaces: [...value.replace(/\s/g, "")].length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      sentences: trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter(Boolean).length || 1 : 0,
      paragraphs: trimmed ? value.split(/\n\s*\n/).filter((part) => part.trim()).length : 0,
      bytes: new TextEncoder().encode(value).length,
    };
  }, [value]);
  return (
    <div className="space-y-4">
      <label className="sr-only" htmlFor="counter-text-en">Text to count</label>
      <textarea id="counter-text-en" value={value} onChange={(e) => setValue(e.target.value)} rows={10} placeholder="Paste or type your text here…" className={`${inputClass} resize-y font-sans`} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(stats).map(([key, count]) => <ResultBox key={key} label={{ characters: "Characters", noSpaces: "Without spaces", words: "Words", sentences: "Sentences", paragraphs: "Paragraphs", bytes: "UTF-8 bytes" }[key as keyof typeof stats]} value={count.toLocaleString("en-US")} />)}
      </div>
      <button type="button" className={primaryButton} onClick={() => setValue("")}>Clear text</button>
    </div>
  );
}
