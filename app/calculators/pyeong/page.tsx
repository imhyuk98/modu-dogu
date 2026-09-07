"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import { convertArea, type AreaUnit } from "@/lib/calculations";

const units: Array<{ value: AreaUnit; label: string; short: string }> = [
  { value: "sqm", label: "제곱미터", short: "㎡" },
  { value: "pyeong", label: "평", short: "평" },
  { value: "sqft", label: "제곱피트", short: "ft²" },
];

const apartmentExamples = [
  { exclusive: "59㎡", supply: "약 79~82㎡", exclusivePyeong: "17.85평", called: "약 24~25평형" },
  { exclusive: "74㎡", supply: "약 97~100㎡", exclusivePyeong: "22.39평", called: "약 29~30평형" },
  { exclusive: "84㎡", supply: "약 110~115㎡", exclusivePyeong: "25.41평", called: "약 33~35평형" },
  { exclusive: "101㎡", supply: "약 132~138㎡", exclusivePyeong: "30.55평", called: "약 40~42평형" },
];

function format(value: number, digits = 2) {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: digits }).format(value);
}

export default function PyeongCalculator() {
  const [unit, setUnit] = useState<AreaUnit>("sqm");
  const [input, setInput] = useState("84");
  const value = Number(input);
  const valid = input.trim() !== "" && Number.isFinite(value) && value >= 0;
  const result = useMemo(() => convertArea(valid ? value : 0, unit), [unit, valid, value]);
  const selected = units.find((item) => item.value === unit)!;

  return (
    <div className="py-6">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">AREA CONVERTER</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">평수 계산기</h1>
        <p className="mt-2 text-gray-600">평·제곱미터(㎡)·제곱피트(ft²)를 어느 방향으로든 환산하고, 아파트 면적 표기의 차이도 함께 확인합니다.</p>
      </header>

      <section className="calc-card mb-6 p-5 sm:p-6" aria-labelledby="area-input-title">
        <h2 id="area-input-title" className="text-lg font-bold text-gray-900">변환할 단위와 값</h2>
        <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="입력 면적 단위">
          {units.map((item) => (
            <button key={item.value} type="button" onClick={() => setUnit(item.value)} aria-pressed={unit === item.value} className={`min-h-11 rounded-xl border px-2 text-sm font-bold ${unit === item.value ? "border-[#a93d28] bg-[#fff0e9] text-[#8f2f20]" : "border-gray-200 bg-white text-gray-600"}`}>
              {item.label}<span className="ml-1 hidden text-xs sm:inline">({item.short})</span>
            </button>
          ))}
        </div>
        <label className="mt-5 block text-sm font-bold text-gray-700">{selected.label} 입력
          <span className="relative mt-2 block"><input type="number" min="0" step="any" inputMode="decimal" value={input} onChange={(event) => setInput(event.target.value)} className="calc-input calc-input-lg pr-16" /><span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">{selected.short}</span></span>
        </label>
        {unit === "sqm" && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="자주 찾는 전용면적">
            {[59, 74, 84, 101].map((preset) => <button key={preset} type="button" onClick={() => setInput(String(preset))} className="calc-preset">{preset}㎡</button>)}
          </div>
        )}
        {!valid && <p role="alert" className="mt-3 text-sm font-bold text-red-700">0 이상의 숫자를 입력해 주세요.</p>}
      </section>

      {valid && (
        <section className="calc-card mb-8 overflow-hidden" aria-labelledby="area-result-title">
          <div className="bg-[#2c211c] p-6 text-white"><p className="text-xs font-bold text-[#ffd9c9]">입력값</p><h2 id="area-result-title" className="mt-1 text-3xl font-black">{format(value, 4)} {selected.short}</h2></div>
          <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
            <div className="bg-white p-5"><small className="text-gray-500">제곱미터</small><strong className="mt-1 block text-xl">{format(result.sqm)} ㎡</strong></div>
            <div className="bg-white p-5"><small className="text-gray-500">평</small><strong className="mt-1 block text-xl">{format(result.pyeong)} 평</strong></div>
            <div className="bg-white p-5"><small className="text-gray-500">제곱피트</small><strong className="mt-1 block text-xl">{format(result.sqft)} ft²</strong></div>
          </div>
          <p className="border-t border-gray-100 bg-[#faf8f5] px-5 py-4 font-mono text-xs leading-6 text-gray-600">1평 = 400/121㎡ ≈ 3.305785㎡ · 1ft² = 0.09290304㎡</p>
        </section>
      )}

      <section className="space-y-6 text-sm leading-7 text-gray-600">
        <div className="calc-card overflow-hidden">
          <div className="p-5 sm:p-6"><h2 className="text-lg font-bold text-gray-900">84㎡는 25.41평인데 왜 ‘34평형’이라고 하나요?</h2><p className="mt-2">25.41평은 집 안에서 단독으로 쓰는 <strong>전용면적 84㎡</strong> 자체의 환산값입니다. 아파트에서 관습적으로 부르는 평형은 복도·계단 등 주거 공용면적을 더한 <strong>공급면적</strong>을 평으로 환산한 값인 경우가 많아 약 33~35평형이 됩니다. 단지와 평면마다 공용면적 비율이 달라 하나의 고정값은 아닙니다.</p></div>
          <div className="overflow-x-auto border-t border-gray-200">
            <table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="bg-gray-50 text-gray-600"><th className="px-4 py-3">전용면적</th><th className="px-4 py-3">전용면적 환산</th><th className="px-4 py-3">공급면적 예시</th><th className="px-4 py-3">통칭 평형 예시</th></tr></thead><tbody>{apartmentExamples.map((row) => <tr key={row.exclusive} className="border-t border-gray-100"><td className="px-4 py-3 font-bold">{row.exclusive}</td><td className="px-4 py-3">{row.exclusivePyeong}</td><td className="px-4 py-3">{row.supply}</td><td className="px-4 py-3">{row.called}</td></tr>)}</tbody></table>
          </div>
          <p className="border-t border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">표의 공급면적과 통칭 평형은 이해를 위한 범위 예시입니다. 계약면적은 공급면적에 지하주차장 같은 기타 공용면적까지 포함하므로 분양계약서의 면적표를 확인하세요.</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950"><strong>단위 기준</strong><p className="mt-2">공식 계약·광고에서는 법정단위인 ㎡를 기준으로 확인하세요. 평은 비교 편의를 위한 환산값이며 표시 자릿수 때문에 역변환 시 작은 반올림 차이가 날 수 있습니다.</p><a href="https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260303&lsiSeq=280029&urlMode=lsInfoP" target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold underline">국가법령정보센터 · 계량에 관한 법률</a></div>
      </section>

      <RelatedTools current="pyeong" />
    </div>
  );
}
