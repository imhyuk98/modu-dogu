"use client";

import { useMemo, useState } from "react";
import { calculateLoan, calculateWeightedGpa, convertArea, type AreaUnit, type RepaymentType } from "@/lib/calculations";

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

export function LoanCalculatorEn() {
  const [principal, setPrincipal] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [type, setType] = useState<RepaymentType>("equalPrincipalInterest");
  const result = useMemo(() => {
    const amount = Number(principal);
    const annualRate = Number(rate);
    const term = Number(years);
    if (!(amount > 0) || !(annualRate >= 0) || !(term > 0) || !Number.isInteger(term)) return null;
    return calculateLoan(amount, annualRate, term, type);
  }, [principal, rate, type, years]);
  const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="text-sm font-bold text-gray-700">Loan amount<input type="number" min="1" value={principal} onChange={(event) => setPrincipal(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
      <label className="text-sm font-bold text-gray-700">Annual rate (%)<input type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
      <label className="text-sm font-bold text-gray-700">Term (years)<input type="number" min="1" max="50" step="1" value={years} onChange={(event) => setYears(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
    </div>
    <fieldset><legend className="mb-2 text-sm font-bold text-gray-700">Repayment method</legend><div className="grid gap-2 sm:grid-cols-2">{(["equalPrincipalInterest", "equalPrincipal"] as RepaymentType[]).map((value) => <button key={value} type="button" onClick={() => setType(value)} className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${type === value ? "border-[#a93d28] bg-[#fff0e9] text-[#8f2f20]" : "border-gray-200 text-gray-600"}`}>{value === "equalPrincipalInterest" ? "Level monthly payment" : "Equal principal"}</button>)}</div></fieldset>
    {result ? <div className="grid gap-3 sm:grid-cols-3"><ResultBox label={type === "equalPrincipalInterest" ? "Monthly payment" : "First payment"} value={money(result.monthlyPayments[0]?.payment ?? 0)} /><ResultBox label="Total interest" value={money(result.totalInterest)} /><ResultBox label="Total repayment" value={money(result.totalPayment)} /></div> : <p className="text-sm text-red-600">Enter a positive amount and whole-year term. The rate may be zero.</p>}
    <p className="text-xs leading-5 text-gray-500">Reference estimate only. It excludes fees, insurance, changing rates, taxes, and lender-specific day-count rules.</p>
  </div>;
}

const GPA_GRADES = [4.5, 4.3, 4, 3.7, 3.3, 3, 2.7, 2.3, 2, 1.7, 1.3, 1, 0] as const;

export function GpaCalculatorEn() {
  const [scale, setScale] = useState(4);
  const [rows, setRows] = useState([
    { name: "Course 1", credits: "3", points: "4" },
    { name: "Course 2", credits: "3", points: "3.7" },
    { name: "Course 3", credits: "3", points: "3.3" },
  ]);
  const result = useMemo(() => calculateWeightedGpa(rows.map((row) => ({ credits: Number(row.credits), points: row.points === "P" ? 0 : Number(row.points), excluded: row.points === "P" }))), [rows]);
  const options = GPA_GRADES.filter((value) => value <= scale);

  return <div className="space-y-5">
    <div><p className="mb-2 text-sm font-bold text-gray-700">GPA scale</p><div className="flex gap-2">{[4, 4.3, 4.5].map((value) => <button key={value} type="button" onClick={() => { setScale(value); setRows((current) => current.map((row) => Number(row.points) > value ? { ...row, points: String(value) } : row)); }} className={`min-h-10 rounded-full px-4 text-sm font-bold ${scale === value ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42]"}`}>{value.toFixed(1)}</button>)}</div></div>
    <div className="space-y-2">{rows.map((row, index) => <div key={index} className="grid grid-cols-[minmax(0,1fr)_5rem_6rem] gap-2"><input aria-label={`Course ${index + 1} name`} value={row.name} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} className={inputClass} /><input aria-label={`Course ${index + 1} credits`} type="number" min="0" step="0.5" value={row.credits} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, credits: event.target.value } : item))} className={inputClass} /><select aria-label={`Course ${index + 1} grade`} value={row.points} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, points: event.target.value } : item))} className={inputClass}><option value="P">P/F</option>{options.map((value) => <option key={value} value={value}>{value.toFixed(1)}</option>)}</select></div>)}</div>
    <div className="flex flex-wrap gap-2"><button type="button" className={primaryButton} onClick={() => setRows((current) => [...current, { name: `Course ${current.length + 1}`, credits: "3", points: String(scale) }])}>Add course</button>{rows.length > 1 && <button type="button" className="calc-btn-secondary px-5 py-3" onClick={() => setRows((current) => current.slice(0, -1))}>Remove last</button>}</div>
    <div className="grid gap-3 sm:grid-cols-2"><ResultBox label="Weighted GPA" value={result.credits > 0 ? `${result.gpa.toFixed(2)} / ${scale.toFixed(1)}` : "—"} /><ResultBox label="Graded credits" value={result.credits.toLocaleString("en-US")} note="Pass/fail rows are excluded." /></div>
  </div>;
}

