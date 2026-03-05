"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type Category = "length" | "weight" | "temperature" | "area" | "volume";

const UNITS: Record<Category, { name: string; units: { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  length: {
    name: "길이",
    units: [
      { label: "밀리미터 (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "센티미터 (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { label: "미터 (m)", toBase: (v) => v, fromBase: (v) => v },
      { label: "킬로미터 (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "인치 (inch)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { label: "피트 (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { label: "야드 (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { label: "마일 (mile)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ],
  },
  weight: {
    name: "무게",
    units: [
      { label: "밀리그램 (mg)", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
      { label: "그램 (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "킬로그램 (kg)", toBase: (v) => v, fromBase: (v) => v },
      { label: "톤 (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "온스 (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { label: "파운드 (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { label: "근", toBase: (v) => v * 0.6, fromBase: (v) => v / 0.6 },
    ],
  },
  temperature: {
    name: "온도",
    units: [
      { label: "섭씨 (℃)", toBase: (v) => v, fromBase: (v) => v },
      { label: "화씨 (℉)", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
      { label: "켈빈 (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  area: {
    name: "넓이",
    units: [
      { label: "제곱미터 (m²)", toBase: (v) => v, fromBase: (v) => v },
      { label: "제곱킬로미터 (km²)", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      { label: "평", toBase: (v) => v * 3.30579, fromBase: (v) => v / 3.30579 },
      { label: "에이커 (acre)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { label: "헥타르 (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ],
  },
  volume: {
    name: "부피",
    units: [
      { label: "밀리리터 (ml)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "리터 (L)", toBase: (v) => v, fromBase: (v) => v },
      { label: "갤런 (gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { label: "컵 (cup)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    ],
  },
};

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "length", label: "길이" },
  { key: "weight", label: "무게" },
  { key: "temperature", label: "온도" },
  { key: "area", label: "넓이" },
  { key: "volume", label: "부피" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleReset = () => {
    setValue("");
    setFromIdx(0);
    setToIdx(1);
    setCopied(false);
  };

  const cat = UNITS[category];
  const inputVal = parseFloat(value) || 0;
  const baseVal = cat.units[fromIdx]?.toBase(inputVal) ?? 0;
  const converted = cat.units[toIdx]?.fromBase(baseVal) ?? 0;

  const displayResult = inputVal !== 0 ? (Math.round(converted * 10000) / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 4 }) : "0";

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">단위 변환기</h1>
      <p className="text-gray-500 mb-8">길이, 무게, 온도, 넓이, 부피를 간편하게 변환합니다.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => { setCategory(c.key); setFromIdx(0); setToIdx(1); setValue(""); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">변환할 값</label>
          <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 전</label>
            <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {cat.units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 후</label>
            <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {cat.units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            초기화
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 text-white p-6 text-center">
          <p className="text-blue-100 text-sm mb-1">변환 결과</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-bold">{displayResult}</p>
            <button
              onClick={() => handleCopy(`${displayResult} ${cat.units[toIdx]?.label}`)}
              className="text-sm text-blue-200 hover:text-white transition-colors"
              title="복사"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-1">{cat.units[toIdx]?.label}</p>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 사용하는 단위 변환 모음</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              일상생활과 업무에서 자주 사용하는 단위 변환 값을 정리했습니다.
            </p>
            <div className="overflow-x-auto">
              <div className="overflow-x-auto"><table className="w-full text-sm text-gray-600 border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium text-gray-800">분류</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-800">변환</th>
                    <th className="text-left py-2 font-medium text-gray-800">값</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 pr-4">길이</td><td className="py-2 pr-4">1인치(inch)</td><td className="py-2">= 2.54 cm</td></tr>
                  <tr><td className="py-2 pr-4">길이</td><td className="py-2 pr-4">1피트(ft)</td><td className="py-2">= 30.48 cm</td></tr>
                  <tr><td className="py-2 pr-4">길이</td><td className="py-2 pr-4">1마일(mile)</td><td className="py-2">= 1.609 km</td></tr>
                  <tr><td className="py-2 pr-4">길이</td><td className="py-2 pr-4">1야드(yd)</td><td className="py-2">= 91.44 cm</td></tr>
                  <tr><td className="py-2 pr-4">무게</td><td className="py-2 pr-4">1파운드(lb)</td><td className="py-2">= 0.4536 kg</td></tr>
                  <tr><td className="py-2 pr-4">무게</td><td className="py-2 pr-4">1온스(oz)</td><td className="py-2">= 28.35 g</td></tr>
                  <tr><td className="py-2 pr-4">무게</td><td className="py-2 pr-4">1근</td><td className="py-2">= 600 g</td></tr>
                  <tr><td className="py-2 pr-4">넓이</td><td className="py-2 pr-4">1평</td><td className="py-2">= 3.306 m²</td></tr>
                  <tr><td className="py-2 pr-4">넓이</td><td className="py-2 pr-4">1에이커(acre)</td><td className="py-2">= 4,047 m²</td></tr>
                  <tr><td className="py-2 pr-4">온도</td><td className="py-2 pr-4">섭씨 → 화씨</td><td className="py-2">°F = °C x 9/5 + 32</td></tr>
                  <tr><td className="py-2 pr-4">부피</td><td className="py-2 pr-4">1갤런(gal)</td><td className="py-2">= 3.785 L</td></tr>
                </tbody>
              </table></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">한국에서 많이 쓰는 단위</h2>
            <p className="text-gray-600 leading-relaxed">
              한국에서는 미터법 외에도 전통 단위가 일상생활에서 여전히 사용됩니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>평(坪):</strong> 부동산에서 가장 많이 쓰이는 넓이 단위입니다. 1평 = 약 3.306m²입니다. 법적으로는 m² 표기가 의무이지만, 실생활에서는 여전히 &quot;30평 아파트&quot;처럼 평을 사용합니다. m²를 평으로 바꾸려면 0.3025를 곱하면 됩니다.</li>
              <li><strong>근(斤):</strong> 고기나 과일의 무게를 잴 때 사용합니다. 1근 = 600g입니다. 정육점에서 &quot;삼겹살 1근&quot;이라고 하면 600g을 의미합니다. 한약재는 1근 = 375g으로 다르게 적용됩니다.</li>
              <li><strong>되:</strong> 곡식의 부피를 재는 전통 단위입니다. 1되 = 약 1.8L입니다. 쌀을 살 때 &quot;쌀 한 되&quot;라고 하면 약 1.8L 정도의 양입니다.</li>
              <li><strong>홉(合):</strong> 1되의 1/10에 해당하는 작은 부피 단위입니다. 1홉 = 약 180ml로, 소주잔 정도의 크기입니다. 밥솥에서 쌀을 계량할 때 사용하는 컵이 약 1홉입니다.</li>
              <li><strong>관(貫):</strong> 무게 단위로 1관 = 3.75kg입니다. 현재는 거의 사용되지 않지만, 과거 금이나 귀금속의 무게를 잴 때 쓰였습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">미국은 왜 아직도 인치, 파운드를 사용하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  미국은 세계에서 미터법을 공식 채택하지 않은 몇 안 되는 국가 중 하나입니다. 영국 제국 단위(Imperial units)에서 파생된 미국 관용 단위(US customary units)를 사용합니다. 1975년 미터법 전환법이 통과되었지만 강제성이 없어 산업과 일상에서 여전히 인치, 파운드, 화씨를 사용합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">평과 제곱미터(m²)는 어떻게 변환하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  1평 = 약 3.3058m²입니다. m²를 평으로 변환하려면 3.3058로 나누면 됩니다. 쉽게 계산하려면 m² 값에 0.3025를 곱하세요. 예를 들어 84m² 아파트는 약 25.4평(전용면적 기준)입니다. 부동산에서 흔히 말하는 &quot;32평형&quot;은 공급면적 기준으로 전용면적과 다릅니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">해외 직구할 때 신발 사이즈는 어떻게 변환하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  한국은 mm 단위(예: 260mm), 미국은 US 사이즈(예: 남성 8, 여성 9.5), 유럽은 EU 사이즈(예: 42)를 사용합니다. 대략적으로 한국 260mm = US 남성 8 = EU 42입니다. 브랜드마다 차이가 있으므로 해당 브랜드의 사이즈 차트를 참고하는 것이 가장 정확합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="unit-converter" />
</div>
  );
}