export function AreaConverterEn() {
  const [unit, setUnit] = useState<AreaUnit>("sqm");
  const [value, setValue] = useState("84");
  const result = useMemo(() => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 ? convertArea(amount, unit) : null;
  }, [unit, value]);
  const units: { value: AreaUnit; label: string }[] = [{ value: "sqm", label: "Square meters (m²)" }, { value: "pyeong", label: "Pyeong" }, { value: "sqft", label: "Square feet (ft²)" }];
  return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-gray-700">Input unit<select value={unit} onChange={(event) => setUnit(event.target.value as AreaUnit)} className={`mt-1 ${inputClass}`}>{units.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-sm font-bold text-gray-700">Area<input type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} className={`mt-1 ${inputClass}`} /></label></div>{result && <div className="grid gap-3 sm:grid-cols-3"><ResultBox label="Square meters" value={`${result.sqm.toLocaleString("en-US", { maximumFractionDigits: 4 })} m²`} /><ResultBox label="Pyeong" value={`${result.pyeong.toLocaleString("en-US", { maximumFractionDigits: 4 })} pyeong`} /><ResultBox label="Square feet" value={`${result.sqft.toLocaleString("en-US", { maximumFractionDigits: 3 })} ft²`} /></div>}<p className="text-xs leading-5 text-gray-500">Uses 1 pyeong = 400/121 m² and 1 ft² = 0.09290304 m². Confirm official property documents in square meters.</p></div>;
}

export function RunningPaceEn() {
  const [distance, setDistance] = useState("5");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("0");
  const result = useMemo(() => {
    const km = Number(distance);
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (!(km > 0) || !(totalSeconds > 0)) return null;
    const paceSeconds = totalSeconds / km;
    return { paceSeconds, speed: km / (totalSeconds / 3600), milePace: paceSeconds * 1.609344 };
  }, [distance, hours, minutes, seconds]);
  const pace = (total: number) => `${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")}`;
  return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-4"><label className="text-sm font-bold text-gray-700">Distance (km)<input type="number" min="0.01" step="0.01" value={distance} onChange={(event) => setDistance(event.target.value)} className={`mt-1 ${inputClass}`} /></label><label className="text-sm font-bold text-gray-700">Hours<input type="number" min="0" value={hours} onChange={(event) => setHours(event.target.value)} className={`mt-1 ${inputClass}`} /></label><label className="text-sm font-bold text-gray-700">Minutes<input type="number" min="0" max="59" value={minutes} onChange={(event) => setMinutes(event.target.value)} className={`mt-1 ${inputClass}`} /></label><label className="text-sm font-bold text-gray-700">Seconds<input type="number" min="0" max="59" value={seconds} onChange={(event) => setSeconds(event.target.value)} className={`mt-1 ${inputClass}`} /></label></div>{result ? <div className="grid gap-3 sm:grid-cols-3"><ResultBox label="Pace per km" value={`${pace(result.paceSeconds)} /km`} /><ResultBox label="Pace per mile" value={`${pace(result.milePace)} /mi`} /><ResultBox label="Average speed" value={`${result.speed.toFixed(2)} km/h`} /></div> : <p className="text-sm text-red-600">Enter a distance and finish time above zero.</p>}<p className="text-xs leading-5 text-gray-500">This is an average pace. Hills, stops, GPS error, weather, and course length can change an actual race split.</p></div>;
}
